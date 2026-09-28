import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const baselineVersion = 'router-v1';
export const baselineConfig = Object.freeze({
  version: baselineVersion, surface: 'resource_ranking', category_weight: 3,
  task_weight: 2, trusted_bonus: 1, match_mode: 'substring', max_ready: 5, max_review: 5,
});

export function validateRouterConfig(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('router config must be an object');
  const keys = Object.keys(baselineConfig).sort();
  if (JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(keys)) throw new Error('router config fields changed');
  if (!/^router-v[0-9]+(?:-[a-z0-9-]+)?$/.test(value.version)) throw new Error('invalid router version');
  if (value.surface !== 'resource_ranking') throw new Error('unsupported update surface');
  if (!['substring', 'token'].includes(value.match_mode)) throw new Error('invalid match mode');
  for (const key of ['category_weight', 'task_weight', 'trusted_bonus']) {
    if (!Number.isInteger(value[key]) || value[key] < 0 || value[key] > 10) throw new Error(`invalid ${key}`);
  }
  for (const key of ['max_ready', 'max_review']) {
    if (!Number.isInteger(value[key]) || value[key] < 1 || value[key] > 10) throw new Error(`invalid ${key}`);
  }
  return value;
}

export function loadActiveRouterConfig(root, env = process.env) {
  if (env.UIBUILDER_LEARNING === '0') return baselineConfig;
  const base = join(root, 'brain', 'learning');
  const active = JSON.parse(readFileSync(join(base, 'active.json'), 'utf8'));
  if (!/^router-v[0-9]+(?:-[a-z0-9-]+)?$/.test(active.version)) throw new Error('invalid active router version');
  const config = JSON.parse(readFileSync(join(base, 'versions', `${active.version}.json`), 'utf8'));
  if (config.version !== active.version) throw new Error('active router version mismatch');
  return validateRouterConfig(config);
}
