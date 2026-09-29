#!/usr/bin/env node
// Check the harness contracts without touching an external site repository.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const json = process.argv.includes('--json');
const checks = [];
const add = (name, ok, detail = '') => checks.push({ name, ok: Boolean(ok), detail });
const run = (name, args) => {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  add(name, result.status === 0, (result.stderr || result.stdout).trim().split(/\r?\n/).slice(-1)[0] || '');
};

for (const file of ['AGENTS.md', 'README.md', 'LICENSE', '.gitignore']) add(`required file ${file}`, existsSync(join(root, file)));
for (const file of ['build.md', 'brag.md', 'gate.md', 'improve.md', 'intake.md', 'learn.md', 'connect.md']) {
  add(`command ${file}`, existsSync(join(root, '.claude', 'commands', file)));
}
for (const file of ['backend.md', 'brain-evaluator.md', 'design-director.md', 'domain-ops.md', 'frontend.md', 'growth.md', 'product-manager.md', 'research.md', 'ship.md', 'taste-research.md', 'ux.md']) {
  add(`agent ${file}`, existsSync(join(root, '.claude', 'agents', file)));
}
run('brain validation', ['scripts/validate-brain.mjs']);
run('contract validation', ['scripts/validate-contracts.mjs']);

const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === 'win32' ? 'D:\\UiBuildProj' : join(root, '..', 'UiBuildProj'));
add('external projects root', existsSync(projectsRoot), projectsRoot);
const failed = checks.filter((check) => !check.ok);
if (json) console.log(JSON.stringify({ ok: failed.length === 0, checks }, null, 2));
else {
  for (const check of checks) console.log(`${check.ok ? '✓' : '✗'} ${check.name}${check.detail ? ` (${check.detail})` : ''}`);
  console.log(failed.length ? `\n✗ harness health failed (${failed.length}/${checks.length})` : `\n✓ harness health passed (${checks.length} checks)`);
}
process.exit(failed.length ? 1 : 0);
