#!/usr/bin/env node
// Optional advisory decision probe. Never dispatches an agent or passes a gate.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { advisoryResult, askJev, loadJevKey, requestFor } from './lib/jev.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command, task, file, publicFlag] = process.argv.slice(2);
if (command !== 'probe' && !(command === 'classify' && ['route', 'link'].includes(task) && file && publicFlag === '--public')) {
  console.error('usage: node scripts/jev.mjs probe | classify <route|link> <public-text-file> --public');
  process.exitCode = 2;
} else {
  try {
    const key = loadJevKey(root);
    if (!key) throw new Error('TYPESAFE_API_KEY is missing from environment or ignored root .env');
    const kind = command === 'probe' ? 'route' : task;
    const state = command === 'probe'
      ? 'A visitor wants to see portfolio case studies and selected work.'
      : readFileSync(resolve(file), 'utf8');
    const response = await askJev(key, requestFor(kind, state));
    console.log(JSON.stringify({ mode: 'shadow', ...advisoryResult(kind, response),
      usage: response.usage ?? null }));
  } catch (error) {
    console.error(`Jev advisory unavailable: ${error.message}`);
    process.exitCode = 1;
  }
}
