#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate } from './lib/mini-schema.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(readFileSync(join(root, 'templates/docs/HANDOFF.schema.json'), 'utf8'));
const errors = [];
const agents = new Set(['orchestrator']);
for (const file of readdirSync(join(root, '.claude/agents')).filter((name) => name.endsWith('.md'))) {
  const text = readFileSync(join(root, '.claude/agents', file), 'utf8');
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const name = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  if (!name || file !== `${name}.md`) errors.push(`agents/${file}: missing or mismatched name`);
  else agents.add(name);
  for (const key of ['description', 'tools']) if (!new RegExp(`^${key}:\\s*\\S`, 'm').test(frontmatter?.[1] ?? '')) errors.push(`agents/${file}: missing ${key}`);
}
for (const agent of schema.properties.agent.enum) if (!agents.has(agent)) errors.push(`handoff schema references missing agent ${agent}`);
for (const agent of agents) if (!schema.properties.agent.enum.includes(agent)) errors.push(`agent ${agent} missing from handoff schema`);
let handoffs = 0;
for (const project of readdirSync(join(root, 'projects'), { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const directory = join(root, 'projects', project.name, 'docs/handoff');
  if (!existsSync(directory)) continue;
  for (const file of readdirSync(directory).filter((name) => name.endsWith('.json'))) {
    try {
      const value = JSON.parse(readFileSync(join(directory, file), 'utf8'));
      errors.push(...validate(schema, value).map((error) => `${project.name}/docs/handoff/${file}: ${error}`));
      handoffs++;
    } catch (error) { errors.push(`${project.name}/docs/handoff/${file}: ${error.message}`); }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`✓ contracts valid — ${agents.size} roles, ${handoffs} handoffs`);
