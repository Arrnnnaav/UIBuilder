// Shared loaders and checks for brain/agent-budget.json, .claude/agents/*.md and brain/tools.json.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const MODELS = new Set(['opus', 'sonnet', 'haiku']);
export const estimateTokens = (text) => Math.round(text.length / 4);
const read = (root, rel) => readFileSync(join(root, rel), 'utf8');

export function loadBudget(root) {
  return JSON.parse(read(root, 'brain/agent-budget.json'));
}

export function loadAgents(root) {
  const dir = join(root, '.claude', 'agents');
  return readdirSync(dir).filter((file) => file.endsWith('.md')).map((file) => {
    const text = readFileSync(join(dir, file), 'utf8');
    const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const field = (key) => front.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim();
    return { name: file.replace(/\.md$/, ''), text, model: field('model'), tools: (field('tools') ?? '').split(',').map((t) => t.trim()).filter(Boolean) };
  });
}

const skillPath = (root, name) => join(root, '.claude', 'skills', name, 'SKILL.md');

// Startup token estimate per agent and mode, from the budget file. Returns rows and errors.
export function contextBudget(root) {
  const budget = loadBudget(root);
  const agents = loadAgents(root);
  const errors = [];
  const always = budget.always_loaded.reduce((sum, file) => sum + estimateTokens(read(root, file)), 0);
  // A load entry is a project skill name, or `file:<repo path>` for a playbook loaded as plain text.
  // Skills without a redistributable license are git-ignored, so a fresh checkout lacks them. Their declared
  // size (budget.local_only_skills) is used only when the folder is absent; anything else missing is an error.
  const skillTokens = (name) => {
    const file = name.startsWith('file:') ? join(root, name.slice(5)) : skillPath(root, name);
    if (!existsSync(file) && budget.local_only_skills?.[name] !== undefined) return budget.local_only_skills[name];
    if (!existsSync(file)) { errors.push(`load "${name}" not found at ${file.replace(root, '.')}`); return 0; }
    return estimateTokens(readFileSync(file, 'utf8'));
  };
  const rows = [];
  const known = new Set(Object.keys(budget.agents));
  for (const agent of agents) if (!known.has(agent.name)) errors.push(`agents/${agent.name}.md: not in brain/agent-budget.json`);
  for (const name of known) if (!agents.some((agent) => agent.name === name)) errors.push(`agent-budget.json: "${name}" has no .claude/agents/${name}.md`);
  // Names to look for in agent files: skills on disk plus git-ignored local-only ones that a fresh checkout lacks.
  const skillDirs = [...new Set([...(existsSync(join(root, '.claude', 'skills')) ? readdirSync(join(root, '.claude', 'skills')) : []), ...Object.keys(budget.local_only_skills ?? {})])];
  for (const agent of agents) {
    const entry = budget.agents[agent.name];
    if (!entry) continue;
    const modes = Array.isArray(entry.load) ? { default: entry.load } : entry.load;
    const budgeted = new Set([...Object.values(modes).flat(), ...(entry.on_demand ?? [])]);
    for (const dir of skillDirs) {
      if (new RegExp(`(^|[^a-z-])${dir}([^a-z-]|$)`).test(agent.text) && !budgeted.has(dir)) {
        errors.push(`agents/${agent.name}.md mentions skill "${dir}" that is not in its load/on_demand budget`);
      }
    }
    for (const name of entry.on_demand ?? []) skillTokens(name);
    for (const [mode, skills] of Object.entries(modes)) {
      const tokens = always + estimateTokens(agent.text) + skills.reduce((sum, skill) => sum + skillTokens(skill), 0);
      const cap = entry.cap_tokens_by_mode?.[mode] ?? entry.cap_tokens ?? budget.default_cap_tokens;
      if (tokens > cap) errors.push(`${agent.name}${mode === 'default' ? '' : `:${mode}`}: ${tokens} tokens exceeds cap ${cap}`);
      rows.push({ agent: agent.name, mode, model: entry.model, tokens, cap, load: skills, on_demand: entry.on_demand ?? [] });
    }
  }
  return { always_tokens: always, rows, errors };
}

// Model tier consistency and frontmatter tools versus the tool router.
export function validateAgents(root) {
  const budget = loadBudget(root);
  const router = JSON.parse(read(root, 'brain/tools.json')).tools;
  const errors = [];
  for (const agent of loadAgents(root)) {
    const entry = budget.agents[agent.name];
    if (!entry) { errors.push(`agents/${agent.name}.md: not in brain/agent-budget.json`); continue; }
    if (!MODELS.has(entry.model)) errors.push(`agent-budget.json ${agent.name}: model must be ${[...MODELS].join('|')}`);
    if (!entry.reason || entry.reason.length < 15) errors.push(`agent-budget.json ${agent.name}: model tier needs a reason`);
    if (agent.model !== entry.model) errors.push(`agents/${agent.name}.md: model "${agent.model ?? 'unset'}" != budget "${entry.model}"`);
    for (const tool of agent.tools) {
      if (budget.builtin_tools.includes(tool)) continue;
      const key = Object.keys(budget.claude_tool_map).find((prefix) => tool === prefix || tool.startsWith(prefix));
      if (!key) { errors.push(`agents/${agent.name}.md: tool "${tool}" has no router mapping in agent-budget.json claude_tool_map`); continue; }
      const routed = router.find((item) => item.id === budget.claude_tool_map[key]);
      if (!routed) errors.push(`agents/${agent.name}.md: tool "${tool}" maps to unknown router id "${budget.claude_tool_map[key]}"`);
      else if (!routed.agents.includes(agent.name)) errors.push(`agents/${agent.name}.md: tool "${tool}" needs "${agent.name}" in brain/tools.json ${routed.id}.agents`);
    }
  }
  return errors;
}
