import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { performance } from 'node:perf_hooks';
import { baselineVersion, loadActiveRouterConfig, validateRouterConfig } from './learning-config.mjs';
import { recommend } from './resource-selector.mjs';

const categories = new Set(['routing_miss', 'evidence_quality', 'tool_failure', 'gate_failure',
  'rights_block', 'performance', 'owner_rejection', 'policy_violation', 'other']);
const agents = new Set(['orchestrator', 'product-manager', 'research', 'taste-research', 'ux',
  'design-director', 'frontend', 'backend', 'growth', 'ship', 'domain-ops']);
const verdicts = new Set(['positive', 'negative', 'neutral']);
const safeId = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,80}$/i.test(value);
const isoNow = () => new Date().toISOString();
const hash = (value) => createHash('sha256').update(value).digest('hex');
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
const learning = (root) => join(root, 'brain', 'learning');
const exactKeys = (value, keys, name) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
    Object.keys(value).some((key) => !keys.includes(key))) throw new Error(`invalid ${name} fields`);
};
const requireFields = (value, keys, name) => {
  for (const key of keys) if (!Object.hasOwn(value, key)) throw new Error(`missing ${name}.${key}`);
};
const boundedArray = (value, name, max = 100) => {
  if (!Array.isArray(value) || value.length > max) throw new Error(`invalid ${name}`);
  return value;
};
const count = (value, name) => {
  if (!Number.isFinite(value) || value < 0 || value > 1e9) throw new Error(`invalid ${name}`);
  return value;
};
const measured = (value, name) => value === null || value === undefined ? null : count(value, name);
const safeRef = (value) => {
  if (typeof value !== 'string' || value.length > 240 || !value || /[\r\n?#]/.test(value)) throw new Error('invalid reference');
  if (/^sha256:[a-f0-9]{64}$/.test(value)) return value;
  const normalized = value.replaceAll('\\', '/');
  if (normalized.startsWith('/') || normalized.includes('//') || normalized.split('/').some((part) => part === '..' || part === '.') ||
    /(^|\/)(\.env(?:\.|$)|secrets?|credentials?|private)(\/|\.|$)/i.test(normalized) ||
    !/^[a-zA-Z0-9_./ -]+$/.test(normalized)) throw new Error('unsafe reference');
  return normalized;
};
const verifiedRef = (root, value) => {
  const ref = safeRef(value);
  if (!ref.startsWith('sha256:') && !existsSync(join(root, ref))) throw new Error(`missing evidence reference: ${ref}`);
  return ref;
};
const safePath = (root, path) => {
  const resolved = resolve(path);
  const rel = relative(root, resolved);
  if (!rel || rel.startsWith(`..${sep}`) || rel === '..' || rel.includes(`${sep}.env`)) throw new Error('file must be inside repository');
  return resolved;
};
const writeNew = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const writeAtomic = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temp, JSON.stringify(value, null, 2) + '\n');
  renameSync(temp, path);
};
const files = (dir) => existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.json')).map((name) => json(join(dir, name))) : [];

export function recordRun(root, input) {
  const runFields = ['agent', 'project', 'input_ref', 'evidence_refs', 'tool_calls', 'output_ref',
    'errors', 'metrics', 'outcome', 'failure_categories'];
  exactKeys(input, runFields, 'run'); requireFields(input, runFields, 'run');
  if (!agents.has(input.agent) || !safeId(input.project)) throw new Error('unknown agent or project');
  const toolRegistry = json(join(root, 'brain', 'tools.json')).tools;
  const toolIds = new Set(toolRegistry.map((tool) => tool.id));
  const evidence = boundedArray(input.evidence_refs, 'evidence_refs').map((ref) => verifiedRef(root, ref));
  const calls = boundedArray(input.tool_calls, 'tool_calls').map((call) => {
    exactKeys(call, ['tool_id', 'status', 'duration_ms', 'cost_usd', 'evidence_ref'], 'tool call');
    if (!toolIds.has(call.tool_id) || !['ok', 'error', 'skipped'].includes(call.status)) throw new Error('unknown tool call');
    return { tool_id: call.tool_id, status: call.status, duration_ms: measured(call.duration_ms, 'duration'),
      cost_usd: measured(call.cost_usd, 'cost'), evidence_ref: call.evidence_ref ? verifiedRef(root, call.evidence_ref) : null };
  });
  exactKeys(input.metrics, ['latency_ms', 'input_tokens', 'output_tokens', 'cost_usd'], 'metrics');
  requireFields(input.metrics, ['latency_ms', 'input_tokens', 'output_tokens', 'cost_usd'], 'metrics');
  exactKeys(input.outcome, ['status', 'signals'], 'outcome');
  requireFields(input.outcome, ['status', 'signals'], 'outcome');
  if (!['pass', 'fail', 'pending'].includes(input.outcome.status)) throw new Error('invalid outcome');
  const signals = boundedArray(input.outcome.signals, 'signals').map((signal) => {
    exactKeys(signal, ['name', 'value', 'evidence_ref'], 'signal');
    if (!safeId(signal.name) || ['tool_policy_ok', 'tool_call_errors'].includes(signal.name) ||
      !['boolean', 'number'].includes(typeof signal.value)) throw new Error('invalid signal');
    return { name: signal.name, value: signal.value, evidence_ref: verifiedRef(root, signal.evidence_ref) };
  });
  const failureCategories = [...boundedArray(input.failure_categories, 'failure_categories', 12)];
  if (failureCategories.some((category) => !categories.has(category))) throw new Error('invalid failure category');
  const errors = boundedArray(input.errors, 'errors').map((error) => {
    if (!safeId(error)) throw new Error('errors must be short codes');
    return error;
  });
  const config = loadActiveRouterConfig(root);
  const toolPolicyViolations = calls.filter((call) => !toolRegistry.find((tool) =>
    tool.id === call.tool_id && tool.agents.includes(input.agent))).map((call) => call.tool_id);
  if (toolPolicyViolations.length && !failureCategories.includes('policy_violation')) failureCategories.push('policy_violation');
  if (input.outcome.status === 'fail' && !failureCategories.length) throw new Error('failed run needs a category');
  const derivedSignals = [
    { name: 'tool_policy_ok', value: toolPolicyViolations.length === 0, evidence_ref: 'sha256:' + hash(JSON.stringify(calls)) },
    { name: 'tool_call_errors', value: calls.filter((call) => call.status === 'error').length,
      evidence_ref: 'sha256:' + hash(JSON.stringify(calls)) },
  ];
  const run = {
    schema_version: 1, run_id: randomUUID(), recorded_at: isoNow(), agent: input.agent,
    project: input.project, config_version: config.version,
    input_ref: verifiedRef(root, input.input_ref), evidence_refs: evidence, tool_calls: calls,
    output_ref: input.output_ref ? verifiedRef(root, input.output_ref) : null, errors,
    metrics: { latency_ms: measured(input.metrics.latency_ms, 'latency'),
      input_tokens: measured(input.metrics.input_tokens, 'input tokens'),
      output_tokens: measured(input.metrics.output_tokens, 'output tokens'),
      cost_usd: measured(input.metrics.cost_usd, 'cost') },
    outcome: { status: toolPolicyViolations.length ? 'fail' : input.outcome.status, signals: [...signals, ...derivedSignals] },
    tool_policy_violations: toolPolicyViolations, failure_categories: failureCategories,
  };
  writeNew(join(learning(root), 'runs', `${run.run_id}.json`), run);
  return run;
}

export function recordFeedback(root, runId, input) {
  if (!/^[a-f0-9-]{36}$/.test(runId) || !existsSync(join(learning(root), 'runs', `${runId}.json`))) throw new Error('unknown run');
  exactKeys(input, ['verdict', 'rating', 'category', 'evidence_ref', 'source'], 'feedback');
  if (!verdicts.has(input.verdict) || !['owner', 'objective_check'].includes(input.source)) throw new Error('invalid feedback');
  if (input.rating !== null && input.rating !== undefined && (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 10)) throw new Error('invalid rating');
  if (input.category && !categories.has(input.category)) throw new Error('invalid feedback category');
  const feedback = { schema_version: 1, feedback_id: randomUUID(), run_id: runId, recorded_at: isoNow(),
    verdict: input.verdict, rating: input.rating ?? null, category: input.category ?? null,
    evidence_ref: verifiedRef(root, input.evidence_ref), source: input.source };
  writeNew(join(learning(root), 'feedback', `${feedback.feedback_id}.json`), feedback);
  return feedback;
}

export function diagnose(root) {
  const runs = files(join(learning(root), 'runs'));
  const feedback = files(join(learning(root), 'feedback'));
  const groups = new Map();
  const add = (category, runId) => {
    if (!groups.has(category)) groups.set(category, new Set());
    groups.get(category).add(runId);
  };
  for (const run of runs) for (const category of run.failure_categories) add(category, run.run_id);
  for (const item of feedback) if (item.verdict === 'negative') add(item.category ?? 'other', item.run_id);
  const report = { schema_version: 1, generated_at: isoNow(), run_count: runs.length,
    feedback_count: feedback.length, groups: [...groups.entries()].map(([category, ids]) =>
      ({ category, count: ids.size, run_ids: [...ids].sort() })).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category)) };
  writeAtomic(join(learning(root), 'diagnosis.json'), report);
  return report;
}

export function createProposal(root, category, candidatePath, specPath) {
  if (!categories.has(category)) throw new Error('unknown failure category');
  const group = diagnose(root).groups.find((item) => item.category === category);
  if (!group?.count) throw new Error('proposal needs observed failed runs');
  const candidateFile = safePath(root, candidatePath);
  const candidateBytes = readFileSync(candidateFile);
  const candidate = validateRouterConfig(JSON.parse(candidateBytes));
  const candidateRel = relative(root, candidateFile).replaceAll('\\', '/');
  if (!candidateRel.startsWith('brain/learning/candidates/')) throw new Error('candidate must be in brain/learning/candidates');
  const spec = json(safePath(root, specPath));
  exactKeys(spec, ['title', 'expected_benefit', 'regression_risk', 'rollback'], 'proposal spec');
  for (const value of Object.values(spec)) if (typeof value !== 'string' || value.length < 8 || value.length > 300 ||
    /[\r\n]|(?:api[_-]?key|authorization|secret\s*[:=]|token\s*[:=]|sk-[a-z0-9]{8,})/i.test(value))
    throw new Error('invalid or sensitive proposal text');
  const proposal = { schema_version: 1, proposal_id: randomUUID(), created_at: isoNow(),
    category, supporting_run_ids: group.run_ids, surface: candidate.surface,
    candidate_path: candidateRel, candidate_version: candidate.version,
    candidate_sha256: hash(candidateBytes), baseline_version: loadActiveRouterConfig(root).version,
    ...spec, status: 'proposed' };
  writeNew(join(learning(root), 'proposals', `${proposal.proposal_id}.json`), proposal);
  return proposal;
}

function scoreCases(root, config, cases) {
  const resources = json(join(root, 'brain', 'resources.json')).resources;
  const domains = json(join(root, 'brain', 'domains.json')).domains;
  const results = cases.map((item) => {
    const domain = domains.find((entry) => entry.id === item.domain);
    if (!domain) throw new Error(`unknown eval domain ${item.domain}`);
    const started = performance.now();
    const result = recommend(resources, domain, item.task,
      { availableTools: new Set(item.available_tools ?? []), config });
    const latencyMs = performance.now() - started;
    const ready = result.ready.map((entry) => entry.id);
    const review = result.review.map((entry) => entry.id);
    const missed = (item.expected_ready ?? []).filter((id) => !ready.includes(id));
    const misplaced = (item.expected_review ?? []).filter((id) => !review.includes(id));
    const forbidden = (item.forbidden_ready ?? []).filter((id) => ready.includes(id));
    const forbiddenReview = (item.forbidden_review ?? []).filter((id) => review.includes(id));
    const pass = !missed.length && !misplaced.length && !forbidden.length && !forbiddenReview.length &&
      (item.expect_no_ready ? ready.length === 0 : true);
    return { id: item.id, suite: item.suite, pass, ready, review, missed, misplaced, forbidden, forbidden_review: forbiddenReview,
      latency_ms: Math.round(latencyMs * 1000) / 1000, cost_usd: 0 };
  });
  const suites = Object.fromEntries(['target', 'regression', 'decline'].map((name) => {
    const matching = results.filter((item) => item.suite === name);
    return [name, { passed: matching.filter((item) => item.pass).length, total: matching.length }];
  }));
  return { cases: results, suites, passed: results.filter((item) => item.pass).length,
    total: results.length, total_latency_ms: Math.round(results.reduce((n, item) => n + item.latency_ms, 0) * 1000) / 1000,
    cost_usd: 0 };
}

export function evaluateCandidate(root, candidatePath, evalPath) {
  const candidateFile = safePath(root, candidatePath);
  const candidateBytes = readFileSync(candidateFile);
  const candidate = validateRouterConfig(JSON.parse(candidateBytes));
  const evalFile = safePath(root, evalPath);
  const evalBytes = readFileSync(evalFile);
  const suite = JSON.parse(evalBytes);
  if (suite.schema_version !== 1 || !Array.isArray(suite.cases) || suite.cases.length < 6) throw new Error('evaluation needs at least six cases');
  const ids = new Set();
  for (const item of suite.cases) {
    exactKeys(item, ['id', 'suite', 'domain', 'task', 'available_tools', 'expected_ready', 'expected_review',
      'forbidden_ready', 'forbidden_review', 'expect_no_ready'], 'eval case');
    if (!safeId(item.id) || ids.has(item.id) || !['target', 'regression', 'decline'].includes(item.suite) ||
      typeof item.task !== 'string' || item.task.length > 200) throw new Error('invalid eval case');
    ids.add(item.id);
  }
  const baseline = scoreCases(root, loadActiveRouterConfig(root), suite.cases);
  const candidateResult = scoreCases(root, candidate, suite.cases);
  const perCase = new Map(baseline.cases.map((item) => [item.id, item]));
  const regressions = candidateResult.cases.filter((item) => perCase.get(item.id).pass && !item.pass).map((item) => item.id);
  const improvements = candidateResult.cases.filter((item) => !perCase.get(item.id).pass && item.pass).map((item) => item.id);
  const gate = baseline.total >= 6 && Object.values(candidateResult.suites).every((s) => s.total > 0) &&
    candidateResult.suites.decline.passed === candidateResult.suites.decline.total &&
    regressions.length === 0 && candidateResult.passed >= baseline.passed && improvements.length > 0;
  const report = { schema_version: 1, evaluation_id: randomUUID(), generated_at: isoNow(),
    baseline_version: loadActiveRouterConfig(root).version, candidate_version: candidate.version,
    candidate_sha256: hash(candidateBytes), eval_set_sha256: hash(evalBytes), eval_set_ref: relative(root, evalFile).replaceAll('\\', '/'),
    baseline, candidate: candidateResult, regressions, improvements, gate_passed: gate,
    note: 'Fixture checks measure this deterministic selector only; real user outcome improvement is not established.' };
  writeNew(join(learning(root), 'evaluations', `${report.evaluation_id}.json`), report);
  return report;
}

export function promote(root, proposalId, evaluationId, approvalPath) {
  if (!/^[a-f0-9-]{36}$/.test(proposalId) || !/^[a-f0-9-]{36}$/.test(evaluationId)) throw new Error('invalid id');
  const base = learning(root);
  const proposalFile = join(base, 'proposals', `${proposalId}.json`);
  const evalFile = join(base, 'evaluations', `${evaluationId}.json`);
  const proposal = json(proposalFile);
  const evaluation = json(evalFile);
  if (hash(readFileSync(safePath(root, join(root, evaluation.eval_set_ref)))) !== evaluation.eval_set_sha256)
    throw new Error('evaluation set changed');
  const candidatePath = safePath(root, join(root, proposal.candidate_path));
  const candidateBytes = readFileSync(candidatePath);
  const candidate = validateRouterConfig(JSON.parse(candidateBytes));
  if (!evaluation.gate_passed || evaluation.candidate_version !== candidate.version ||
    evaluation.candidate_sha256 !== hash(candidateBytes) || proposal.candidate_sha256 !== hash(candidateBytes) ||
    proposal.baseline_version !== loadActiveRouterConfig(root).version || evaluation.baseline_version !== proposal.baseline_version)
    throw new Error('candidate, baseline or evaluation changed');
  const approval = json(safePath(root, approvalPath));
  exactKeys(approval, ['action', 'proposal_id', 'candidate_sha256', 'evaluation_sha256', 'reviewer', 'approved_at'], 'approval');
  if (approval.action !== 'promote' || approval.proposal_id !== proposalId ||
    approval.candidate_sha256 !== hash(candidateBytes) || approval.evaluation_sha256 !== hash(readFileSync(evalFile)) ||
    approval.reviewer !== 'owner' || !Number.isFinite(Date.parse(approval.approved_at))) throw new Error('owner approval mismatch');
  const target = join(base, 'versions', `${candidate.version}.json`);
  if (existsSync(target)) throw new Error('version already exists');
  copyFileSync(candidatePath, target, 1);
  writeAtomic(join(base, 'active.json'), { version: candidate.version });
  writeNew(join(base, 'promotions', `${randomUUID()}.json`),
    { action: 'promote', at: isoNow(), from: proposal.baseline_version, to: candidate.version,
      proposal_id: proposalId, evaluation_id: evaluationId, approval_ref: relative(root, resolve(approvalPath)).replaceAll('\\', '/') });
  return { from: proposal.baseline_version, to: candidate.version };
}

export function rollback(root, targetVersion, approvalPath) {
  if (!/^router-v[0-9]+(?:-[a-z0-9-]+)?$/.test(targetVersion)) throw new Error('invalid target');
  const base = learning(root);
  const targetFile = join(base, 'versions', `${targetVersion}.json`);
  const targetBytes = readFileSync(targetFile);
  validateRouterConfig(JSON.parse(targetBytes));
  const approval = json(safePath(root, approvalPath));
  exactKeys(approval, ['action', 'target_version', 'target_sha256', 'reviewer', 'approved_at'], 'approval');
  if (approval.action !== 'rollback' || approval.target_version !== targetVersion || approval.target_sha256 !== hash(targetBytes) ||
    approval.reviewer !== 'owner' || !Number.isFinite(Date.parse(approval.approved_at))) throw new Error('owner rollback approval mismatch');
  const prior = loadActiveRouterConfig(root).version;
  writeAtomic(join(base, 'active.json'), { version: targetVersion });
  writeNew(join(base, 'promotions', `${randomUUID()}.json`),
    { action: 'rollback', at: isoNow(), from: prior, to: targetVersion,
      approval_ref: relative(root, resolve(approvalPath)).replaceAll('\\', '/') });
  return { from: prior, to: targetVersion };
}

export function monitor(root) {
  const active = loadActiveRouterConfig(root).version;
  const runs = files(join(learning(root), 'runs'));
  const feedback = files(join(learning(root), 'feedback'));
  const byVersion = {};
  for (const run of runs) {
    const row = byVersion[run.config_version] ??= { runs: 0, pass: 0, fail: 0, pending: 0, measured_cost_usd: 0,
      measured_latency_ms: 0, cost_samples: 0, latency_samples: 0, negative_feedback: 0 };
    row.runs++; row[run.outcome.status]++;
    if (run.metrics.cost_usd !== null) { row.measured_cost_usd += run.metrics.cost_usd; row.cost_samples++; }
    if (run.metrics.latency_ms !== null) { row.measured_latency_ms += run.metrics.latency_ms; row.latency_samples++; }
  }
  const runVersions = new Map(runs.map((run) => [run.run_id, run.config_version]));
  for (const item of feedback) if (item.verdict === 'negative' && byVersion[runVersions.get(item.run_id)]) byVersion[runVersions.get(item.run_id)].negative_feedback++;
  for (const row of Object.values(byVersion)) row.avg_latency_ms = row.latency_samples ? Math.round(row.measured_latency_ms / row.latency_samples) : null;
  return { active_version: active, baseline_version: baselineVersion, versions: byVersion,
    note: 'Observed counts are not causal proof; compare like-for-like tasks and owner outcomes before claiming improvement.' };
}
