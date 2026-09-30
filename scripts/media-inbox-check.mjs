#!/usr/bin/env node
// Verify a clip returned from a manual studio against its request card.
//   node scripts/media-inbox-check.mjs <clip.mp4> [--first img] [--last img] [--seconds n] [--ratio 16:9] [--min-height 720] [--tolerance 10]
// Needs ffmpeg and ffprobe. Exit 1 when a check fails. Read-only; nothing is uploaded.
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { evaluateClip, meanAbsDiffPercent, parseProbe } from './lib/media-inbox.mjs';

const args = process.argv.slice(2);
const clip = args[0];
const value = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
if (!clip || clip.startsWith('--')) { console.error('usage: node scripts/media-inbox-check.mjs <clip.mp4> [--first img] [--last img] [--seconds n] [--ratio 16:9] [--min-height 720] [--tolerance 10]'); process.exit(2); }
const path = resolve(clip);
if (!existsSync(path)) { console.error(`${path} not found. Save the download as the card says, then re-run.`); process.exit(2); }

const run = (cmd, argv, opts = {}) => spawnSync(cmd, argv, { encoding: opts.binary ? 'buffer' : 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
const probe = run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', path]);
if (probe.status !== 0) { console.error('ffprobe could not read the file (is it a real video, and is ffprobe installed?)'); process.exit(2); }
const info = parseProbe(JSON.parse(probe.stdout), statSync(path).size);

const thumb = (file, fromEnd) => {
  const seek = fromEnd ? ['-sseof', '-0.15'] : [];
  const out = run('ffmpeg', ['-v', 'error', ...seek, '-i', file, '-vf', 'scale=32:18:flags=area', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { binary: true });
  if (out.status !== 0 || !out.stdout?.length) throw new Error(`could not read a frame from ${file}`);
  return out.stdout;
};
const expect = { ratio: value('ratio'), seconds: value('seconds') === undefined ? undefined : Number(value('seconds')), minHeight: value('min-height') === undefined ? undefined : Number(value('min-height')), tolerance: value('tolerance') === undefined ? undefined : Number(value('tolerance')) };
try {
  if (value('first')) expect.first = meanAbsDiffPercent(thumb(path, false), thumb(resolve(value('first')), false));
  if (value('last')) expect.last = meanAbsDiffPercent(thumb(path, true), thumb(resolve(value('last')), false));
} catch (error) { console.error(error.message); process.exit(2); }

const { problems, notes } = evaluateClip(info, expect);
console.log(JSON.stringify({ file: path, ...info, first_frame_diff_percent: expect.first ?? null, last_frame_diff_percent: expect.last ?? null, problems, notes, verdict: problems.length ? 'fail' : 'pass' }, null, 2));
process.exit(problems.length ? 1 : 0);
