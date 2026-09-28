import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { recommend } from '../../scripts/lib/resource-selector.mjs';

test('selector keeps unapproved and unlicensed code in review queue', () => {
  const domain = { id: 'taste', agents: ['taste-research'], outputs: [], categories: ['motion'] };
  const resources = [
    { id: 'a', name: 'Motion A', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'APPROVED', url: 'a' },
    { id: 'b', name: 'Motion B', categories: ['motion'], best_for: ['hero'], usage_mode: 'code_reference', trust: 'TRUSTED', url: 'b' },
    { id: 'c', name: 'Motion C', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'REVIEWED', url: 'c' },
  ];
  const result = recommend(resources, domain, 'motion hero');
  assert.deepEqual(result.ready.map((r) => r.id), ['a']);
  assert.deepEqual(new Set(result.review.map((r) => r.id)), new Set(['b', 'c']));
  assert.match(result.review.find((r) => r.id === 'b').reasons.join(' '), /rights unverified/);
});

test('optional tool is ready only when its router entry is available', () => {
  const domain = { id: 'research', agents: ['research'], outputs: [], categories: ['browser'] };
  const resource = { id: 'agent-browser', name: 'Agent Browser', categories: ['browser'], best_for: ['browser inspection'],
    usage_mode: 'optional_tool', trust: 'APPROVED', tool_id: 'agent_browser_cli', url: 'https://example.com' };
  assert.equal(recommend([resource], domain, 'browser').ready.length, 0);
  assert.equal(recommend([resource], domain, 'browser', { availableTools: new Set(['agent_browser_cli']) }).ready[0].id, 'agent-browser');
});
