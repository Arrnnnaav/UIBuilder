#!/usr/bin/env node
// Generate one video clip through Runway Dev or the Gemini API. DRY RUN unless --run is given.
//   node scripts/media-generate.mjs --provider runway --model veo3.1_fast --first a.png [--last b.png] \
//     --prompt "..." --seconds 4 --ratio 1280:720 --out clip.mp4 [--resolution 720p] [--audio]
//   add:  --run --approve-credits 40      (Runway)   or   --run --approve-usd 0.4   (Gemini)
// Jobs over 100 credits also need --owner-approved-over-cap. Keys come from the environment or the ignored root .env.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUNWAY_BASE, RUNWAY_VERSION, appendLedger, checkSpend, estimateCost, readImage, readKey, runGemini, runRunway, validateJob } from './lib/media-providers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const num = (name) => (value(name) === undefined ? undefined : Number(value(name)));
const die = (message, code = 2) => { console.error(message); process.exit(code); };

const dotenvText = existsSync(join(root, '.env')) ? readFileSync(join(root, '.env'), 'utf8') : '';
const provider = value('provider');
const promptFile = value('prompt-file');
const job = {
  provider, model: value('model'),
  prompt: promptFile ? readFileSync(resolve(promptFile), 'utf8').trim() : value('prompt'),
  firstFrame: value('first'), lastFrame: value('last'),
  seconds: num('seconds'), ratio: value('ratio'), resolution: value('resolution') ?? '720p',
  audio: flag('audio'), seed: num('seed'),
};
const out = value('out');
if (!provider || !job.model || !out) die('usage: node scripts/media-generate.mjs --provider <runway|gemini> --model <id> --first <img> [--last <img>] --prompt "<text>" --seconds <n> --ratio <w:h> --out <file.mp4> [--resolution 720p] [--audio] [--run --approve-credits N | --approve-usd N] [--owner-approved-over-cap] [--ledger <path>]');

try { validateJob(job); } catch (error) { die(`invalid job: ${error.message}`); }
const estimate = estimateCost(job);
const keyName = provider === 'runway' ? 'RUNWAYML_API_SECRET' : 'GEMINI_API_KEY';
const key = readKey(keyName, { dotenvText });

const balance = async () => {
  if (provider !== 'runway' || !key) return undefined;
  const response = await fetch(`${RUNWAY_BASE}/v1/organization`, { headers: { Authorization: `Bearer ${key}`, 'X-Runway-Version': RUNWAY_VERSION } });
  return response.ok ? (await response.json()).creditBalance : undefined;
};

const before = await balance();
console.log(JSON.stringify({
  mode: flag('run') ? 'run' : 'dry-run', provider, model: job.model, seconds: job.seconds, resolution: job.resolution, ratio: job.ratio,
  first: job.firstFrame, last: job.lastFrame ?? null, out, key_present: Boolean(key), key_name: keyName,
  estimate, balance_credits: before ?? null,
}, null, 2));

if (!flag('run')) { console.log('\nDry run only: nothing was sent and nothing was spent.'); process.exit(0); }
if (!key) die(`${keyName} is not set (put it in the ignored root .env)`);
const guard = checkSpend({ estimate, approvedCredits: num('approve-credits'), approvedUsd: num('approve-usd'), balanceCredits: before, overCap: flag('owner-approved-over-cap') });
if (!guard.ok) die(`refused: ${guard.reason}`, 3);

const images = { first: readImage(resolve(job.firstFrame)), last: job.lastFrame ? readImage(resolve(job.lastFrame)) : undefined };
const result = await (provider === 'runway' ? runRunway : runGemini)(job, images, { key });
mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(resolve(out), result.bytes);
const after = await balance();
appendLedger(resolve(value('ledger') ?? join(dirname(resolve(out)), 'MEDIA_LEDGER.md')), {
  date: new Date().toISOString().slice(0, 10), job, estimate, taskId: result.taskId, out: out.split(/[\\/]/).pop(), bytes: result.bytes,
  notes: before !== undefined && after !== undefined ? `balance ${before} -> ${after} credits` : '',
});
console.log(JSON.stringify({ saved: resolve(out), bytes: result.bytes.length, task: result.taskId, balance_before: before ?? null, balance_after: after ?? null, credits_spent: before !== undefined && after !== undefined ? before - after : null }, null, 2));
