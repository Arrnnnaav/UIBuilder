#!/usr/bin/env node
// Owner decisions about Brain resources. Run by the owner (or by an agent only on the owner's explicit instruction);
// the dashboard uses the same library. Every change is appended to brain/owner-decisions.jsonl.
//   node scripts/owner.mjs set <id> boost <-3..5>                       [--reason "..."]
//   node scripts/owner.mjs set <id> pin_for|avoid_for|tags a,b,c        (empty value clears)
//   node scripts/owner.mjs set <id> banned true|false                   --reason "..."
//   node scripts/owner.mjs set <id> trust APPROVED                      --reason "..." [--ack-caution]
//   node scripts/owner.mjs set <id> rights cleared|override|none        --reason "..." [--ack-caution]
//   node scripts/owner.mjs show <id>      node scripts/owner.mjs log [n]
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadControls, logPath, saveChange } from './lib/owner-controls.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const positional = args.filter((arg, i) => !arg.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--ack-caution'));
const [command, id, field, ...rest] = positional;
const die = (message) => { console.error(message); process.exit(2); };

try {
  if (command === 'set' && id && field) {
    let value = rest.join(' ');
    if (field === 'rights') {
      value = { none: null, cleared: { cleared: true }, override: { cleared: true, override_restriction: true } }[value];
      if (value === undefined) die('rights value must be cleared, override or none');
    }
    const entry = saveChange(root, { resource: id, field, value, reason: flag('reason'), acknowledge_caution: args.includes('--ack-caution') }, { by: flag('by') ?? 'owner-cli' });
    console.log(JSON.stringify(entry, null, 2));
  } else if (command === 'show' && id) {
    console.log(JSON.stringify(loadControls(root).resources[id] ?? {}, null, 2));
  } else if (command === 'log') {
    const lines = existsSync(logPath(root)) ? readFileSync(logPath(root), 'utf8').split(/\r?\n/).filter(Boolean) : [];
    console.log(lines.slice(-Number(id ?? 20)).join('\n'));
  } else {
    die('usage: node scripts/owner.mjs set <id> <boost|pin_for|avoid_for|tags|banned|trust|rights> <value> [--reason "..."] [--ack-caution] | show <id> | log [n]');
  }
} catch (error) {
  die(`refused: ${error.message}`);
}
