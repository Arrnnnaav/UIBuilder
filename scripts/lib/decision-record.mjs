// "Why is this blue?" — the decision record tables in docs/DESIGN.md and docs/MOTION.md (contract_version 2).
// Every row names a decision, its value, the reason, a checkable source and the alternative that was rejected.
import { tableUnder } from './discovery.mjs';

export const SOURCE_KINDS = ['brief', 'competitor', 'resource', 'preference', 'measured', 'owner', 'a11y', 'perf', 'rule'];
const COVERAGE = {
  design: { minRows: 6, needs: { color: /colou?r|palette|accent|contrast/i, typography: /type|font|typeface|scale/i, layout: /layout|spacing|grid|hero|radius/i, imagery: /imag|photo|video|illustration|media/i } },
  motion: { minRows: 4, needs: { easing: /eas(e|ing)|curve|spring/i, duration: /duration|timing|speed/i, signature: /signature|hero|story|scroll/i, reduced: /reduced|static|fallback/i } },
};
const blank = (value) => !value || /^(<.*>|tbd|todo|-|n\/a)?$/i.test(value.trim());

export function parseRecord(markdown) {
  return tableUnder(markdown, 'Decision record');
}

// context: { resourceIds: Set, competitorHosts: Set|null }
export function validateRecord(markdown, kind, { resourceIds, competitorHosts = null }) {
  const problems = [];
  const rows = parseRecord(markdown);
  if (rows === null) return [`missing the "Decision record" table in the ${kind} document`];
  const real = rows.filter((row) => !blank(row.decision));
  const rule = COVERAGE[kind];
  if (real.length < rule.minRows) problems.push(`${kind} decision record has ${real.length} rows; at least ${rule.minRows} are needed`);
  for (const row of real) {
    const label = `${row.id || '?'} (${row.decision.slice(0, 30)})`;
    if (blank(row.value)) problems.push(`${label}: no value`);
    if (blank(row.reason) || row.reason.length < 12) problems.push(`${label}: give a real reason (12+ characters)`);
    if (blank(row['rejected alternative']) || row['rejected alternative'].length < 4) problems.push(`${label}: name the alternative that was rejected`);
    const sources = (row.source ?? '').split(/[;,]/).map((s) => s.trim()).filter(Boolean);
    if (!sources.length) problems.push(`${label}: no source`);
    for (const source of sources) {
      const [type, ...rest] = source.split(':');
      const detail = rest.join(':').trim();
      if (!SOURCE_KINDS.includes(type)) problems.push(`${label}: unknown source kind "${type}" (use ${SOURCE_KINDS.join(', ')})`);
      else if (['competitor', 'resource', 'measured', 'rule'].includes(type) && !detail) problems.push(`${label}: "${type}:" needs a detail (${type}:<name>)`);
      else if (type === 'resource' && !resourceIds.has(detail)) problems.push(`${label}: resource "${detail}" is not in the Brain`);
      else if (type === 'competitor' && competitorHosts && ![...competitorHosts].some((h) => h.includes(detail.replace(/^www\./, '')))) problems.push(`${label}: competitor "${detail}" is not in COMPETITOR_AUDIT.json`);
    }
  }
  for (const [name, pattern] of Object.entries(rule.needs)) {
    if (!real.some((row) => pattern.test(row.decision))) problems.push(`the ${kind} record has no decision about ${name}`);
  }
  return problems;
}

export function competitorHostsFrom(audit) {
  if (!audit) return null;
  const hosts = (audit.sites ?? []).map((site) => { try { return new URL(site.url).hostname.replace(/^www\./, ''); } catch { return null; } }).filter(Boolean);
  return new Set(hosts);
}
