#!/usr/bin/env node
// Inspect/install only task-relevant skills/tools from the pinned, reviewed catalog.
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const install = args.includes('--install');
const taskIndex = args.indexOf('--task');
const projectIndex = args.indexOf('--project');
const task = taskIndex >= 0 ? args[taskIndex + 1] : null;
const project = resolve(projectIndex >= 0 ? args[projectIndex + 1] : process.cwd());
const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const home = resolve(process.env.UIBUILDER_BOOTSTRAP_HOME || homedir());
const manifestPath = existsSync(join(scriptRoot, 'brain', 'agent-bootstrap.json'))
  ? join(scriptRoot, 'brain', 'agent-bootstrap.json')
  : join(project, 'docs', 'AGENT_BOOTSTRAP.json');

function fail(message) { console.error(`agent-bootstrap: ${message}`); process.exit(2); }
if (args.some((arg, i) => arg.startsWith('--') && !['--install', '--task', '--project'].includes(arg)) ||
    taskIndex < 0 || !task || (projectIndex >= 0 && !args[projectIndex + 1]))
  fail('usage: node scripts/agent-bootstrap.mjs --task <frontend|website|full-site|visual-research|browser|video|review> [--install] [--project PATH]');
if (!existsSync(manifestPath)) fail(`bootstrap catalog not found: ${manifestPath}`);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const validTasks = new Set(manifest.skills.flatMap((item) => item.tasks).concat(manifest.tools.flatMap((item) => item.tasks)));
if (!validTasks.has(task)) fail(`unknown task ${task}; choose ${[...validTasks].sort().join(', ')}`);

const projectSkillRoots = [join(project, '.agents', 'skills'), join(project, '.claude', 'skills')];
const globalSkillRoots = [join(process.env.CODEX_HOME || join(home, '.codex'), 'skills'), join(home, '.agents', 'skills'),
  join(process.env.CLAUDE_CONFIG_DIR || join(home, '.claude'), 'skills')];
const skillRoots = [...projectSkillRoots, ...globalSkillRoots];
const hostDirs = { codex: [join(project, '.agents', 'skills'), ...globalSkillRoots.slice(0, 2)],
  'claude-code': [join(project, '.claude', 'skills'), globalSkillRoots[2]] };
const selectedSkills = manifest.skills.filter((item) => item.tasks.includes(task));
const selectedTools = manifest.tools.filter((item) => item.tasks.includes(task));
const commandExists = (command) => {
  const isWin = process.platform === 'win32';
  const probe = spawnSync(isWin ? 'where.exe' : 'which', [command], { encoding: 'utf8', windowsHide: true });
  return probe.status === 0;
};
const run = (command, commandArgs) => spawnSync(command, commandArgs, {
  cwd: project, stdio: 'inherit', windowsHide: true, shell: process.platform === 'win32',
});
const skillIsInstalled = (skill, agent) => {
  const roots = hostDirs[agent] ?? [];
  return roots.map((base) => join(base, skill.id, 'SKILL.md')).find(existsSync) ?? null;
};
const skillStatus = [];
for (const skill of selectedSkills) {
  const hosts = Object.entries(hostDirs).map(([agent, roots]) => {
    const path = skillIsInstalled(skill, agent);
    return { agent, installed: Boolean(path), path };
  });
  const missingAgents = hosts.filter((host) => !host.installed).map((host) => host.agent);
  skillStatus.push({ id: skill.id, purpose: skill.purpose, license: skill.license, installed_for: hosts.filter((h) => h.installed).map((h) => h.agent),
    missing_for: missingAgents, installable: skill.auto_install, source: skill.source });
  if (install && missingAgents.length && skill.auto_install) {
    const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const agentFlags = missingAgents.flatMap((agent) => ['--agent', agent]);
    const result = run(npx, ['--yes', `skills@${manifest.installer.version}`, 'add', skill.source, '--skill', skill.id,
      '--global', ...agentFlags, '--copy', '--yes']);
    if (result.status !== 0) fail(`install failed for ${skill.id}; use source link and command in docs/AGENT_BOOTSTRAP.md`);
  }
}

const toolStatus = [];
for (const tool of selectedTools) {
  const present = commandExists(tool.command);
  toolStatus.push({ id: tool.id, present, command: tool.command, auto_install: tool.auto_install,
    fallback: present ? null : tool.fallback });
  if (install && !present && tool.auto_install && tool.install) {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    if (run(npm, tool.install.slice(1)).status !== 0) fail(`install failed for ${tool.id}`);
    if (tool.post_install && run(tool.post_install[0], tool.post_install.slice(1)).status !== 0) fail(`post-install failed for ${tool.id}`);
  }
}

const remaining = skillStatus.filter((item) => item.missing_for.length && item.installable);
// Recheck after installation so the result describes the environment, not just the initial scan.
if (install) {
  for (const status of skillStatus) {
    const skill = selectedSkills.find((item) => item.id === status.id);
    const hosts = Object.entries(hostDirs).map(([agent]) => {
      const path = skillIsInstalled(skill, agent);
      return { agent, installed: Boolean(path), path };
    });
    status.installed_for = hosts.filter((host) => host.installed).map((host) => host.agent);
    status.missing_for = hosts.filter((host) => !host.installed).map((host) => host.agent);
  }
  for (const status of toolStatus) {
    status.present = commandExists(status.command);
    status.fallback = status.present ? null : selectedTools.find((item) => item.id === status.id)?.fallback ?? null;
  }
}
const stillMissingRequired = skillStatus.filter((status) => status.installed_for.length === 0 &&
  selectedSkills.find((item) => item.id === status.id)?.required === true);
const skillsPending = remaining.filter((item) => skillStatus.find((status) => status.id === item.id)?.missing_for.length).map((item) => item.id);
const toolsPending = toolStatus.filter((status) => !status.present && status.auto_install).map((status) => status.id);
const report = { task, project, mode: install ? 'install' : 'check', skills: skillStatus, tools: toolStatus,
  manual_review: manifest.manual_review,
  install_actions_required: install ? { skills: skillsPending, tools: toolsPending } : [],
  required_missing: stillMissingRequired.map((item) => item.id),
  parity_missing: skillStatus.filter((status) => status.installed_for.length && status.missing_for.length).map((status) => ({ id: status.id, missing_for: status.missing_for })),
  note: 'Only missing, task-relevant, pinned allowlisted items are eligible. Existing skill folders are never overwritten. Optional, unlicensed or paid services require owner review.' };
console.log(JSON.stringify(report, null, 2));
if (stillMissingRequired.length) process.exitCode = 1;
