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

export function recommend(resources, domain, task, { includeReview = true, availableTools = new Set(), config = baselineConfig, taxonomy = {}, openMechanisms = true } = {}) {
  validateRouterConfig(config);
  const terms = new Set(String(task).toLowerCase().match(/[a-z0-9]+/g) ?? []);
  const considered = resources.map((resource) => {
    const reasons = [];
    if (['REJECTED', 'DEPRECATED'].includes(resource.trust)) reasons.push(`trust=${resource.trust}`);
    if (codeModes.has(resource.usage_mode) && !resource.license) reasons.push('code reuse rights unverified');
    if (resource.usage_mode === 'optional_tool' && (!resource.tool_id || !availableTools.has(resource.tool_id))) {
      reasons.push('optional tool unavailable or not enabled in router');
    }
    const haystack = [resource.name, ...(resource.best_for ?? []), ...(resource.categories ?? [])]
      .join(' ').toLowerCase();
    const categoryHits = effectiveCategories(resource, taxonomy).filter((category) => domain.categories.includes(category));
    const words = new Set(haystack.match(/[a-z0-9]+/g) ?? []);
    const taskHits = [...terms].filter((term) => term.length > 2 &&
      (config.match_mode === 'token' ? words.has(term) : haystack.includes(term)));
    const score = categoryHits.length * config.category_weight + taskHits.length * config.task_weight
      + (resource.trust === 'TRUSTED' ? config.trusted_bonus : 0);
    if (!categoryHits.length && !taskHits.length) reasons.push('no domain or task match');
    const cautioned = Boolean(resource.use_caution) || Boolean(resource.license?.restriction);
    const openMechanism = openMechanisms && MECHANISM_MODES.has(resource.usage_mode) && !cautioned;
    if (!eligibleTrust.has(resource.trust)) {
      if (!openMechanism) reasons.push(cautioned
        ? `ask the owner to approve before use: ${resource.use_caution ?? resource.license.restriction}`
        : `trust=${resource.trust}; owner/agent review needed`);
      else if (!taskHits.length) reasons.push('unreviewed resource matched by category only; add task words to confirm relevance');
    }
    const status = reasons.length ? 'review' : 'ready';
    return { id: resource.id, name: resource.name, usage_mode: resource.usage_mode,
      trust: resource.trust, score, status, reasons, matched_categories: categoryHits,
      matched_terms: taskHits, url: resource.url, my_take: resource.my_take, ...(resource.caveat ? { caveat: resource.caveat } : {}) };
  }).filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (trustRank[b.trust] ?? 0) - (trustRank[a.trust] ?? 0) || a.id.localeCompare(b.id));
  return { domain: domain.id, task, agents: domain.agents, outputs: domain.outputs,
    config_version: config.version,
    ready: considered.filter((item) => item.status === 'ready').slice(0, config.max_ready),
    review: includeReview ? considered.filter((item) => item.status === 'review').slice(0, config.max_review) : [] };
}
