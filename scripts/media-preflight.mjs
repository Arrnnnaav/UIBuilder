#!/usr/bin/env node
process.noDeprecation = true;
// Non-mutating check before paid media work (scroll-world stills and video chain, launch video).
//   node scripts/media-preflight.mjs [--require stills,video_chain,encode]
// Prints booleans and next steps only; never prints keys, balances or account names.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assess, monidHasKey } from './lib/media-preflight.mjs';
import { readKey } from './lib/media-providers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const probe = (command, args, timeout = 20000) => {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout, shell: process.platform === 'win32', windowsHide: true });
  return { installed: !result.error && result.status !== 127 && !/is not recognized|not found/i.test(`${result.stderr}`), ok: result.status === 0, output: `${result.stdout}${result.stderr}` };
};

const ffmpeg = probe('ffmpeg', ['-version']);
const ffprobe = probe('ffprobe', ['-version']);
const higgs = probe('higgsfield', ['--version']);
const higgsAuth = higgs.installed ? probe('higgsfield', ['workspace', 'list']) : { ok: false };
const monid = probe('monid', ['--version']);
const monidKeys = monid.installed ? probe('monid', ['keys', 'list']) : { ok: false, output: '' };
const codex = probe('codex', ['--version']);
const codexLogin = codex.installed ? probe('codex', ['login', 'status']) : { ok: false, output: '' };

const dotenvText = existsSync(join(root, '.env')) ? readFileSync(join(root, '.env'), 'utf8') : '';
const hasKey = (name) => Boolean(readKey(name, { dotenvText }));
const report = assess({
  keys: { runway: hasKey('RUNWAYML_API_SECRET'), gemini: hasKey('GEMINI_API_KEY'), fal: hasKey('FAL_KEY'), nvidia: hasKey('NVIDIA_API_KEY') },
  ffmpeg: ffmpeg.ok, ffprobe: ffprobe.ok,
  higgsfield: { installed: higgs.installed && higgs.ok, authed: higgsAuth.ok },
  monid: { installed: monid.installed && monid.ok, has_key: monidHasKey(monidKeys.ok, monidKeys.output) },
  codex: { installed: codex.installed && codex.ok, logged_in: codexLogin.ok && /logged in|chatgpt/i.test(codexLogin.output) },
});
console.log(JSON.stringify(report, null, 2));
const required = (process.argv.find((arg) => arg.startsWith('--require='))?.slice(10) ?? (process.argv.includes('--require') ? process.argv[process.argv.indexOf('--require') + 1] : '')).split(',').filter(Boolean);
const missing = required.filter((name) => !report.can[name]);
if (missing.length) { console.error(`not ready: ${missing.join(', ')}`); process.exit(1); }
