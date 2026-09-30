#!/usr/bin/env node
// Mechanical taste-core checks on a site repository. Advisory: it cannot judge taste and has no gate authority.
//   node scripts/premium-lint.mjs <slug|path> [--json]
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { lintProject } from './lib/premium-lint.mjs';

const target = process.argv[2];
if (!target) { console.error('usage: node scripts/premium-lint.mjs <slug|path> [--json]'); process.exit(2); }
const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === 'win32' ? 'D:\\UiBuildProj' : join(resolve(process.cwd(), '..'), 'UiBuildProj'));
const project = existsSync(target) ? resolve(target) : join(projectsRoot, target);
if (!existsSync(project)) { console.error(`${project} not found`); process.exit(2); }

const report = { project, ...lintProject(project), gate_authority: false, note: 'Mechanical evidence for the premium-bar review; it cannot judge taste, story or memorability.' };
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`premium-lint ${project}: ${report.scanned_files} files, ${report.failed} fail, ${report.warned} warn`);
  for (const f of report.findings) console.log(`${f.severity === 'fail' ? '✗' : '!'} ${f.id} (${f.count}): ${f.description}${f.samples.length ? '\n    ' + f.samples.join(', ') : ''}`);
}
process.exit(report.failed ? 1 : 0);
