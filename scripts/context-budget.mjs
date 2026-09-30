#!/usr/bin/env node
// Startup context budget per agent and mode. Exit 1 if a cap is exceeded or the budget file drifts.
//   node scripts/context-budget.mjs [--json]
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contextBudget } from './lib/agent-budget.mjs';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const result = contextBudget(root);
if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`always loaded (CLAUDE.md + AGENTS.md): ~${result.always_tokens} tokens\n`);
  console.log('agent'.padEnd(22), 'mode'.padEnd(10), 'model'.padEnd(7), 'tokens'.padStart(7), 'cap'.padStart(7), ' loaded skills');
  for (const row of result.rows) {
    console.log(row.agent.padEnd(22), row.mode.padEnd(10), row.model.padEnd(7), String(row.tokens).padStart(7), String(row.cap).padStart(7), ' ' + (row.load.join(', ') || '-'));
  }
  if (result.errors.length) console.error('\n' + result.errors.map((error) => `✗ ${error}`).join('\n'));
  else console.log('\n✓ context budget ok');
}
process.exit(result.errors.length ? 1 : 0);
