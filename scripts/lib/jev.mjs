import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const endpoint = 'https://api.typesafe.ai/v1/systemone';
const roles = {
  research: 'Find and verify public sources or competitors',
  'taste-research': 'Study visual references, motion, video, and interaction mechanisms',
  ux: 'Plan information architecture, user journeys, and wireframes',
  'design-director': 'Choose visual direction, typography, colour, and motion language',
  frontend: 'Implement pages, components, responsive UI, and browser interactions',
  backend: 'Implement server code, data integrations, and contact handling',
  growth: 'Audit SEO, structured data, answer content, and internal link relevance',
  ship: 'Test accessibility, performance, security, and release readiness',
  'domain-ops': 'Plan domains, DNS, TLS, redirects, and mail authentication',
  'product-manager': 'Clarify scope, priorities, and acceptance criteria',
  'brain-evaluator': 'Analyze verified run failures and evaluate bounded Brain candidates offline',
  other: 'The request needs human clarification or does not fit a specialist',
};

export function loadJevKey(root) {
  if (process.env.TYPESAFE_API_KEY?.trim()) return process.env.TYPESAFE_API_KEY.trim();
  try {
    const line = readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)
      .find((item) => /^TYPESAFE_API_KEY=/.test(item));
    return line?.slice('TYPESAFE_API_KEY='.length).trim() || null;
  } catch { return null; }
}

export function requestFor(task, state) {
  if (typeof state !== 'string' || !state.trim() || state.length > 4000) {
    throw new Error('state must be 1–4000 characters');
  }
  if (task === 'route') return {
    model: 'jev-1.13.0', state,
    questions: { specialist: {
      type: 'choice',
      instructions: 'Which UIBuilder specialist should first review this task? This is an advisory classification only.',
      criteria: roles,
    } },
  };
  if (task === 'link') return {
    model: 'jev-1.13.0', state,
    questions: { relevance: {
      type: 'score',
      instructions: 'How well does the proposed internal link help a visitor understand the source page topic?',
      criteria: ['Unrelated or misleading', 'Somewhat related but weak', 'Clearly relevant and useful'],
    } },
  };
  throw new Error('task must be route or link');
}

export function advisoryResult(task, response) {
  const answer = response?.answers?.[task === 'route' ? 'specialist' : 'relevance'];
  const valid = task === 'route'
    ? answer?.type === 'choice' && Object.hasOwn(roles, answer.choice)
    : answer?.type === 'score' && Number.isFinite(answer.score) && answer.score >= 0 && answer.score <= 2;
  const confidence = answer?.confidence;
  if (!valid || !Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    return { status: 'abstain', reason: 'invalid model answer' };
  }
  return { status: confidence >= 0.8 ? 'advisory' : 'abstain',
    candidate: task === 'route' ? answer.choice : answer.score,
    confidence, model: response.model, reason: confidence >= 0.8 ? 'human review required' : 'low confidence' };
}

export async function askJev(key, body, fetcher = fetch) {
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Jev HTTP ${response.status}`);
  return response.json();
}
