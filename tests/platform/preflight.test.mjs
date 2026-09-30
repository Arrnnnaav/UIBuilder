import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preflightErrors, visualSkillErrors, referenceErrors } from '../../scripts/lib/preflight.mjs';

const brain = [
  { id: 'a', trust: 'APPROVED', usage_mode: 'inspiration_only' },
  { id: 'old', trust: 'DEPRECATED', usage_mode: 'inspiration_only' },
  { id: 'lib-nolic', trust: 'APPROVED', usage_mode: 'dependency', license: null },
  { id: 'lib-ok', trust: 'APPROVED', usage_mode: 'dependency', license: 'MIT' },
];

test('rule 4: visual agents must use or record frontend-design', () => {
  const env = (extra) => ({ agent: 'frontend', environment: { bootstrap_task: 'frontend', skills_checked: [], unavailable_and_fallbacks: [], ...extra } });
  assert.equal(visualSkillErrors(env({})).length, 1);
  assert.deepEqual(visualSkillErrors(env({ skills_used: ['frontend-design'] })), []);
  assert.deepEqual(visualSkillErrors(env({ unavailable_and_fallbacks: ['frontend-design missing -> frontend-ui-engineering'] })), []);
  assert.deepEqual(visualSkillErrors(env({ waiver: 'legacy handoff before this rule' })), []);
  assert.deepEqual(visualSkillErrors({ agent: 'ship', environment: {} }), []);
});

test('rule 5: cited references must exist, be current, and code-type ones licensed', () => {
  assert.deepEqual(referenceErrors({ resources_used: ['a', 'lib-ok'] }, brain), []);
  assert.equal(referenceErrors({ resources_used: ['missing'] }, brain).length, 1);
  assert.equal(referenceErrors({ resources_used: ['old'] }, brain).length, 1);
  assert.equal(referenceErrors({ resources_used: ['lib-nolic'] }, brain).length, 1);
  assert.deepEqual(referenceErrors({}, brain), []);
});

const good = { environment: { bootstrap_task: 'website', skills_checked: ['frontend-design'], unavailable_and_fallbacks: [] } };

test('handoff without environment fails the preflight check', () => {
  assert.equal(preflightErrors({}).length, 1);
});

test('valid environment record passes', () => {
  assert.deepEqual(preflightErrors(good), []);
});

test('unknown bootstrap task and missing arrays fail', () => {
  const errors = preflightErrors({ environment: { bootstrap_task: 'anything' } });
  assert.equal(errors.length, 3);
});

test('a written waiver reason is accepted, a token one is not', () => {
  assert.deepEqual(preflightErrors({ environment: { waiver: 'legacy handoff written before bootstrap existed' } }), []);
  assert.ok(preflightErrors({ environment: { waiver: 'n/a' } }).length > 0);
});
