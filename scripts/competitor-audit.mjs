#!/usr/bin/env node
// Audit competitor sites (and optionally the client's current site) for the S1/S2 discovery step.
//   node scripts/competitor-audit.mjs <slug> --sites https://a.com,https://b.com [--client https://current.com] [--pages 3] [--no-psi] [--dry-run]
// Public pages only, robots.txt honored, about 1 request a second per site. Writes docs/COMPETITOR_AUDIT.json and
// docs/COMPETITOR_MATRIX.md in the site repository. PSI_API_KEY (optional, in the environment or root .env) raises the
// PageSpeed Insights quota; the value is never printed.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeUrl, renderMatrixMarkdown, runAudit } from './lib/competitor-audit.mjs';
import { readKey } from './lib/media-providers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const slug = args[0];
const die = (message) => { console.error(message); process.exit(2); };
if (!slug || slug.startsWith('--') || !/^[a-z0-9][a-z0-9-]*$/.test(slug) || !flag('sites')) die('usage: node scripts/competitor-audit.mjs <slug> --sites <url,url,...> [--client <url>] [--pages 3] [--no-psi] [--dry-run]');
const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === 'win32' ? 'D:\\UiBuildProj' : join(dirname(root), 'UiBuildProj'));
const project = join(projectsRoot, slug);
if (!existsSync(project)) die(`${project} not found`);

let competitors, client;
try {
  competitors = flag('sites').split(',').map((s) => s.trim()).filter(Boolean).map(normalizeUrl);
  client = flag('client') ? normalizeUrl(flag('client')) : undefined;
} catch (error) { die(error.message); }
const pages = Math.min(Math.max(Number(flag('pages') ?? 3), 1), 5);
if (args.includes('--dry-run')) { console.log(JSON.stringify({ project, client: client ?? null, competitors, pages_per_site: pages, psi: !args.includes('--no-psi') }, null, 2)); process.exit(0); }

const dotenvText = existsSync(join(root, '.env')) ? readFileSync(join(root, '.env'), 'utf8') : '';
const audit = await runAudit({ competitors, client, pages, psi: !args.includes('--no-psi'), psiKey: readKey('PSI_API_KEY', { dotenvText }) });
const docs = join(project, 'docs');
mkdirSync(docs, { recursive: true });
writeFileSync(join(docs, 'COMPETITOR_AUDIT.json'), JSON.stringify(audit, null, 2) + '\n');
writeFileSync(join(docs, 'COMPETITOR_MATRIX.md'), renderMatrixMarkdown(audit));
console.log(JSON.stringify({ written: ['docs/COMPETITOR_AUDIT.json', 'docs/COMPETITOR_MATRIX.md'], sites: audit.sites.map((s) => ({ role: s.role, url: s.url, pages: s.pages.length, features: s.features.length, skipped: s.skipped ?? null, psi: s.psi?.mobile?.performance ?? s.psi?.mobile?.unavailable ?? null })), gaps: audit.matrix.gaps }, null, 2));
