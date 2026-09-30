#!/usr/bin/env node
// Model tiers match brain/agent-budget.json; every routed tool in an agent's frontmatter is allowed by brain/tools.json.
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAgents, validateAgents } from './lib/agent-budget.mjs';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const errors = validateAgents(root);
if (errors.length) { console.error(errors.map((error) => `✗ ${error}`).join('\n')); process.exit(1); }
console.log(`✓ agents valid — ${loadAgents(root).length} agents: model tiers and tool routing consistent`);
