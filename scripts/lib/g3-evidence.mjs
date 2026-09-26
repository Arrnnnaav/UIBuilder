import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, isAbsolute, sep } from 'node:path';

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
// Playwright sanitizes snapshot argument punctuation, including underscores.
export const snapshotName = route => route === '/' ? 'home'
  : route.slice(1).replaceAll('/', '_').replace(/[\x00-\x2C\x2E-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/g, '-');
export function monitoringKeys(project, env = process.env) {
  const loaded = { ...env };
  // Match Next production precedence without printing values. Dynamic/interpolated
  // assignments count as configured; provider receipt is then required conservatively.
  for (const name of ['.env.production.local', '.env.local', '.env.production', '.env']) {
    const path = resolve(project, name);
    if (!existsSync(path)) continue;
    for (const match of readFileSync(path, 'utf8').matchAll(/^\s*(?:export\s+)?(NEXT_PUBLIC_SENTRY_DSN|NEXT_PUBLIC_POSTHOG_KEY)\s*=\s*(.*?)\s*$/gm)) {
      if (loaded[match[1]] === undefined) loaded[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2').replace(/\s+#.*$/, '');
    }
  }
  return { sentry: Boolean(loaded.NEXT_PUBLIC_SENTRY_DSN), posthog: Boolean(loaded.NEXT_PUBLIC_POSTHOG_KEY) };
}
export function sourceFingerprint(project) {
  const entries = [];
  const walk = (rel) => {
    const path = resolve(project, rel);
    if (!existsSync(path)) return;
    for (const item of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (['__snapshots__', 'generated', 'node_modules', '.next'].includes(item.name)) continue;
      const next = `${rel}/${item.name}`;
      if (item.isDirectory()) walk(next);
      else if (item.isFile()) entries.push([next, sha256(readFileSync(resolve(project, next)))]);
    }
  };
  for (const dir of ['app', 'components', 'lib', 'content', 'public', 'scripts', 'tests', 'e2e']) walk(dir);
  for (const name of ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'next.config.ts', 'playwright.config.ts', 'seo.manifest.json', 'tsconfig.json', 'eslint.config.mjs', 'postcss.config.mjs', 'vitest.config.mts', 'instrumentation.ts', 'instrumentation-client.ts']) {
    const path = resolve(project, name);
    if (existsSync(path)) entries.push([name, sha256(readFileSync(path))]);
  }
  return sha256(JSON.stringify(entries));
}
export function validatePerf(summary, routes) {
  const errors = [];
  for (const route of routes.filter(r => r !== '/e2e-error')) {
    for (const formFactor of ['desktop', 'mobile']) {
      const rows = summary?.rows?.filter(r => r.route === route && r.formFactor === formFactor) ?? [];
      if (rows.length !== 1) { errors.push(`${route} ${formFactor}: expected one performance result`); continue; }
      const row = rows[0];
      for (const category of ['performance', 'accessibility', 'best-practices', 'seo']) {
        if (!Number.isFinite(row[category]) || row[category] < .9) errors.push(`${route} ${formFactor}: ${category} below 90 or missing`);
      }
      if (!Number.isFinite(row.lcp) || row.lcp >= 2500) errors.push(`${route} ${formFactor}: LCP must be <2500ms`);
      if (!Number.isFinite(row.cls) || row.cls >= .1) errors.push(`${route} ${formFactor}: CLS must be <0.1`);
      if (row.pass !== true) errors.push(`${route} ${formFactor}: result failed`);
    }
  }
  return errors;
}

// Each reviewed report, retained command output, and screenshot is bound to its bytes.
// This checks the evidence contract; it cannot replace a human/agent review or provider receipt.
export function validateEvidence(project, evidence, { routes, platform, trackedSnapshots, monitoringEnabled = {} }) {
  const errors = [];
  if (evidence?.sourceFingerprint !== sourceFingerprint(project)) errors.push('source fingerprint missing or stale');
  const file = (record, label) => {
    if (!record || typeof record.path !== 'string' || !/^[a-f0-9]{64}$/.test(record.sha256 ?? '')) { errors.push(`${label}: missing path/SHA256`); return; }
    const path = resolve(project, record.path);
    const rel = relative(project, path);
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) { errors.push(`${label}: outside project`); return; }
    if (!existsSync(path) || sha256(readFileSync(path)) !== record.sha256) errors.push(`${label}: missing or changed artifact`);
  };
  const command = (record, label) => {
    if (!record?.command?.trim() || record.exitCode !== 0) errors.push(`${label}: missing successful command`);
    file(record?.output, label);
  };
  for (const name of ['QA_REPORT.md', 'GROWTH_REPORT.md', 'SECURITY_REPORT.md', 'PERF_REPORT.md', 'VISUAL_REVIEW.md']) {
    const record = evidence?.reports?.[name];
    if (record?.report?.path !== `docs/${name}`) errors.push(`${name}: wrong or missing report`);
    file(record?.report, name);
    if (!Array.isArray(record?.commands) || !record.commands.length) errors.push(`${name}: no retained command evidence`);
    else record.commands.forEach(r => command(r, name));
  }
  const security = evidence?.security;
  if (security?.skill !== '.claude/skills/security-review/SKILL.md' || !Array.isArray(security?.findings)) errors.push('security: missing skill review/findings');
  else if (security.findings.some(f => !['info', 'low', 'medium'].includes(f.severity))) errors.push('security: high/critical or ungraded finding');
  for (const provider of ['sentry', 'posthog']) {
    const record = evidence?.monitoring?.[provider];
    const mode = monitoringEnabled[provider] ? 'receipt' : 'noop';
    if (record?.mode !== mode) errors.push(`${provider}: expected ${mode} evidence`);
    command(record, provider);
    if (mode === 'receipt' && (!record?.eventId?.trim() || !record?.receivedAt || !Number.isFinite(Date.parse(record.receivedAt)))) errors.push(`${provider}: missing provider receipt identity/time`);
  }
  const reviewed = evidence?.snapshots;
  for (const browser of ['chromium-desktop', 'chromium-mobile', 'webkit-desktop', 'webkit-mobile']) {
    for (const route of routes.filter(r => r !== '/e2e-error')) {
      const name = snapshotName(route);
      const path = `e2e/__snapshots__/${platform}/${browser}/${name}.png`;
      const record = reviewed?.find(r => r.path === path);
      if (!record?.reviewer?.trim() || !record?.reviewedAt || !Number.isFinite(Date.parse(record.reviewedAt))) errors.push(`${path}: missing review`);
      file(record, path);
      if (!trackedSnapshots.has(path)) errors.push(`${path}: absent from Git HEAD`);
    }
  }
  return errors;
}
