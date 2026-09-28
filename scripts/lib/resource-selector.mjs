const eligibleTrust = new Set(['APPROVED', 'TRUSTED']);
const codeModes = new Set(['dependency', 'direct_or_reference', 'code_reference', 'skill']);
import { baselineConfig, validateRouterConfig } from './learning-config.mjs';

export function recommend(resources, domain, task, { includeReview = true, availableTools = new Set(), config = baselineConfig } = {}) {
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
    const categoryHits = (resource.categories ?? []).filter((category) => domain.categories.includes(category));
    const words = new Set(haystack.match(/[a-z0-9]+/g) ?? []);
    const taskHits = [...terms].filter((term) => term.length > 2 &&
      (config.match_mode === 'token' ? words.has(term) : haystack.includes(term)));
    const score = categoryHits.length * config.category_weight + taskHits.length * config.task_weight
      + (resource.trust === 'TRUSTED' ? config.trusted_bonus : 0);
    if (!categoryHits.length && !taskHits.length) reasons.push('no domain or task match');
    if (!eligibleTrust.has(resource.trust)) reasons.push(`trust=${resource.trust}; owner/agent review needed`);
    const status = reasons.length ? 'review' : 'ready';
    return { id: resource.id, name: resource.name, usage_mode: resource.usage_mode,
      trust: resource.trust, score, status, reasons, matched_categories: categoryHits,
      matched_terms: taskHits, url: resource.url };
  }).filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return { domain: domain.id, task, agents: domain.agents, outputs: domain.outputs,
    config_version: config.version,
    ready: considered.filter((item) => item.status === 'ready').slice(0, config.max_ready),
    review: includeReview ? considered.filter((item) => item.status === 'review').slice(0, config.max_review) : [] };
}
