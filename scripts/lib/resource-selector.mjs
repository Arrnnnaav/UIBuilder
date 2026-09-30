const eligibleTrust = new Set(['APPROVED', 'TRUSTED']);
const codeModes = new Set(['dependency', 'direct_or_reference', 'code_reference', 'skill']);
// Mechanism-only resources inform taste and never ship code or run tools, so a missing trust review
// does not make them risky. They still need a task-word match, and `use_caution` or a license
// restriction keeps them in the review queue. Retired trust levels always block them (D45).
export const MECHANISM_MODES = new Set(['inspiration_only', 'research_only', 'practice']);
const trustRank = { TRUSTED: 4, APPROVED: 3, TESTED: 2, REVIEWED: 1, NEW: 0 };
import { baselineConfig, validateRouterConfig } from './learning-config.mjs';

// A resource's own categories plus the canonical ones from brain/taxonomy.json.
export function effectiveCategories(resource, alias = {}) {
  const own = resource.categories ?? [];
  return [...new Set([...own, ...own.flatMap((category) => alias[category] ?? [])])];
}

// controls: id -> owner control (brain/owner-controls.json .resources); context.tags: task/project tags such as
// "company-site", "restaurant", "booking"; plan: a project's docs/RESOURCE_PLAN.json { must_use, prefer, avoid }.
export function recommend(resources, domain, task, { includeReview = true, availableTools = new Set(), config = baselineConfig, taxonomy = {}, openMechanisms = true, controls = {}, context = {}, plan = null } = {}) {
  validateRouterConfig(config);
  const terms = new Set(String(task).toLowerCase().match(/[a-z0-9]+/g) ?? []);
  const tags = new Set((context.tags ?? []).map((tag) => String(tag).toLowerCase()));
  const must = new Set((plan?.must_use ?? []).map((item) => item.id));
  const prefer = new Set(plan?.prefer ?? []);
  const avoid = new Set(plan?.avoid ?? []);
  const considered = resources.map((resource) => {
    const control = controls[resource.id] ?? {};
    const trust = control.trust ?? resource.trust;
    const rightsCleared = control.rights?.cleared === true;
    const reasons = [];
    if (['REJECTED', 'DEPRECATED'].includes(trust)) reasons.push(`trust=${trust}`);
    if (control.banned) reasons.push('banned by the owner');
    const avoidedFor = (control.avoid_for ?? []).filter((tag) => tags.has(tag));
    if (avoidedFor.length) reasons.push(`the owner avoids this for ${avoidedFor.join(', ')}`);
    if (avoid.has(resource.id)) reasons.push('this project avoids this resource');
    if (codeModes.has(resource.usage_mode) && !resource.license && !rightsCleared) reasons.push('code reuse rights unverified');
    if (resource.usage_mode === 'optional_tool' && (!resource.tool_id || !availableTools.has(resource.tool_id))) {
      reasons.push('optional tool unavailable or not enabled in router');
    }
    const haystack = [resource.name, ...(resource.best_for ?? []), ...(resource.categories ?? [])]
      .join(' ').toLowerCase();
    const categoryHits = effectiveCategories(resource, taxonomy).filter((category) => domain.categories.includes(category));
    const words = new Set(haystack.match(/[a-z0-9]+/g) ?? []);
    const taskHits = [...terms].filter((term) => term.length > 2 &&
      (config.match_mode === 'token' ? words.has(term) : haystack.includes(term)));
    const pinned = (control.pin_for ?? []).some((tag) => tags.has(tag)) || must.has(resource.id);
    const boost = (control.boost ?? 0) + (prefer.has(resource.id) ? 2 : 0);
    let score = categoryHits.length * config.category_weight + taskHits.length * config.task_weight
      + (trust === 'TRUSTED' ? config.trusted_bonus : 0);
    if (score > 0 || pinned) score += boost;
    if (!categoryHits.length && !taskHits.length && !pinned) reasons.push('no domain or task match');
    const cautioned = (Boolean(resource.use_caution) && !rightsCleared) || (Boolean(resource.license?.restriction) && !control.rights?.override_restriction);
    const openMechanism = openMechanisms && MECHANISM_MODES.has(resource.usage_mode) && !cautioned;
    if (!eligibleTrust.has(trust)) {
      if (!openMechanism) reasons.push(cautioned
        ? `ask the owner to approve before use: ${resource.use_caution ?? resource.license.restriction}`
        : `trust=${trust}; owner/agent review needed`);
      else if (!taskHits.length && !pinned) reasons.push('unreviewed resource matched by category only; add task words to confirm relevance');
    }
    const status = reasons.length ? 'review' : 'ready';
    return { id: resource.id, name: resource.name, usage_mode: resource.usage_mode,
      trust, score, status, reasons, matched_categories: categoryHits,
      matched_terms: taskHits, url: resource.url, my_take: resource.my_take,
      ...(pinned ? { pinned: true } : {}), ...(must.has(resource.id) ? { must_use: true } : {}),
      ...(control.boost ? { owner_boost: control.boost } : {}), ...(control.tags?.length ? { owner_tags: control.tags } : {}),
      ...(resource.caveat ? { caveat: resource.caveat } : {}) };
  }).filter((item) => item.score > 0 || item.pinned)
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || b.score - a.score || (trustRank[b.trust] ?? 0) - (trustRank[a.trust] ?? 0) || a.id.localeCompare(b.id));
  // Pinned and must-use items are never cut by the shortlist size.
  const cap = (items, max) => items.slice(0, Math.max(max, items.filter((item) => item.pinned).length));
  return { domain: domain.id, task, agents: domain.agents, outputs: domain.outputs,
    config_version: config.version,
    ready: cap(considered.filter((item) => item.status === 'ready'), config.max_ready),
    review: includeReview ? cap(considered.filter((item) => item.status === 'review'), config.max_review) : [] };
}
