import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, cpSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/agent-bootstrap.mjs', import.meta.url));

test('review preflight reports missing unverified skill without failing or installing it', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-agent-bootstrap-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const project = join(root, 'site');
  mkdirSync(join(project, 'docs'), { recursive: true });
  cpSync(new URL('../../brain/agent-bootstrap.json', import.meta.url), join(project, 'docs/AGENT_BOOTSTRAP.json'));
  const env = { ...process.env, UIBUILDER_BOOTSTRAP_HOME: join(root, 'home'), CODEX_HOME: join(root, 'codex'), CLAUDE_CONFIG_DIR: join(root, 'claude') };
  const check = spawnSync(process.execPath, [script, '--task', 'review', '--project', project], { encoding: 'utf8', env });
  assert.equal(check.status, 0, check.stderr);
  const report = JSON.parse(check.stdout);
  assert.deepEqual(report.skills.map((skill) => skill.id), ['web-design-guidelines']);
  assert.equal(report.skills[0].installable, false);
  assert.deepEqual(report.required_missing, []);
  assert.equal(existsSync(join(root, 'home')), false);
});

test('frontend preflight identifies its required skill and check mode does not mutate hosts', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-agent-bootstrap-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const project = join(root, 'site');
  const installed = join(project, '.agents', 'skills', 'frontend-design');
  mkdirSync(join(project, 'docs'), { recursive: true });
  mkdirSync(installed, { recursive: true });
  cpSync(new URL('../../brain/agent-bootstrap.json', import.meta.url), join(project, 'docs/AGENT_BOOTSTRAP.json'));
  writeFileSync(join(installed, 'SKILL.md'), '# fixture');
  const env = { ...process.env, UIBUILDER_BOOTSTRAP_HOME: join(root, 'home'), CODEX_HOME: join(root, 'codex'), CLAUDE_CONFIG_DIR: join(root, 'claude') };
  const check = spawnSync(process.execPath, [script, '--task', 'frontend', '--project', project], { encoding: 'utf8', env });
  assert.equal(check.status, 0, check.stderr);
  const report = JSON.parse(check.stdout);
  const required = report.skills.find((skill) => skill.id === 'frontend-design');
  assert.deepEqual(required.installed_for, ['codex']);
  assert.deepEqual(required.missing_for, ['claude-code']);
  assert.deepEqual(report.required_missing, []);
  assert.deepEqual(report.parity_missing, [{ id: 'frontend-design', missing_for: ['claude-code'] }]);
  assert.equal(existsSync(join(root, 'claude')), false);
});
