// docs/DISCOVERY.md contract for contract_version 2 sites (company-site and product-site pipelines).
// The brief is researched first, then questions are generated from what competitors show, then additions are proposed and
// the owner decides each one. This module only checks that the record is complete; it never decides anything.
import { existsSync, readFileSync } from 'node:fs';

export const DISCOVERY_PIPELINES = new Set(['company-site', 'product-site']);
export const FIXED_TOPICS = ['ownership', 'legal', 'conversion', 'contact'];

// Returns the rows of the first markdown table under a "## <title>" heading as objects keyed by lower-cased header.
export function tableUnder(markdown, title) {
  const start = markdown.search(new RegExp(`^##\\s+[0-9.]*\\s*${title}`, 'im'));
  if (start < 0) return null;
  const section = markdown.slice(start).split(/\r?\n/).slice(1);
  const lines = [];
  for (const line of section) {
    if (/^##\s/.test(line)) break;
    if (line.trim().startsWith('|')) lines.push(line.trim());
  }
  if (lines.length < 2) return [];
  const cells = (line) => line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const headers = cells(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(2).map((line) => Object.fromEntries(cells(line).map((value, i) => [headers[i] ?? `col${i}`, value])));
}

const blank = (value) => !value || /^(<.*>|tbd|todo|-|n\/a)?$/i.test(value.trim());

export function validateDiscovery(markdown, audit) {
  const problems = [];
  const questions = tableUnder(markdown, 'Tailored questions');
  const additions = tableUnder(markdown, 'Suggested additions');
  const fixed = tableUnder(markdown, 'Fixed checks');
  if (questions === null) problems.push('missing the "Tailored questions" table');
  else {
    if (questions.filter((q) => !blank(q.question)).length < 3) problems.push('fewer than 3 tailored questions; generate them from the competitor evidence');
    for (const q of questions.filter((row) => !blank(row.question))) {
      if (blank(q['why we ask (evidence)'])) problems.push(`question "${q.question.slice(0, 40)}" has no evidence for why it is asked`);
      const status = (q.status ?? '').toLowerCase();
      if (!['answered', 'skipped'].includes(status)) problems.push(`question "${q.question.slice(0, 40)}" is still ${status || 'unmarked'}; the owner answers or skips it`);
      else if (status === 'answered' && blank(q['answer (owner)'])) problems.push(`question "${q.question.slice(0, 40)}" is marked answered without an answer`);
    }
  }
  if (additions === null) problems.push('missing the "Suggested additions" table');
  else {
    if (additions.filter((a) => !blank(a.addition)).length < 1) problems.push('no suggested additions; compare the competitor matrix to the client');
    for (const a of additions.filter((row) => !blank(row.addition))) {
      if (blank(a.evidence)) problems.push(`addition "${a.addition.slice(0, 40)}" has no evidence`);
      if (!['accept', 'reject', 'defer'].includes((a.decision ?? '').toLowerCase())) problems.push(`addition "${a.addition.slice(0, 40)}" has no owner decision (accept, reject or defer)`);
    }
  }
  if (fixed === null) problems.push('missing the "Fixed checks" table');
  else for (const topic of FIXED_TOPICS) {
    const row = fixed.find((r) => (r.topic ?? '').toLowerCase().includes(topic));
    if (!row || blank(row.answer)) problems.push(`fixed check "${topic}" is unanswered`);
  }
  const competitors = (audit?.sites ?? []).filter((s) => s.role === 'competitor');
  const usable = competitors.filter((s) => !s.skipped);
  if (!audit) problems.push('docs/COMPETITOR_AUDIT.json is missing; run scripts/competitor-audit.mjs');
  else if (usable.length < 3 && !/competitor exception:\s*(?!\(only if)[^\s(]/i.test(markdown)) problems.push(`only ${usable.length} competitor site(s) audited; audit at least 3 or write "Competitor exception: <reason>" in DISCOVERY.md`);
  return problems;
}

export function loadAudit(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}
