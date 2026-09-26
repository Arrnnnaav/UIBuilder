import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-scaffold-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const dir of ['scripts', 'pipelines/portfolio', 'templates/docs', 'templates/marketing-starter/node_modules', 'templates/marketing-starter/.git', 'templates/marketing-starter/.next']) mkdirSync(join(root, dir), { recursive: true });
  cpSync(new URL('../../scripts/new-project.mjs', import.meta.url), join(root, 'scripts/new-project.mjs'));
  writeFileSync(join(root, 'pipelines/portfolio/stack.json'), '{}');
  writeFileSync(join(root, 'templates/marketing-starter/package.json'), '{"name":"starter"}');
  writeFileSync(join(root, 'templates/marketing-starter/.env.local'), 'SECRET=private');
  writeFileSync(join(root, 'templates/marketing-starter/.env.example'), 'SECRET=');
  writeFileSync(join(root, 'templates/marketing-starter/app.ts'), 'export const page = true;');
  writeFileSync(join(root, 'templates/docs/PRODUCT.md'), '# {{slug}}');
  return { root, run: (...args) => spawnSync(process.execPath, [join(root, 'scripts/new-project.mjs'), ...args], { encoding: 'utf8' }) };
}

test('default scaffold stays in the parent repository and copies only clean source', (t) => {
  const { root, run } = fixture(t);
  const result = run('portfolio', 'sample');
  assert.equal(result.status, 0, result.stderr);
  const dest = join(root, 'projects/sample');
  for (const excluded of ['.git', 'node_modules', '.next', '.env.local']) assert.equal(existsSync(join(dest, excluded)), false, excluded);
  assert.equal(readFileSync(join(dest, 'app.ts'), 'utf8'), 'export const page = true;');
  assert.equal(existsSync(join(dest, '.env.example')), true);
  assert.equal(JSON.parse(readFileSync(join(dest, 'package.json'))).name, 'sample');
  assert.equal(readFileSync(join(dest, 'docs/PRODUCT.md'), 'utf8'), '# sample');
});

test('standalone scaffold explicitly initializes its own repository', (t) => {
  const { root, run } = fixture(t);
  const result = run('portfolio', 'sample', '--standalone');
  assert.equal(result.status, 0, result.stderr);
  const git = spawnSync('git', ['-C', join(root, 'projects/sample'), 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  assert.equal(git.status, 0, git.stderr);
  assert.equal(git.stdout.trim().replaceAll('\\', '/'), join(root, 'projects/sample').replaceAll('\\', '/'));
});

test('invalid slug and unknown options leave no project', (t) => {
  const { root, run } = fixture(t);
  for (const args of [['portfolio', '../escape'], ['portfolio', 'valid', '--overwrite']]) assert.equal(run(...args).status, 2);
  assert.equal(existsSync(join(root, 'projects')), false);
});

test('existing project is never overwritten', (t) => {
  const { root, run } = fixture(t);
  mkdirSync(join(root, 'projects/sample'), { recursive: true });
  writeFileSync(join(root, 'projects/sample/owner.txt'), 'keep');
  assert.equal(run('portfolio', 'sample').status, 1);
  assert.equal(readFileSync(join(root, 'projects/sample/owner.txt'), 'utf8'), 'keep');
});
