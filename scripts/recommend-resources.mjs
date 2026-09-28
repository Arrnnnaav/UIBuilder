#!/usr/bin/env node
// Explainable resource shortlist. Does not install or activate tools.
import { existsSync, readFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recommend } from './lib/resource-selector.mjs';
import { loadActiveRouterConfig } from './lib/learning-config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [domainId, ...words] = process.argv.slice(2);
const domains = JSON.parse(readFileSync(join(root, 'brain/domains.json'), 'utf8')).domains;
const cliAvailable = (binary) => {
  const suffixes = process.platform === 'win32' ? ['', '.exe', '.cmd', '.ps1'] : [''];
  return (process.env.PATH ?? process.env.Path ?? '').split(delimiter)
    .some(directory => suffixes.some(suffix => existsSync(join(directory, `${binary}${suffix}`))));
};
const domain = domains.find((item) => item.id === domainId);
if (!domain || !words.length) {
  console.error(`usage: node scripts/recommend-resources.mjs <${domains.map((d) => d.id).join('|')}> <task words>`);
  process.exitCode = 2;
} else {
  const resources = JSON.parse(readFileSync(join(root, 'brain/resources.json'), 'utf8')).resources;
  const tools = JSON.parse(readFileSync(join(root, 'brain/tools.json'), 'utf8')).tools;
  const availableTools = new Set(tools.filter(tool => {
    if (!tool.agents.some(agent => domain.agents.includes(agent))) return false;
    if (tool.enabled_if === 'always') return true;
    if (tool.enabled_if?.startsWith('cli:')) {
      const binary = tool.enabled_if.slice(4);
      return cliAvailable(binary);
    }
    return false; // env, MCP and owner enables need explicit per-run verification.
  }).map(tool => tool.id));
  console.log(JSON.stringify(recommend(resources, domain, words.join(' '),
    { availableTools, config: loadActiveRouterConfig(root) }), null, 2));
}
