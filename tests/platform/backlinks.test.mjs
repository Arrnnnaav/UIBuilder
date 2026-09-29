import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/backlinks.mjs', import.meta.url));

test('backlink CLI initializes and reports a new external project without publishing', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-backlinks-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'site', 'docs'), { recursive: true });
  const run = (command) => spawnSync(process.execPath, [script, command, 'site'], { encoding: 'utf8', env: { ...process.env, UIBUILDER_PROJECTS_ROOT: root } });

  assert.equal(run('init').status, 0);
  assert.equal(run('validate').status, 0);
  assert.equal(run('report').status, 0);
  const records = JSON.parse(readFileSync(join(root, 'site', 'docs', 'BACKLINKS.json'), 'utf8'));
  assert.equal(records.owner_approval.publishing, false);
  assert.equal(existsSync(join(root, 'site', 'docs', 'BACKLINK_PLAN.md')), true);
  assert.match(readFileSync(join(root, 'site', 'docs', 'BACKLINK_REPORT.md'), 'utf8'), /verified links: 0/);
});

test('backlink CLI rejects a published record without evidence', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-backlinks-invalid-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'site', 'docs'), { recursive: true });
  writeFileSync(join(root, 'site', 'docs', 'BACKLINKS.json'), JSON.stringify({ schema_version: 1, site: 'site', owner_approval: { outreach: false, publishing: false, launch_submissions: false }, targets: [{ id: 'x', category: 'editorial', status: 'published', source_url: 'https://example.com/article', target_url: 'https://example.com/site' }], search_console: { property: null, exported_at: null, evidence_path: null, referring_domains: null, top_pages: [] } }));
  const result = spawnSync(process.execPath, [script, 'validate', 'site'], { encoding: 'utf8', env: { ...process.env, UIBUILDER_PROJECTS_ROOT: root } });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /evidence_path required/);
});
