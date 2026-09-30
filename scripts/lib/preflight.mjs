// Handoff checks for AGENTS.md rules 2, 4 and 5. Used by scripts/gate.mjs.
// Tasks mirror `scripts/agent-bootstrap.mjs --task <task>`.
export const BOOTSTRAP_TASKS = ['frontend', 'website', 'full-site', 'visual-research', 'browser', 'video', 'review'];
export const VISUAL_AGENTS = ['frontend', 'design-director', 'taste-research'];
const CODE_MODES = new Set(['dependency', 'direct_or_reference', 'code_reference', 'skill']);
const hasWaiver = (env) => typeof env?.waiver === 'string' && env.waiver.trim().length >= 10;

// Rule 2: the environment preflight ran and was recorded.
export function preflightErrors(handoff) {
  const env = handoff?.environment;
  if (!env || typeof env !== 'object') return ['environment: missing (run agent-bootstrap and record it, or set environment.waiver)'];
  if (hasWaiver(env)) return [];
  const errors = [];
  if (!BOOTSTRAP_TASKS.includes(env.bootstrap_task)) errors.push(`environment.bootstrap_task: expected one of ${BOOTSTRAP_TASKS.join('|')}`);
  for (const key of ['skills_checked', 'unavailable_and_fallbacks']) {
    if (!Array.isArray(env[key])) errors.push(`environment.${key}: must be an array (may be empty)`);
  }
  return errors;
}

// Rule 4: visual agents load frontend-design, or record it as unavailable with a fallback.
export function visualSkillErrors(handoff) {
  if (!VISUAL_AGENTS.includes(handoff?.agent)) return [];
  const env = handoff.environment;
  if (hasWaiver(env)) return [];
  const used = Array.isArray(env?.skills_used) ? env.skills_used : [];
  const gaps = Array.isArray(env?.unavailable_and_fallbacks) ? env.unavailable_and_fallbacks : [];
  if (used.includes('frontend-design') || gaps.some((gap) => String(gap).includes('frontend-design'))) return [];
  return [`environment.skills_used: ${handoff.agent} must list "frontend-design" (or record it in unavailable_and_fallbacks)`];
}

// Rule 5: cited references exist in the Brain, are not retired, and code-type ones have a license.
export function referenceErrors(handoff, resources) {
  const byId = new Map(resources.map((resource) => [resource.id, resource]));
  const errors = [];
  for (const id of handoff?.resources_used ?? []) {
    const resource = byId.get(id);
    if (!resource) errors.push(`resources_used: "${id}" is not in brain/resources.json`);
    else if (['REJECTED', 'DEPRECATED'].includes(resource.trust)) errors.push(`resources_used: "${id}" is ${resource.trust}`);
    else if (CODE_MODES.has(resource.usage_mode) && !resource.license) errors.push(`resources_used: "${id}" is code-type with no verified license`);
  }
  return errors;
}
