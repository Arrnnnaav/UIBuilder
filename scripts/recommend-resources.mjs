#!/usr/bin/env node
// Explainable resource shortlist. Does not install or activate tools.
//   node scripts/recommend-resources.mjs <domain> <task words...> [--tags a,b] [--project <slug>]
// --tags adds task/project tags that owner pins and avoids match against. --project reads that site's
// docs/RESOURCE_PLAN.json (must-use / prefer / avoid, plus its tags) from the projects root.
import { existsSync, readFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recommend } from './lib/resource-selector.mjs';
import { loadActiveRouterConfig } from './lib/learning-config.mjs';
import { loadControls } from './lib/owner-controls.mjs';
import { loadPlan } from './lib/resource-plan.mjs';
import { readKey } from './lib/media-providers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const firstFlag = argv.findIndex((item) => item.startsWith('--'));
const positional = firstFlag < 0 ? argv : argv.slice(0, firstFlag);
const flags = firstFlag < 0 ? [] : argv.slice(firstFlag);
const flag = (name) => { const i = flags.indexOf(`--${name}`); return i >= 0 ? flags[i + 1] : undefined; };
const [domainId, ...words] = positional;
const domains = JSON.parse(readFileSync(join(root, 'brain/domains.json'), 'utf8')).domains;
const cliAvailable = (binary) => {
  const suffixes = process.platform === 'win32' ? ['', '.exe', '.cmd', '.ps1'] : [''];
  return (process.env.PATH ?? process.env.Path ?? '').split(delimiter)
    .some(directory => suffixes.some(suffix => existsSync(join(directory, `${binary}${suffix}`))));
};
const domain = domains.find((item) => item.id === domainId);
if (!domain || !words.length) {
  console.error(`usage: node scripts/recommend-resources.mjs <${domains.map((d) => d.id).join('|')}> <task words> [--tags a,b] [--project <slug>]`);
  process.exitCode = 2;
} else {
  const resources = JSON.parse(readFileSync(join(root, 'brain/resources.json'), 'utf8')).resources;
  const tools = JSON.parse(readFileSync(join(root, 'brain/tools.json'), 'utf8')).tools;
  const ownerEnabled = JSON.parse(readFileSync(join(root, 'brain/tool-enable.json'), 'utf8')).enabled;
  const dotenvText = existsSync(join(root, '.env')) ? readFileSync(join(root, '.env'), 'utf8') : '';
  const availableTools = new Set(tools.filter(tool => {
    if (!tool.agents.some(agent => domain.agents.includes(agent))) return false;
    if (tool.enabled_if === 'always') return true;
    if (tool.enabled_if?.startsWith('cli:')) {
      const binary = tool.enabled_if.slice(4);
      return cliAvailable(binary);
    }
    if (tool.enabled_if === 'user:enable') return tool.id in ownerEnabled;
    if (tool.enabled_if?.startsWith('env:')) return Boolean(readKey(tool.enabled_if.slice(4), { dotenvText })); // key present, value never read out
    return false; // MCP tools need per-run verification (logins).
  }).map(tool => tool.id));
  const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === 'win32' ? 'D:\\UiBuildProj' : join(dirname(root), 'UiBuildProj'));
  const slug = flag('project');
  const plan = slug ? loadPlan(join(projectsRoot, slug)) : null;
  const tags = [...(flag('tags') ?? '').split(','), ...(plan?.tags ?? [])].map((tag) => tag.trim()).filter(Boolean);
  console.log(JSON.stringify(recommend(resources, domain, words.join(' '), {
    availableTools, config: loadActiveRouterConfig(root), taxonomy: JSON.parse(readFileSync(join(root, 'brain/taxonomy.json'), 'utf8')).alias,
    controls: loadControls(root).resources, context: { tags }, plan,
  }), null, 2));
}
