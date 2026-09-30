// Per-project resource plan: docs/RESOURCE_PLAN.json in the site repository. The owner (dashboard or CLI) states
// which resources MUST be used, preferred or avoided for this project. must_use is enforced at G3: the resource has to
// appear in a handoff's resources_used AND be explained in that handoff's decisions.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const planPath = (projectDir) => join(projectDir, 'docs', 'RESOURCE_PLAN.json');
const TAG = /^[a-z0-9][a-z0-9:_-]{0,39}$/;

export function loadPlan(projectDir) {
  const path = planPath(projectDir);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

export function validatePlan(plan, resourceIds) {
  const errors = [];
  if (plan?.version !== 1) return ['RESOURCE_PLAN.json: version must be 1'];
  const known = new Set(resourceIds);
  const mustIds = new Set();
  for (const item of plan.must_use ?? []) {
    if (!item?.id || !known.has(item.id)) errors.push(`RESOURCE_PLAN.json must_use: unknown resource "${item?.id}"`);
    else if (!item.why || String(item.why).trim().length < 8) errors.push(`RESOURCE_PLAN.json must_use "${item.id}": say why (8+ characters)`);
    mustIds.add(item?.id);
  }
  for (const key of ['prefer', 'avoid']) {
    for (const id of plan[key] ?? []) {
      if (!known.has(id)) errors.push(`RESOURCE_PLAN.json ${key}: unknown resource "${id}"`);
      if (mustIds.has(id)) errors.push(`RESOURCE_PLAN.json: "${id}" cannot be both must_use and ${key}`);
    }
  }
  for (const tag of plan.tags ?? []) if (!TAG.test(tag)) errors.push(`RESOURCE_PLAN.json tags: "${tag}" is not a valid tag`);
  return errors;
}

export function loadHandoffs(projectDir) {
  const dir = join(projectDir, 'docs', 'handoff');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.json')).map((name) => {
    try { return JSON.parse(readFileSync(join(dir, name), 'utf8')); } catch { return null; }
  }).filter(Boolean);
}

// For each must_use resource: was it used, and did some handoff that used it explain how?
export function planStatus(plan, handoffs) {
  const rows = (plan?.must_use ?? []).map((item) => {
    const users = handoffs.filter((h) => (h.resources_used ?? []).includes(item.id));
    const explainers = users.filter((h) => (h.decisions ?? []).some((d) => String(d).includes(item.id)));
    return { id: item.id, why: item.why, used: users.length > 0, explained: explainers.length > 0, by: users.map((h) => h.agent) };
  });
  return { must_use: rows, missing: rows.filter((r) => !r.used).map((r) => r.id), unexplained: rows.filter((r) => r.used && !r.explained).map((r) => r.id) };
}

export function mustUseErrors(status) {
  return [
    ...status.missing.map((id) => `must-use resource "${id}" is not in any handoff's resources_used`),
    ...status.unexplained.map((id) => `must-use resource "${id}" is used but no handoff decision explains how (mention "${id}" in decisions)`),
  ];
}
