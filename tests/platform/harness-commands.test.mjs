import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('../../scripts/brag.mjs', import.meta.url));
function fixture(t, withEvidence = true) {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-brag-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const project = join(root, 'sample');
  mkdirSync(join(project, 'docs'), { recursive: true });
  writeFileSync(join(project, 'AGENTS.md'), '# project rules');
  for (const file of ['PRODUCT.md', 'STATE.md', 'QA_REPORT.md', 'PERF_REPORT.md', 'GROWTH_REPORT.md']) writeFileSync(join(project, 'docs', file), `# ${file}
verified`);
  if (withEvidence) writeFileSync(join(project, 'docs', 'G3_EVIDENCE.json'), JSON.stringify({ sourceFingerprint: 'abc', reports: {}, snapshots: [], monitoring: {} }));
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, UIBUILDER_PROJECTS_ROOT: root } });
  return { root, project, run };
}

test('brag preflight refuses a project without current G3 evidence', (t) => {
  const { run } = fixture(t, false);
  const result = run('sample', 'product', '--check');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /G3_EVIDENCE/);
});

test('brag writes a source-backed package without changing app source', (t) => {
  const { project, run } = fixture(t);
  const result = run('sample', 'company');
  assert.equal(result.status, 0, result.stderr);
  const launch = join(project, 'docs', 'launch');
  for (const file of ['BRAG_BRIEF.md', 'PROMO_COPY.md', 'LAUNCH_SCRIPT.md', 'SHOT_LIST.md', 'BRAG_HANDOFF.json']) assert.equal(existsSync(join(launch, file)), true, file);
  assert.equal(JSON.parse(readFileSync(join(launch, 'BRAG_HANDOFF.json'))).mode, 'company');
  assert.equal(run('sample', 'company').status, 1);
});

test('brag check mode is non-mutating', (t) => {
  const { project, run } = fixture(t);
  const result = run('sample', 'product', '--check');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(join(project, 'docs', 'launch')), false);
});
