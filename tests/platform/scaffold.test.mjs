import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-scaffold-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const dir of ['scripts', 'pipelines/portfolio', 'templates/docs', 'templates/prompts', 'templates/marketing-starter/node_modules', 'templates/marketing-starter/.git', 'templates/marketing-starter/.next', 'templates/marketing-starter/security/semgrep']) mkdirSync(join(root, dir), { recursive: true });
  cpSync(new URL('../../scripts/new-project.mjs', import.meta.url), join(root, 'scripts/new-project.mjs'));
  cpSync(new URL('../../templates/marketing-starter/security/semgrep/ui-builder.yml', import.meta.url), join(root, 'templates/marketing-starter/security/semgrep/ui-builder.yml'));
  cpSync(new URL('../../templates/marketing-starter/security/semgrep/LICENSE', import.meta.url), join(root, 'templates/marketing-starter/security/semgrep/LICENSE'));
  writeFileSync(join(root, 'pipelines/portfolio/stack.json'), '{}');
  writeFileSync(join(root, 'templates/marketing-starter/package.json'), '{"name":"starter"}');
  writeFileSync(join(root, 'templates/marketing-starter/.env.local'), 'SECRET=private');
  writeFileSync(join(root, 'templates/marketing-starter/.env.example'), 'SECRET=');
  writeFileSync(join(root, 'templates/marketing-starter/app.ts'), 'export const page = true;');
  writeFileSync(join(root, 'templates/docs/PRODUCT.md'), '# {{slug}}');
  writeFileSync(join(root, 'templates/docs/BACKLINKS.json'), '{"site":"{{slug}}"}');
  writeFileSync(join(root, 'templates/docs/BACKLINKS.schema.json'), '{}');
  writeFileSync(join(root, 'templates/docs/VISUAL_OUTCOME.json'), '{"project":"{{slug}}"}');
  writeFileSync(join(root, 'templates/prompts/PRODUCTION_READINESS_AUDIT.md'), '# Audit {{slug}}');
  return { root, run: (...args) => spawnSync(process.execPath, [join(root, 'scripts/new-project.mjs'), ...args], { encoding: 'utf8', env: { ...process.env, UIBUILDER_SKIP_GITHUB: '1', GIT_AUTHOR_NAME: 'UIBuilder Test', GIT_AUTHOR_EMAIL: 'uibuilder@example.invalid', GIT_COMMITTER_NAME: 'UIBuilder Test', GIT_COMMITTER_EMAIL: 'uibuilder@example.invalid' } }) };
}

test('scaffold creates an external independent Git repository and copies only clean source', (t) => {
  const { root, run } = fixture(t);
  const projectsRoot = join(root, 'external-sites');
  const result = run('portfolio', 'sample', '--root', projectsRoot);
  assert.equal(result.status, 0, result.stderr);
  const dest = join(projectsRoot, 'sample');
  for (const excluded of ['node_modules', '.next', '.env.local']) assert.equal(existsSync(join(dest, excluded)), false, excluded);
  assert.equal(readFileSync(join(dest, 'app.ts'), 'utf8'), 'export const page = true;');
  assert.equal(existsSync(join(dest, '.env.example')), true);
  assert.equal(JSON.parse(readFileSync(join(dest, 'package.json'))).name, 'sample');
  assert.equal(readFileSync(join(dest, 'docs/PRODUCT.md'), 'utf8'), '# sample');
  assert.equal(JSON.parse(readFileSync(join(dest, 'docs/BACKLINKS.json'), 'utf8')).site, 'sample');
  assert.equal(existsSync(join(dest, 'docs/BACKLINKS.schema.json')), true);
  assert.equal(JSON.parse(readFileSync(join(dest, 'docs/VISUAL_OUTCOME.json'), 'utf8')).project, 'sample');
  assert.equal(readFileSync(join(dest, 'docs/prompts/PRODUCTION_READINESS_AUDIT.md'), 'utf8'), '# Audit sample');
  assert.equal(existsSync(join(dest, 'security/semgrep/ui-builder.yml')), true);
  assert.equal(existsSync(join(dest, 'security/semgrep/LICENSE')), true);
  const git = spawnSync('git', ['-C', dest, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  assert.equal(git.status, 0, git.stderr);
  assert.equal(git.stdout.trim().replaceAll('\\', '/'), dest.replaceAll('\\', '/'));
});

test('invalid slug and unknown options leave no project', (t) => {
  const { root, run } = fixture(t);
  for (const args of [['portfolio', '../escape'], ['portfolio', 'valid', '--overwrite']]) assert.equal(run(...args).status, 2);
  assert.equal(existsSync(join(root, 'projects')), false);
});

test('existing project is never overwritten', (t) => {
  const { root, run } = fixture(t);
  const projectsRoot = join(root, 'external-sites');
  mkdirSync(join(projectsRoot, 'sample'), { recursive: true });
  writeFileSync(join(projectsRoot, 'sample/owner.txt'), 'keep');
  assert.equal(run('portfolio', 'sample', '--root', projectsRoot).status, 1);
  assert.equal(readFileSync(join(projectsRoot, 'sample/owner.txt'), 'utf8'), 'keep');
});
