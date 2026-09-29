#!/usr/bin/env node
// Prepare/add the harness-managed baseline scanners to an existing site repository.
// Dry-run is default. Never overwrites project-owned files.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const harness = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const slug = args[0];
const apply = args.includes('--apply');
const rootIndex = args.indexOf('--root');
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug) || args.some((a, i) => a === '--root' && !args[i + 1]) ||
    args.filter((a) => a === '--apply').length > 1 || args.some((a) => !['--apply', '--root', args[rootIndex + 1], slug].includes(a))) {
  console.error('usage: node scripts/migrate-site-security.mjs <slug> [--root PROJECTS_ROOT] [--apply]');
  process.exit(2);
}
const projectsRoot = resolve(rootIndex >= 0 ? args[rootIndex + 1] : process.env.UIBUILDER_PROJECTS_ROOT || 'D:\\UiBuildProj');
const project = resolve(projectsRoot, slug);
const rel = relative(projectsRoot, project);
if (!rel || rel.startsWith(`..${sep}`) || rel === '..' || isAbsolute(rel) || !existsSync(project) || !existsSync(join(project, '.git')))
  throw new Error('target must be an existing Git repository directly under the projects root');
const sourceRules = join(harness, 'security/semgrep/ui-builder.yml');
const workflow = `name: Security baseline\non:\n  pull_request:\n  push:\n    branches: [main]\n  workflow_dispatch:\npermissions:\n  contents: read\njobs:\n  secret-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n      - name: Gitleaks full-history scan (redacted output)\n        run: docker run --rm --mount type=bind,source=\"$GITHUB_WORKSPACE\",target=/repo,readonly ghcr.io/gitleaks/gitleaks@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f git --redact --no-banner /repo\n  sast:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Verify original rules with positive and safe-negative probes\n        run: node scripts/check-security-rules.mjs\n      - name: Scan site with UIBuilder original rules\n        run: docker run --rm --mount type=bind,source=\"$GITHUB_WORKSPACE\",target=/src,readonly semgrep/semgrep@sha256:32e459968daabe7ab86968184a29109b9564aa00392401156f9788452b42786b semgrep scan --config /src/security/semgrep/ui-builder.yml --metrics=off --error /src\n`;
const files = new Map([
  ['security/semgrep/ui-builder.yml', readFileSync(sourceRules)],
  ['security/semgrep/LICENSE', readFileSync(join(harness, 'security/semgrep/LICENSE'))],
  ['scripts/check-security-rules.mjs', readFileSync(join(harness, 'scripts/check-security-rules.mjs'))],
  ['.github/workflows/security.yml', Buffer.from(workflow)],
]);
const conflicts = [...files.keys()].filter((path) => existsSync(join(project, path)));
const result = { project, mode: apply ? 'apply' : 'dry-run', files: [...files.keys()], conflicts };
if (conflicts.length) {
  console.log(JSON.stringify({ ...result, applied: false, reason: 'existing files are never overwritten' }, null, 2));
  process.exitCode = 1;
} else if (apply) {
  for (const [path, bytes] of files) {
    const target = join(project, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes, { flag: 'wx' });
  }
  console.log(JSON.stringify({ ...result, applied: true }, null, 2));
} else console.log(JSON.stringify({ ...result, applied: false, next: `node scripts/migrate-site-security.mjs ${slug} --apply` }, null, 2));
