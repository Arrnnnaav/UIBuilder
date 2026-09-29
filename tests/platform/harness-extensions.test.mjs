import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const run = (script, args, env = {}) => {
  const result = spawnSync(process.execPath, [join(root, script), ...args],
    { cwd: root, encoding: 'utf8', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `exit ${result.status}`);
  return result.stdout;
};

test('existing-site scanner migration defaults to dry run, applies additively, and never overwrites', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uib-migrate-'));
  try {
    const project = join(dir, 'demo'); mkdirSync(join(project, '.git'), { recursive: true });
    const dry = JSON.parse(run('scripts/migrate-site-security.mjs', ['demo', '--root', dir]));
    assert.equal(dry.mode, 'dry-run'); assert.equal(dry.files.length, 4); assert.equal(existsSync(join(project, '.github')), false);
    const applied = JSON.parse(run('scripts/migrate-site-security.mjs', ['demo', '--root', dir, '--apply']));
    assert.equal(applied.applied, true);
    assert.match(readFileSync(join(project, 'security/semgrep/ui-builder.yml'), 'utf8'), /outerHTML/);
    assert.match(readFileSync(join(project, 'scripts/check-security-rules.mjs'), 'utf8'), /negative_probe_passed/);
    assert.match(readFileSync(join(project, '.github/workflows/security.yml'), 'utf8'), /gitleaks@sha256/);
    assert.throws(() => run('scripts/migrate-site-security.mjs', ['demo', '--root', dir, '--apply']), /existing files/);
    assert.match(readFileSync(join(project, '.github/workflows/security.yml'), 'utf8'), /Security baseline/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('runtime packet is host-managed and event ledger rejects policy-like unsafe refs', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uib-runtime-'));
  try {
    const project = join(dir, 'demo'); mkdirSync(project);
    const packet = JSON.parse(run('scripts/runtime.mjs', ['packet', 'portfolio', 'demo', 'S2', 'research'], { UIBUILDER_PROJECTS_ROOT: dir }));
    assert.equal(packet.execution.auto_spawn, false); assert.equal(packet.execution.mode, 'host_managed');
    const event = join(dir, 'event.json');
    writeFileSync(event, JSON.stringify({ task_id: packet.task_id, stage: 'S2', agent: 'research', status: 'completed',
      recorded_at: new Date().toISOString(), run_id: null, output_refs: ['docs/INSPIRATION.md'], failure_code: null }));
    run('scripts/runtime.mjs', ['event', 'demo', event], { UIBUILDER_PROJECTS_ROOT: dir });
    const status = JSON.parse(run('scripts/runtime.mjs', ['status', 'demo'], { UIBUILDER_PROJECTS_ROOT: dir }));
    assert.equal(status.tasks.length, 1); assert.equal(status.tasks[0].status, 'completed');
    const bad = join(dir, 'bad.json');
    writeFileSync(bad, JSON.stringify({ task_id: packet.task_id, stage: 'S2', agent: 'research', status: 'completed',
      recorded_at: new Date().toISOString(), run_id: null, output_refs: ['.env'], failure_code: null }));
    assert.throws(() => run('scripts/runtime.mjs', ['event', 'demo', bad], { UIBUILDER_PROJECTS_ROOT: dir }), /invalid event fields/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('product-site pipeline is discoverable and visual outcome validator keeps gate authority false', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uib-visual-'));
  try {
    const project = join(dir, 'demo'); mkdirSync(join(project, 'docs'), { recursive: true });
    writeFileSync(join(project, 'docs', 'design.html'), '<main>design</main>');
    const outcome = { schema_version: 1, project: 'demo', build_id: 'b1', reviewer: 'owner', reviewed_at: new Date().toISOString(),
      artifact_refs: ['design.html'], evidence_refs: ['design.html'],
      ratings: Object.fromEntries(['distinctiveness','story_clarity','motion_with_purpose','visual_craft','coherence','usability_without_motion'].map((k) => [k, 4])),
      owner_verdict: 'approve' };
    const file = join(project, 'docs', 'VISUAL_OUTCOME.json'); writeFileSync(file, JSON.stringify(outcome));
    const report = JSON.parse(run('scripts/visual-eval.mjs', [file], { UIBUILDER_PROJECTS_ROOT: dir }));
    assert.equal(report.diagnostic_threshold_passed, true); assert.equal(report.gate_authority, false);
    assert.match(readFileSync(join(root, 'pipelines/product-site/PIPELINE.md'), 'utf8'), /two distinct/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
