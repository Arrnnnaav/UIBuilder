import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validatePerf, validateEvidence, sourceFingerprint, sha256, monitoringKeys, snapshotName } from '../../scripts/lib/g3-evidence.mjs';

const row = (route, formFactor) => ({ route, formFactor, performance: .9, accessibility: 1, 'best-practices': 1, seo: 1, lcp: 2499, cls: .099, pass: true });
test('snapshot evidence names match actual Playwright-sanitized nested routes', () => {
  assert.equal(snapshotName('/'), 'home');
  assert.equal(snapshotName('/work/edge-node'), 'work-edge-node');
  assert.equal(snapshotName('/work/ghostcursor'), 'work-ghostcursor');
  assert.equal(snapshotName('/styleguide'), 'styleguide');
});
test('all pages including noindex utility pages require both performance profiles', () => {
  const routes = ['/', '/styleguide', '/e2e-error'];
  const rows = routes.slice(0, 2).flatMap(r => ['desktop', 'mobile'].map(f => row(r, f)));
  assert.deepEqual(validatePerf({ rows }, routes), []);
  assert.match(validatePerf({ rows: rows.slice(1) }, routes).join(), /expected one/);
});
test('exact LCP and CLS boundaries fail and null scores do not pass', () => {
  const rows = [row('/', 'desktop'), row('/', 'mobile')];
  rows[0].lcp = 2500; rows[0].cls = .1; rows[0].seo = null;
  const errors = validatePerf({ rows }, ['/']);
  assert.equal(errors.length, 3);
});
test('evidence binds reports and commands, monitoring state and committed reviewed snapshots', () => {
  const project = mkdtempSync(join(tmpdir(), 'uibu-g3-'));
  const artifact = path => { mkdirSync(join(project, path, '..'), { recursive: true }); writeFileSync(join(project, path), 'real recorded output'); return { path, sha256: sha256('real recorded output') }; };
  const command = { command: 'node verify.mjs', exitCode: 0, output: artifact('docs/evidence/output.log') };
  const reports = Object.fromEntries(['QA_REPORT.md', 'GROWTH_REPORT.md', 'SECURITY_REPORT.md', 'PERF_REPORT.md', 'VISUAL_REVIEW.md'].map(n => [n, { report: artifact(`docs/${n}`), commands: [command] }]));
  const snapshots = ['chromium-desktop', 'chromium-mobile', 'webkit-desktop', 'webkit-mobile'].map(b => ({ ...artifact(`e2e/__snapshots__/win32/${b}/home.png`), reviewer: 'design-director', reviewedAt: '2026-09-26T00:00:00Z' }));
  const evidence = { sourceFingerprint: sourceFingerprint(project), reports, security: { skill: '.claude/skills/security-review/SKILL.md', findings: [] }, monitoring: { sentry: { mode: 'noop', ...command }, posthog: { mode: 'noop', ...command } }, snapshots };
  const options = { routes: ['/'], platform: 'win32', trackedSnapshots: new Set(snapshots.map(r => r.path)) };
  assert.deepEqual(validateEvidence(project, evidence, options), []);
  assert.match(validateEvidence(project, evidence, { ...options, trackedSnapshots: new Set() }).join(), /absent from Git HEAD/);
  evidence.security.findings.push({ severity: 'high' });
  evidence.monitoring.sentry.mode = 'receipt';
  writeFileSync(join(project, 'docs/QA_REPORT.md'), 'changed');
  const errors = validateEvidence(project, evidence, options).join();
  assert.match(errors, /high\/critical/); assert.match(errors, /expected noop/); assert.match(errors, /changed artifact/);
});
test('source edits invalidate evidence; generated artifacts and reports do not', () => {
  const project = mkdtempSync(join(tmpdir(), 'uibu-source-'));
  mkdirSync(join(project, 'app'), { recursive: true }); writeFileSync(join(project, 'app/page.tsx'), 'v1');
  const before = sourceFingerprint(project);
  mkdirSync(join(project, 'docs')); writeFileSync(join(project, 'docs/QA_REPORT.md'), 'review');
  assert.equal(sourceFingerprint(project), before);
  writeFileSync(join(project, 'app/page.tsx'), 'v2');
  assert.notEqual(sourceFingerprint(project), before);
});
test('monitor keys include Next production dotenv precedence without exposing values', () => {
  const project = mkdtempSync(join(tmpdir(), 'uibu-env-'));
  writeFileSync(join(project, '.env'), 'NEXT_PUBLIC_SENTRY_DSN="configured"\nNEXT_PUBLIC_POSTHOG_KEY=\n');
  writeFileSync(join(project, '.env.production.local'), 'NEXT_PUBLIC_POSTHOG_KEY=production\n');
  assert.deepEqual(monitoringKeys(project, {}), { sentry: true, posthog: true });
  assert.deepEqual(monitoringKeys(project, { NEXT_PUBLIC_SENTRY_DSN: '' }), { sentry: false, posthog: true });
});
test('monitoring entry points and test/build configs invalidate source evidence', () => {
  const project = mkdtempSync(join(tmpdir(), 'uibu-config-'));
  for (const name of ['instrumentation.ts', 'instrumentation-client.ts', 'vitest.config.mts', 'postcss.config.mjs', 'pnpm-workspace.yaml']) {
    const before = sourceFingerprint(project);
    writeFileSync(join(project, name), 'original');
    assert.notEqual(sourceFingerprint(project), before, `${name} addition`);
    const original = sourceFingerprint(project);
    writeFileSync(join(project, name), 'changed');
    assert.notEqual(sourceFingerprint(project), original, `${name} edit`);
  }
});
