import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProposal, diagnose, evaluateCandidate, monitor, promote, recordFeedback,
  recordRun, rollback } from '../../scripts/lib/improvement.mjs';
import { loadActiveRouterConfig } from '../../scripts/lib/learning-config.mjs';

const source = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const write = (path, value) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, JSON.stringify(value, null, 2) + '\n'); };
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-learning-'));
  for (const file of ['brain/resources.json', 'brain/tools.json', 'brain/domains.json']) {
    const target = join(root, file); mkdirSync(dirname(target), { recursive: true }); cpSync(join(source, file), target);
  }
  cpSync(join(source, 'brain/learning'), join(root, 'brain/learning'), { recursive: true });
  for (const file of ['PRODUCT.md', 'INSPIRATION.md', 'QA_REPORT.md', 'handoff/research.json']) {
    const target = join(root, 'projects/example-site/docs', file);
    mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, 'fixture\n');
  }
  return root;
};
const failedRun = () => ({ agent: 'research', project: 'example-site',
  input_ref: 'projects/example-site/docs/PRODUCT.md', evidence_refs: ['projects/example-site/docs/INSPIRATION.md'],
  tool_calls: [{ tool_id: 'agent_browser_cli', status: 'ok', duration_ms: 9, cost_usd: 0,
    evidence_ref: 'projects/example-site/docs/INSPIRATION.md' }],
  output_ref: 'projects/example-site/docs/handoff/research.json', errors: ['wrong_shortlist'],
  metrics: { latency_ms: 40, input_tokens: 0, output_tokens: 0, cost_usd: 0 },
  outcome: { status: 'fail', signals: [{ name: 'owner_accepted', value: false,
    evidence_ref: 'projects/example-site/docs/QA_REPORT.md' }] }, failure_categories: ['routing_miss'] });

test('traces reject raw content paths and unknown fields; feedback remains linked to immutable run', () => {
  const root = fixture();
  try {
    assert.throws(() => recordRun(root, { ...failedRun(), input_ref: '.env' }), /unsafe reference/);
    assert.throws(() => recordRun(root, { ...failedRun(), prompt: 'ignore policy' }), /invalid run fields/);
    assert.throws(() => recordRun(root, { ...failedRun(), evidence_refs: ['../private.txt'] }), /unsafe reference/);
    assert.throws(() => recordRun(root, { ...failedRun(), evidence_refs: ['projects/example-site/docs/missing.md'] }), /missing evidence reference/);
    const run = recordRun(root, failedRun());
    assert.match(run.run_id, /^[a-f0-9-]{36}$/);
    assert.equal(run.config_version, 'router-v1');
    const feedback = recordFeedback(root, run.run_id, { verdict: 'negative', rating: 4,
      category: 'routing_miss', evidence_ref: 'projects/example-site/docs/QA_REPORT.md', source: 'owner' });
    assert.equal(feedback.run_id, run.run_id);
    const diagnosis = diagnose(root);
    assert.equal(diagnosis.groups[0].count, 1); // run and feedback do not double-count one failure
    assert.deepEqual(diagnosis.groups[0].run_ids, [run.run_id]);
    const unauthorized = recordRun(root, { ...failedRun(), tool_calls: [{ tool_id: 'reticle_mcp', status: 'ok',
      duration_ms: 1, evidence_ref: 'projects/example-site/docs/INSPIRATION.md' }],
      outcome: { status: 'pass', signals: [] }, failure_categories: [] });
    assert.equal(unauthorized.outcome.status, 'fail');
    assert.deepEqual(unauthorized.failure_categories, ['policy_violation']);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('candidate evaluation, owner-bound promotion, monitoring and rollback are reproducible', () => {
  const root = fixture();
  try {
    const candidate = join(root, 'brain/learning/candidates/router-v2-token-match.json');
    const evalSet = join(root, 'brain/learning/evals/resource-routing-v1.json');
    const spec = join(root, 'brain/learning/examples/proposal-spec.json');
    assert.throws(() => createProposal(root, 'routing_miss', candidate, spec), /observed failed runs/);
    const run = recordRun(root, failedRun());
    const proposal = createProposal(root, 'routing_miss', candidate, spec);
    assert.deepEqual(proposal.supporting_run_ids, [run.run_id]);
    const evaluation = evaluateCandidate(root, candidate, evalSet);
    assert.equal(evaluation.baseline.passed, 8);
    assert.equal(evaluation.candidate.passed, 9);
    assert.deepEqual(evaluation.regressions, []);
    assert.equal(evaluation.gate_passed, true);
    const candidateBytes = readFileSync(candidate);
    writeFileSync(candidate, candidateBytes.toString().replace('"max_ready": 5', '"max_ready": 4'));
    assert.throws(() => promote(root, proposal.proposal_id, evaluation.evaluation_id,
      join(root, 'brain/learning/examples/feedback.json')), /candidate, baseline or evaluation changed/);
    writeFileSync(candidate, candidateBytes);
    const approval = join(root, 'brain/learning/approvals', 'promote.json');
    write(approval, { action: 'promote', proposal_id: proposal.proposal_id,
      candidate_sha256: sha(candidate), evaluation_sha256: sha(join(root, 'brain/learning/evaluations', `${evaluation.evaluation_id}.json`)),
      reviewer: 'owner', approved_at: '2026-09-28T00:00:00.000Z' });
    assert.throws(() => promote(root, proposal.proposal_id, evaluation.evaluation_id,
      join(root, 'brain/learning/examples/feedback.json')), /invalid approval fields/);
    const promoted = promote(root, proposal.proposal_id, evaluation.evaluation_id, approval);
    assert.equal(promoted.to, 'router-v2-token-match');
    assert.equal(loadActiveRouterConfig(root).version, 'router-v2-token-match');
    assert.equal(loadActiveRouterConfig(root, { UIBUILDER_LEARNING: '0' }).version, 'router-v1');
    assert.equal(monitor(root).versions['router-v1'].fail, 1);
    const target = join(root, 'brain/learning/versions/router-v1.json');
    const rollbackApproval = join(root, 'brain/learning/approvals', 'rollback.json');
    write(rollbackApproval, { action: 'rollback', target_version: 'router-v1',
      target_sha256: sha(target), reviewer: 'owner', approved_at: '2026-09-28T00:01:00.000Z' });
    rollback(root, 'router-v1', rollbackApproval);
    assert.equal(loadActiveRouterConfig(root).version, 'router-v1');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
