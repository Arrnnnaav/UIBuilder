import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tableUnder, validateDiscovery } from '../../scripts/lib/discovery.mjs';
import { competitorHostsFrom, validateRecord } from '../../scripts/lib/decision-record.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const audit = (n = 3) => ({ sites: [{ role: 'client', url: 'https://client.test', skipped: null }, ...Array.from({ length: n }, (_, i) => ({ role: 'competitor', url: `https://www.rival${i}.test/`, skipped: null }))] });

const goodDiscovery = `# DISCOVERY
## 3. Tailored questions
| # | Question | Why we ask (evidence) | Suggested default | Answer (owner) | Status |
|---|---|---|---|---|---|
| 1 | Do you want prices on the site? | 3 of 4 competitors publish price ranges | ranges | yes, ranges only | answered |
| 2 | Which certifications do you hold? | 2 competitors show license badges | ask | licensed and insured | answered |
| 3 | Do you offer emergency call-outs? | 3 competitors lead with 24/7 | ask | | skipped |
## 4. Suggested additions
| ID | Addition | Evidence | Effort (S/M/L) | Cost / risk | Decision | Decided by / date |
|---|---|---|---|---|---|---|
| A1 | Online booking | 3 of 4 competitors | M | vendor fee | accept | owner 2026-09-30 |
| A2 | Live chat | 1 of 4 competitors | S | staffing | reject | owner 2026-09-30 |
## 5. Fixed checks
| Topic | Question | Answer |
|---|---|---|
| Ownership | Who owns accounts? | The client owns all of them |
| Legal | Which disclaimers? | Standard privacy notice, no health claims |
| Conversion | Main action? | Call now |
| Contact | Public details? | Phone and email as supplied |
`;

test('markdown tables are read by header name under their heading', () => {
  const rows = tableUnder(goodDiscovery, 'Tailored questions');
  assert.equal(rows.length, 3);
  assert.equal(rows[0]['why we ask (evidence)'], '3 of 4 competitors publish price ranges');
  assert.equal(tableUnder(goodDiscovery, 'Nope'), null);
  assert.equal(tableUnder(goodDiscovery, 'Fixed checks').find((r) => r.topic === 'Legal').answer.startsWith('Standard'), true);
});

test('a complete discovery record passes and every gap is named', () => {
  assert.deepEqual(validateDiscovery(goodDiscovery, audit(3)), []);
  const open = goodDiscovery.replace('| skipped |', '| open |');
  assert.match(validateDiscovery(open, audit(3)).join(), /still open/);
  assert.match(validateDiscovery(goodDiscovery.replace('yes, ranges only | answered', ' | answered'), audit(3)).join(), /marked answered without an answer/);
  assert.match(validateDiscovery(goodDiscovery.replace('| accept |', '| open |'), audit(3)).join(), /no owner decision/);
  assert.match(validateDiscovery(goodDiscovery.replace('The client owns all of them', ''), audit(3)).join(), /fixed check "ownership" is unanswered/);
  assert.match(validateDiscovery(goodDiscovery.replace('3 of 4 competitors publish price ranges', ''), audit(3)).join(), /no evidence for why it is asked/);
  assert.match(validateDiscovery('# x', audit(3)).join(), /missing the "Tailored questions" table/);
});

test('at least three competitors must be audited unless an exception is written', () => {
  assert.match(validateDiscovery(goodDiscovery, audit(2)).join(), /only 2 competitor site/);
  assert.match(validateDiscovery(goodDiscovery, null).join(), /COMPETITOR_AUDIT\.json is missing/);
  assert.deepEqual(validateDiscovery(`${goodDiscovery}\nCompetitor exception: only two rivals exist in this town\n`, audit(2)), []);
  const templateOnly = `${goodDiscovery}\nCompetitor exception: (only if fewer than 3 competitors could be audited, say why)\n`;
  assert.match(validateDiscovery(templateOnly, audit(2)).join(), /only 2 competitor site/);
  const skipped = audit(3); skipped.sites[1].skipped = 'robots.txt disallows';
  assert.match(validateDiscovery(goodDiscovery, skipped).join(), /only 2 competitor site/);
});

const record = (rows) => `## Decision record\n\n| ID | Decision | Value | Reason | Source | Rejected alternative |\n|---|---|---|---|---|---|\n${rows.join('\n')}\n`;
const ctx = { resourceIds: new Set(['lenis', 'taste-core']), competitorHosts: competitorHostsFrom(audit(3)) };
const designRows = [
  '| D1 | Accent color | oklch(62% 0.19 250) | Trades buyers trust blue and it passes AA on white | competitor:rival0.test; brief | Orange, which clashed with the client logo |',
  '| D2 | Neutral palette | warm greys | Matches the tone words calm and dependable | brief; preference | Pure black and white |',
  '| D3 | Type pairing and scale | Geist and Geist Mono at 1.25 | Readable at small sizes on phones | rule:taste-core | Inter, banned as a default |',
  '| D4 | Hero layout | split, phone number visible | Phone leads convert best for emergency work | competitor:rival1.test | Centered hero with a form |',
  '| D5 | Spacing and grid | 8px base, 12 columns | Keeps rhythm consistent across service pages | rule:taste-core | Ad hoc spacing |',
  '| D6 | Imagery | real team photos | Trust signal that competitors lack | competitor:rival2.test; owner | Stock photography |',
];
const motionRows = [
  '| M1 | Easing curve | cubic-bezier(.16,1,.3,1) | Fast start reads as responsive without bounce | preference; rule:taste-core | Linear easing |',
  '| M2 | Durations | 200ms hover, 500ms reveal | Keeps interactions quick per owner taste | preference | Slow decorative motion |',
  '| M3 | Signature scroll interaction | pinned service steps | Explains the repair process visually | resource:lenis | Static list of steps |',
  '| M4 | Reduced motion fallback | static stacked steps | Same story without movement for access needs | a11y | Disabling the section |',
];

test('a sourced design and motion record passes', () => {
  assert.deepEqual(validateRecord(record(designRows), 'design', ctx), []);
  assert.deepEqual(validateRecord(record(motionRows), 'motion', ctx), []);
});

test('unsourced, invented or thin decisions are named', () => {
  const problems = (rows, kind = 'design') => validateRecord(record(rows), kind, ctx).join(' | ');
  assert.match(problems(designRows.map((r) => r.replace('competitor:rival0.test; brief', 'vibes'))), /unknown source kind "vibes"/);
  assert.match(problems(designRows.map((r) => r.replace('competitor:rival1.test', 'competitor:nowhere.test'))), /competitor "nowhere.test" is not in COMPETITOR_AUDIT/);
  assert.match(problems(motionRows.map((r) => r.replace('resource:lenis', 'resource:ghost')), 'motion'), /resource "ghost" is not in the Brain/);
  assert.match(problems(designRows.map((r) => r.replace('Orange, which clashed with the client logo', ''))), /name the alternative that was rejected/);
  assert.match(problems(designRows.map((r) => r.replace('Trades buyers trust blue and it passes AA on white', 'nice'))), /give a real reason/);
  assert.match(problems(designRows.slice(0, 3)), /has 3 rows; at least 6/);
  assert.match(problems(designRows.filter((r) => !r.includes('Imagery'))), /no decision about imagery|has 5 rows/);
  assert.match(problems(motionRows.filter((r) => !r.includes('Reduced')), 'motion'), /has 3 rows|no decision about reduced/);
  assert.match(validateRecord('# no table', 'design', ctx).join(), /missing the "Decision record" table/);
  assert.match(problems(['| D1 | | | | | |']), /has 0 rows/);
});

// Real gate runs on throwaway projects: contract v2 sites are held to the records, legacy sites are not.
const gate = (projects, slug, which) => spawnSync(process.execPath, [join(root, 'scripts/gate.mjs'), slug, which], { encoding: 'utf8', env: { ...process.env, UIBUILDER_PROJECTS_ROOT: projects } }).stdout;
const project = (t, spec) => {
  const projects = mkdtempSync(join(tmpdir(), 'uib-gate-'));
  t.after(() => rmSync(projects, { recursive: true, force: true }));
  mkdirSync(join(projects, 'demo', 'docs'), { recursive: true });
  writeFileSync(join(projects, 'demo', 'docs', 'BUILD_SPEC.json'), JSON.stringify(spec));
  return projects;
};

test('G1 holds v2 company sites to the discovery record but leaves legacy sites alone', (t) => {
  const v2 = project(t, { slug: 'demo', pipeline: 'company-site', contract_version: 2 });
  let out = gate(v2, 'demo', 'G1');
  assert.match(out, /✗ docs\/DISCOVERY\.md/);
  assert.match(out, /✗ discovery: tailored questions answered/);
  const docs = join(v2, 'demo', 'docs');
  const template = readFileSync(join(root, 'templates/docs/DISCOVERY.md'), 'utf8');
  writeFileSync(join(docs, 'DISCOVERY.md'), `${template}\n${goodDiscovery}`);
  writeFileSync(join(docs, 'COMPETITOR_MATRIX.md'), '# matrix');
  writeFileSync(join(docs, 'COMPETITOR_AUDIT.json'), JSON.stringify(audit(3)));
  out = gate(v2, 'demo', 'G1');
  assert.match(out, /✓ docs\/COMPETITOR_MATRIX\.md/);
  assert.match(out, /✗ discovery: tailored questions answered/, 'the template rows are still open, so the combined file must still fail');
  writeFileSync(join(docs, 'DISCOVERY.md'), `${goodDiscovery}\n${'Notes about the client and evidence. '.repeat(30)}`);
  out = gate(v2, 'demo', 'G1');
  assert.match(out, /✓ discovery: tailored questions answered/);
  const legacy = project(t, { slug: 'demo', pipeline: 'company-site' });
  out = gate(legacy, 'demo', 'G1');
  assert.doesNotMatch(out, /discovery|DISCOVERY|COMPETITOR/);
  const portfolio = project(t, { slug: 'demo', pipeline: 'portfolio', contract_version: 2 });
  assert.doesNotMatch(gate(portfolio, 'demo', 'G1'), /DISCOVERY/);
});

test('G2 requires a sourced decision record for v2 sites only', (t) => {
  const v2 = project(t, { slug: 'demo', pipeline: 'company-site', contract_version: 2 });
  const docs = join(v2, 'demo', 'docs');
  const pad = 'Filled in with real content for this project. '.repeat(20);
  writeFileSync(join(docs, 'DESIGN.md'), `# DESIGN\n${pad}\n${record(designRows)}`);
  writeFileSync(join(docs, 'MOTION.md'), `# MOTION\n${pad}\n${record(motionRows)}`);
  writeFileSync(join(docs, 'COMPETITOR_AUDIT.json'), JSON.stringify(audit(3)));
  let out = gate(v2, 'demo', 'G2');
  assert.match(out, /✓ docs\/DESIGN\.md decision record/);
  assert.match(out, /✓ docs\/MOTION\.md decision record/);
  writeFileSync(join(docs, 'DESIGN.md'), `# DESIGN\n${pad}\n${record(designRows.map((r) => r.replace('brief; preference', 'hunch')))}`);
  out = gate(v2, 'demo', 'G2');
  assert.match(out, /✗ docs\/DESIGN\.md decision record[\s\S]*unknown source kind "hunch"/);
  const legacy = project(t, { slug: 'demo', pipeline: 'company-site' });
  assert.doesNotMatch(gate(legacy, 'demo', 'G2'), /decision record/);
});
