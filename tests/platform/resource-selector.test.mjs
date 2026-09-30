import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { recommend } from '../../scripts/lib/resource-selector.mjs';

test('selector keeps unlicensed code, code-mode without approval and cautioned resources in review', () => {
  const domain = { id: 'taste', agents: ['taste-research'], outputs: [], categories: ['motion'] };
  const resources = [
    { id: 'a', name: 'Motion A', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'APPROVED', url: 'a', my_take: 'Use for scene pacing; redraw the artwork.' },
    { id: 'b', name: 'Motion B', categories: ['motion'], best_for: ['hero'], usage_mode: 'code_reference', trust: 'TRUSTED', url: 'b' },
    { id: 'c', name: 'Motion C', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'REVIEWED', url: 'c' },
    { id: 'd', name: 'Motion D', categories: ['motion'], best_for: ['hero'], usage_mode: 'code_reference', trust: 'NEW', license: { spdx: 'MIT' }, url: 'd' },
    { id: 'e', name: 'Motion E', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'NEW', use_caution: 'unverified terms', url: 'e' },
  ];
  const result = recommend(resources, domain, 'motion hero');
  assert.deepEqual(result.ready.map((r) => r.id), ['a', 'c']);
  assert.equal(result.ready[0].my_take, 'Use for scene pacing; redraw the artwork.');
  assert.deepEqual(new Set(result.review.map((r) => r.id)), new Set(['b', 'd', 'e']));
  assert.match(result.review.find((r) => r.id === 'b').reasons.join(' '), /rights unverified/);
  assert.match(result.review.find((r) => r.id === 'e').reasons.join(' '), /unverified terms/);
  assert.equal(recommend(resources, domain, 'motion hero', { openMechanisms: false }).ready.some((r) => r.id === 'c'), false);
});

test('unreviewed mechanism resource needs a task-word match, and a taxonomy alias reaches a domain', () => {
  const domain = { id: 'immersive', agents: ['design-director'], outputs: [], categories: ['immersive'] };
  const resource = { id: 'w', name: 'WebGL study', categories: ['webgl'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'NEW', url: 'w' };
  assert.equal(recommend([resource], domain, 'anything').ready.length, 0);
  const taxonomy = { webgl: ['immersive'] };
  const categoryOnly = recommend([resource], domain, 'zzz', { taxonomy });
  assert.equal(categoryOnly.ready.length, 0);
  assert.match(categoryOnly.review[0].reasons.join(' '), /category only/);
  assert.equal(recommend([resource], domain, 'hero', { taxonomy }).ready[0].id, 'w');
});

test('a resource caveat is carried into the shortlist entry', () => {
  const domain = { id: 'research', agents: [], outputs: [], categories: ['research'] };
  const resource = { id: 'j', name: 'Advisor', categories: ['research'], best_for: ['routing'], usage_mode: 'inspiration_only', trust: 'APPROVED', url: 'j', caveat: 'advisory only' };
  assert.equal(recommend([resource], domain, 'routing').ready[0].caveat, 'advisory only');
  assert.equal('caveat' in recommend([{ ...resource, caveat: undefined }], domain, 'routing').ready[0], false);
});

test('retired resources stay blocked even as mechanisms', () => {
  const domain = { id: 'taste', agents: [], outputs: [], categories: ['motion'] };
  const resource = { id: 'r', name: 'Old', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'DEPRECATED', url: 'r' };
  assert.equal(recommend([resource], domain, 'motion hero').ready.length, 0);
});

test('optional tool is ready only when its router entry is available', () => {
  const domain = { id: 'research', agents: ['research'], outputs: [], categories: ['browser'] };
  const resource = { id: 'agent-browser', name: 'Agent Browser', categories: ['browser'], best_for: ['browser inspection'],
    usage_mode: 'optional_tool', trust: 'APPROVED', tool_id: 'agent_browser_cli', url: 'https://example.com' };
  assert.equal(recommend([resource], domain, 'browser').ready.length, 0);
  assert.equal(recommend([resource], domain, 'browser', { availableTools: new Set(['agent_browser_cli']) }).ready[0].id, 'agent-browser');
});
