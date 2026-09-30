#!/usr/bin/env node
// Manage a site's owner resource plan (docs/RESOURCE_PLAN.json). Run by the owner or on the owner's explicit instruction.
//   node scripts/resource-plan.mjs init <slug> [--tags company-site,restaurant]
//   node scripts/resource-plan.mjs add <slug> <must_use|prefer|avoid> <resource-id> [--why "reason, required for must_use"]
//   node scripts/resource-plan.mjs remove <slug> <resource-id>
//   node scripts/resource-plan.mjs status <slug>       what is used and explained so far
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHandoffs, loadPlan, mustUseErrors, planPath, planStatus, validatePlan } from './lib/resource-plan.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === 'win32' ? 'D:\\UiBuildProj' : join(dirname(root), 'UiBuildProj'));
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const positional = args.filter((arg, i) => !arg.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const [command, slug, ...rest] = positional;
const die = (message) => { console.error(message); process.exit(2); };
if (!command || !slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) die('usage: node scripts/resource-plan.mjs <init|add|remove|status> <slug> ...');
const project = join(projectsRoot, slug);
if (!existsSync(project)) die(`${project} not found`);
const resourceIds = JSON.parse(readFileSync(join(root, 'brain/resources.json'), 'utf8')).resources.map((r) => r.id);
const save = (plan) => {
  const errors = validatePlan(plan, resourceIds);
  if (errors.length) die(`refused: ${errors.join('; ')}`);
  mkdirSync(dirname(planPath(project)), { recursive: true });
  writeFileSync(planPath(project), JSON.stringify(plan, null, 2) + '\n');
};

if (command === 'init') {
  if (existsSync(planPath(project))) die('RESOURCE_PLAN.json already exists');
  save({ version: 1, tags: (flag('tags') ?? '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean), must_use: [], prefer: [], avoid: [], notes: '' });
  console.log(`created ${planPath(project)}`);
} else if (command === 'add') {
  const [kind, id] = rest;
  if (!['must_use', 'prefer', 'avoid'].includes(kind) || !id) die('add needs <must_use|prefer|avoid> <resource-id>');
  const plan = loadPlan(project) ?? die('run init first');
  for (const key of ['must_use', 'prefer', 'avoid']) plan[key] = (plan[key] ?? []).filter((item) => (item.id ?? item) !== id);
  plan[kind].push(kind === 'must_use' ? { id, why: flag('why') ?? '' } : id);
  save(plan);
  console.log(`${id} -> ${kind}`);
} else if (command === 'remove') {
  const [id] = rest;
  const plan = loadPlan(project) ?? die('no plan');
  for (const key of ['must_use', 'prefer', 'avoid']) plan[key] = (plan[key] ?? []).filter((item) => (item.id ?? item) !== id);
  save(plan);
  console.log(`removed ${id}`);
} else if (command === 'status') {
  const plan = loadPlan(project) ?? die('no RESOURCE_PLAN.json');
  const status = planStatus(plan, loadHandoffs(project));
  console.log(JSON.stringify({ tags: plan.tags, prefer: plan.prefer, avoid: plan.avoid, must_use: status.must_use, problems: mustUseErrors(status) }, null, 2));
} else {
  die('usage: node scripts/resource-plan.mjs <init|add|remove|status> <slug> ...');
}
