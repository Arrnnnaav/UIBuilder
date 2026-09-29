#!/usr/bin/env node
/**
 * Prepare a source-backed launch package for an external site repository.
 * This is the CLI equivalent of the Claude Code /brag command.
 * It never deploys, changes app code, or invents product claims.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === 'win32' ? 'D:\\UiBuildProj' : resolve('..', 'UiBuildProj'));
const [slug, rawMode = 'product', ...flags] = process.argv.slice(2);
const mode = rawMode.toLowerCase();
const checkOnly = flags.includes('--check');
const force = flags.includes('--force');

const usage = () => {
  console.error('usage: node scripts/brag.mjs <slug> [product|company] [--check] [--force]');
  process.exit(2);
};
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug) || !['product', 'company'].includes(mode)) usage();

const project = join(projectsRoot, slug);
const docs = join(project, 'docs');
const launch = join(docs, 'launch');
const required = [
  'AGENTS.md',
  'docs/PRODUCT.md',
  'docs/STATE.md',
  'docs/QA_REPORT.md',
  'docs/PERF_REPORT.md',
  'docs/GROWTH_REPORT.md',
  'docs/G3_EVIDENCE.json',
];
const missing = required.filter((file) => !existsSync(join(project, file)));
if (!existsSync(project)) missing.unshift(`project directory (${project})`);
if (missing.length) {
  console.error(`brag preflight failed for ${slug}:`);
  for (const item of missing) console.error(`- missing ${item}`);
  console.error('Run the project pipeline and produce current G3 evidence before creating launch material.');
  process.exit(1);
}

let evidence;
try {
  evidence = JSON.parse(readFileSync(join(project, 'docs/G3_EVIDENCE.json'), 'utf8'));
} catch (error) {
  console.error(`brag preflight failed: docs/G3_EVIDENCE.json is not valid JSON (${error.message})`);
  process.exit(1);
}
const product = readFileSync(join(project, 'docs/PRODUCT.md'), 'utf8').trim();
const state = readFileSync(join(project, 'docs/STATE.md'), 'utf8').trim();
const evidenceSummary = JSON.stringify({
  sourceFingerprint: evidence.sourceFingerprint ?? null,
  reportNames: Object.keys(evidence.reports ?? {}),
  snapshotCount: Array.isArray(evidence.snapshots) ? evidence.snapshots.length : 0,
  monitoring: evidence.monitoring ? Object.keys(evidence.monitoring) : [],
}, null, 2);

const files = {
  'BRAG_BRIEF.md': `# Brag brief — ${slug}\n\n- Mode: ${mode}\n- Status: generated from current project evidence\n- Source of truth: ../PRODUCT.md, ../STATE.md and ../G3_EVIDENCE.json\n\n## Audience\n\n<!-- Fill from the approved product brief. Do not infer an audience. -->\n\n## Product promise\n\n<!-- Write one outcome-backed promise. Link every claim to a source file. -->\n\n## Proof points\n\nUse only verified evidence from the project reports and G3 record.\n\n\`\`\`json\n${evidenceSummary}\n\`\`\`\n\n## Campaign angle\n\n<!-- Choose one clear angle after reviewing the evidence. -->\n\n## Open approvals\n\n- [ ] Owner approved claims and wording\n- [ ] Asset rights recorded\n- [ ] Target and release date approved\n`,
  'PROMO_COPY.md': `# Promotional copy — ${slug}\n\nEvery statement in this file must cite a project source before publication.\n\n## Source excerpts\n\n### Product brief\n\n> ${product.split(/\r?\n/).slice(0, 8).join('\n> ')}\n\n### Current state\n\n> ${state.split(/\r?\n/).slice(0, 8).join('\n> ')}\n\n## Draft copy\n\n### Hero\n\n<!-- Replace with approved, source-backed copy. -->\n\n### Feature/value blocks\n\n1. **[Outcome]** — [specific evidence-backed explanation].\n2. **[Outcome]** — [specific evidence-backed explanation].\n3. **[Outcome]** — [specific evidence-backed explanation].\n\n### Social variant\n\n<!-- Keep claims traceable to the source files above. -->\n\n### Email variant\n\n<!-- Keep claims traceable to the source files above. -->\n`,
  'LAUNCH_SCRIPT.md': `# Launch script — ${slug}\n\n- Mode: ${mode}\n- Target length: 15–25 seconds\n- Narration: off unless explicitly approved\n\n| Time | Visual | On-screen text | Audio | Evidence/source |\n|---|---|---|---|---|\n| 0–2s | Actual product hook | [approved hook] | [music/SFX] | [path] |\n| 2–7s | Product interaction | [outcome] | [music/SFX] | [path] |\n| 7–15s | Two verified highlights | [proof] | [music/SFX] | [path] |\n| 15–20s | CTA/end card | [approved CTA] | [music/SFX] | [path] |\n\n## Reduced-motion version\n\nUse static frames and crossfades. Do not remove essential information.\n`,
  'SHOT_LIST.md': `# Shot list — ${slug}\n\nOnly capture real routes, states and approved assets.\n\n| ID | Route/state | Viewport | Capture | Rights/source | Status |\n|---|---|---:|---|---|---|\n| 01 | [route] | [width×height] | [browser/video] | [path/license] | pending |\n| 02 | [route] | [width×height] | [browser/video] | [path/license] | pending |\n| 03 | [route] | [width×height] | [browser/video] | [path/license] | pending |\n`,
  'BRAG_HANDOFF.json': JSON.stringify({
    schema_version: 1,
    slug,
    mode,
    status: 'draft',
    source_files: required.slice(1),
    evidence_summary: JSON.parse(evidenceSummary),
    tool_ids: ['brag'],
    rights_review: 'pending',
    owner_approval: 'pending',
    open_questions: ['Which claims and target should be approved for publication?'],
  }, null, 2) + '\n',
};

if (checkOnly) {
  console.log(`brag preflight passed for ${slug} (${mode}); no files written`);
  process.exit(0);
}
mkdirSync(launch, { recursive: true });
for (const [name, contents] of Object.entries(files)) {
  const path = join(launch, name);
  if (existsSync(path) && !force) {
    console.error(`${path} already exists; use --force only after reviewing it`);
    process.exit(1);
  }
  writeFileSync(path, contents, 'utf8');
}
console.log(`brag package written to ${launch}`);
console.log('Review claims, rights and owner approvals before using any promotional output.');
