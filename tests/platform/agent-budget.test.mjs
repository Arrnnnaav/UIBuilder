import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contextBudget, validateAgents } from '../../scripts/lib/agent-budget.mjs';

const source = fileURLToPath(new URL('../..', import.meta.url));

const fixture = (t) => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-budget-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'brain'), { recursive: true });
  for (const file of ['CLAUDE.md', 'AGENTS.md', 'brain/agent-budget.json', 'brain/tools.json']) cpSync(join(source, file), join(root, file));
  cpSync(join(source, 'brain/playbooks'), join(root, 'brain/playbooks'), { recursive: true });
  cpSync(join(source, '.claude/agents'), join(root, '.claude/agents'), { recursive: true });
  cpSync(join(source, '.claude/skills'), join(root, '.claude/skills'), { recursive: true });
  return root;
};
const edit = (root, file, change) => {
  const path = join(root, file);
  const value = JSON.parse(readFileSync(path, 'utf8'));
  change(value);
  writeFileSync(path, JSON.stringify(value, null, 2));
};

test('repository budget, model tiers and tool routing are consistent', () => {
  assert.deepEqual(contextBudget(source).errors, []);
  assert.deepEqual(validateAgents(source), []);
});

test('a cap breach is reported', (t) => {
  const root = fixture(t);
  edit(root, 'brain/agent-budget.json', (b) => { b.agents.frontend.cap_tokens = 100; });
  assert.match(contextBudget(root).errors.join('\n'), /frontend: \d+ tokens exceeds cap 100/);
});

test('an agent mentioning a skill outside its budget is reported', (t) => {
  const root = fixture(t);
  edit(root, 'brain/agent-budget.json', (b) => { b.agents.frontend.on_demand = []; });
  assert.match(contextBudget(root).errors.join('\n'), /frontend\.md mentions skill "website-to-code"/);
});

test('git-ignored local-only skills use their declared size on a fresh checkout, other missing skills still fail', (t) => {
  const root = fixture(t);
  for (const name of ['web-design-guidelines', 'website-to-code', 'monid']) rmSync(join(root, '.claude/skills', name), { recursive: true, force: true });
  assert.deepEqual(contextBudget(root).errors, []);
  rmSync(join(root, '.claude/skills/taste-skill'), { recursive: true, force: true });
  assert.match(contextBudget(root).errors.join('\n'), /taste-skill/);
});

test('a missing on-demand skill or playbook file is reported', (t) => {
  const root = fixture(t);
  edit(root, 'brain/agent-budget.json', (b) => { b.agents.frontend.on_demand.push('file:brain/playbooks/nope.md', 'no-such-skill'); });
  const errors = contextBudget(root).errors.join('\n');
  assert.match(errors, /nope\.md/);
  assert.match(errors, /no-such-skill/);
});

test('frontmatter model must match the tier and a router-mapped tool must allow the agent', (t) => {
  const root = fixture(t);
  edit(root, 'brain/agent-budget.json', (b) => { b.agents.ux.model = 'opus'; });
  edit(root, 'brain/tools.json', (b) => { const tool = b.tools.find((item) => item.id === 'web_search'); tool.agents = tool.agents.filter((agent) => agent !== 'growth'); });
  const errors = validateAgents(root).join('\n');
  assert.match(errors, /ux\.md: model "sonnet" != budget "opus"/);
  assert.match(errors, /growth\.md: tool "WebSearch" needs "growth"/);
});
