import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { advisoryResult, requestFor } from '../../scripts/lib/jev.mjs';

test('Jev routes are advisory and cannot invent a specialist', () => {
  const body = requestFor('route', 'Review the portfolio typography');
  assert.equal(body.questions.specialist.type, 'choice');
  assert.equal(advisoryResult('route', { answers: { specialist: {
    type: 'choice', choice: 'deploy-immediately', confidence: 1,
  } } }).status, 'abstain');
  assert.equal(advisoryResult('route', { answers: { specialist: {
    type: 'choice', choice: 'design-director', confidence: .65,
  } } }).status, 'abstain');
});

test('link relevance bounds and input size are enforced', () => {
  assert.throws(() => requestFor('link', 'x'.repeat(4001)));
  assert.equal(advisoryResult('link', { answers: { relevance: {
    type: 'score', score: 99, confidence: 1,
  } } }).status, 'abstain');
});
