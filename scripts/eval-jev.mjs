#!/usr/bin/env node
// Tiny synthetic shadow evaluation: this sends no client data and grants no authority.
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { advisoryResult, askJev, loadJevKey, requestFor } from './lib/jev.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const key = loadJevKey(root);
if (!key) { console.error('TYPESAFE_API_KEY missing'); process.exitCode = 2; }
else {
  const cases = [
    { id: 'route-ux', task: 'route', state: 'Map the visitor journey and create mobile wireframes for the new company site.', expected: 'ux' },
    { id: 'route-growth', task: 'route', state: 'Review canonical tags, sitemap entries and FAQ structured data for 12 public pages.', expected: 'growth' },
    { id: 'route-backend', task: 'route', state: 'Implement the server contact handler with Zod, rate limiting and email delivery.', expected: 'backend' },
    { id: 'route-taste', task: 'route', state: 'Study local design videos and extract original motion mechanisms with rights notes.', expected: 'taste-research' },
    { id: 'link-good', task: 'link', state: 'Source page: Portfolio work index about six software projects. Proposed anchor: Read the Edge Node case study. Target page: Edge Node architecture, results and evidence.', expected: 'relevant' },
    { id: 'link-bad', task: 'link', state: 'Source page: Contact page with email and social links. Proposed anchor: Learn about edge architecture. Target page: Unrelated privacy policy.', expected: 'irrelevant' },
  ];
  const results = [];
  for (const item of cases) {
    const start = performance.now();
    try {
      const response = await askJev(key, requestFor(item.task, item.state));
      const verdict = advisoryResult(item.task, response);
      const value = item.task === 'route' ? verdict.candidate : verdict.candidate >= 1.5 ? 'relevant' : 'irrelevant';
      results.push({ id: item.id, expected: item.expected, status: verdict.status,
        observed: verdict.status === 'advisory' ? value : null,
        confidence: verdict.confidence ?? null, correct: verdict.status === 'advisory' && value === item.expected,
        milliseconds: Math.round(performance.now() - start), input_tokens: response.usage?.input_tokens ?? null });
    } catch (error) { results.push({ id: item.id, expected: item.expected, status: 'error', error: error.message }); }
  }
  const summary = { model: 'jev-1.13.0', mode: 'shadow', date: new Date().toISOString(),
    cases: results, correct: results.filter((r) => r.correct).length,
    abstained: results.filter((r) => r.status === 'abstain').length,
    note: 'Synthetic cases are a smoke test only; no production routing until a larger labeled domain sample is evaluated.' };
  const out = join(root, 'docs', 'evidence', 'jev-shadow-eval-2026-09-28.json');
  writeFileSync(out, JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ cases: results.length, correct: summary.correct, abstained: summary.abstained, errors: results.filter((r) => r.status === 'error').length, output: 'docs/evidence/jev-shadow-eval-2026-09-28.json' }));
}
