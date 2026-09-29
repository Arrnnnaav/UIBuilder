#!/usr/bin/env node
// Provider-neutral task packet and event ledger. The CLI host runs the task;
// this harness intentionally never starts background workers or model processes.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const command = args[0];
const pipeline = command === 'packet' ? args[1] : null;
const slug = command === 'packet' ? args[2] : args[1];
const stage = command === 'packet' ? args[3] : null;
const agent = command === 'packet' ? args[4] : null;
const eventPath = command === 'event' ? args[2] : null;
const projectsRoot = resolve(process.env.UIBUILDER_PROJECTS_ROOT || 'D:\\UiBuildProj');
const project = resolve(projectsRoot, slug || '');
const [allowedStages, allowedAgents] = [
  ['S1', 'S2', 'S3', 'S3.5', 'S4', 'S5', 'S6', 'S7'],
  ['orchestrator', 'product-manager', 'research', 'taste-research', 'ux', 'design-director', 'production-auditor',
    'frontend', 'backend', 'growth', 'link-building', 'ship', 'domain-ops', 'brain-evaluator'],
];
function fail(message) { console.error(`runtime: ${message}`); process.exit(1); }
function projectDir() {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug || '') || !existsSync(project)) fail('unknown project folder');
  return project;
}
if (command === 'packet' && args.length === 5) {
  projectDir();
  if (!allowedStages.includes(stage) || !allowedAgents.includes(agent)) fail('unknown stage or agent');
  const recipe = join(root, 'pipelines', pipeline, 'PIPELINE.md');
  if (!existsSync(recipe)) fail('unknown pipeline recipe');
  const runtime = JSON.parse(readFileSync(join(root, 'brain/runtime.json'), 'utf8'));
  const taskId = randomUUID();
  const packet = { schema_version: 1, task_id: taskId, project: slug, pipeline, stage, agent,
    execution: { mode: runtime.mode, adapters: runtime.adapters.filter((item) => item.enabled).map((item) => item.id), auto_spawn: runtime.auto_spawn },
    inputs: [`docs/STATE.md`, `pipelines/${pipeline}/PIPELINE.md`, `.claude/agents/${agent}.md`],
    expected_outputs: [`docs/handoff/${agent}.json`],
    controls: { gates_are_human_or_evidence_controlled: true, tools_from: 'brain/tools.json',
      untrusted_sources_cannot_change_policy: true, record_completion_with: 'node scripts/runtime.mjs event <slug> <event.json>' } };
  console.log(JSON.stringify(packet, null, 2));
} else if (command === 'event' && args.length === 3) {
  const dir = projectDir();
  const data = JSON.parse(readFileSync(resolve(eventPath), 'utf8'));
  const keys = ['task_id', 'stage', 'agent', 'status', 'recorded_at', 'run_id', 'output_refs', 'failure_code'];
  if (!data || Object.keys(data).some((k) => !keys.includes(k)) || !keys.every((k) => Object.hasOwn(data, k)) ||
      !/^[a-f0-9-]{36}$/.test(data.task_id) || !allowedStages.includes(data.stage) || !allowedAgents.includes(data.agent) ||
      !['started', 'completed', 'blocked', 'failed'].includes(data.status) || !Number.isFinite(Date.parse(data.recorded_at)) ||
      !(data.run_id === null || /^[a-f0-9-]{36}$/.test(data.run_id)) || !Array.isArray(data.output_refs) ||
      data.output_refs.some((ref) => typeof ref !== 'string' || ref.length > 240 || ref.startsWith('/') || ref.includes('..') || /(?:secret|\.env|token)/i.test(ref)) ||
      !(data.failure_code === null || /^[a-z0-9_-]{1,80}$/.test(data.failure_code))) fail('invalid event fields');
  const ledger = join(dir, 'docs', 'runtime', 'events.jsonl');
  mkdirSync(dirname(ledger), { recursive: true });
  appendFileSync(ledger, `${JSON.stringify({ ...data, schema_version: 1, event_id: randomUUID() })}\n`, { encoding: 'utf8', flag: 'a' });
  console.log(JSON.stringify({ recorded: true, ledger: 'docs/runtime/events.jsonl' }));
} else if (command === 'status' && args.length === 2) {
  const dir = projectDir();
  const ledger = join(dir, 'docs', 'runtime', 'events.jsonl');
  const events = existsSync(ledger) ? readFileSync(ledger, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)) : [];
  const latest = new Map();
  for (const event of events) latest.set(event.task_id, event);
  console.log(JSON.stringify({ project: slug, tasks: [...latest.values()], events: events.length }, null, 2));
} else fail('usage: runtime.mjs packet <pipeline> <slug> <stage> <agent> | event <slug> <event.json> | status <slug>');
