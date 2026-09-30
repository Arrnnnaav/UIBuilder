// Paid video generation adapters (Runway Dev API, Gemini API Veo) with cost estimates and a spend guard.
// Request shapes come from the official SDK types read on 2026-09-30 (@runwayml/sdk 4.20.1, @google/genai 2.24.0).
// Nothing here spends money by itself: scripts/media-generate.mjs defaults to a dry run.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, extname } from 'node:path';

export const RUNWAY_BASE = 'https://api.dev.runwayml.com';
export const RUNWAY_VERSION = '2024-11-06';
export const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const CREDIT_USD = 0.01;
export const DEFAULT_CAP_CREDITS = 100;

const MINI_RATIOS = ['992:432', '864:496', '752:560', '640:640', '560:752', '496:864', '1470:630', '1280:720', '1112:834', '960:960', '834:1112', '720:1280'];
const VEO_RATIOS = ['1280:720', '720:1280', '1080:1920', '1920:1080'];

// Runway credits per second (docs.dev.runwayml.com/guides/pricing, 2026-09-30). null means no published price, so refuse.
export const RUNWAY_MODELS = {
  seedance2_mini: { resolutions: ['480p', '720p'], ratios: MINI_RATIOS, maxPrompt: 3500, min: 64, rate: () => 16 },
  seedance2_fast: { resolutions: ['480p', '720p'], ratios: null, maxPrompt: 3500, min: 0, rate: () => 29 },
  seedance2: { resolutions: ['480p', '720p', '1080p'], ratios: null, maxPrompt: 3500, min: 0, rate: (res) => (res === '1080p' ? 40 : 36) },
  'veo3.1_fast': { resolutions: ['720p', '1080p'], ratios: VEO_RATIOS, durations: [4, 6, 8], maxPrompt: 1000, min: 0, rate: (_res, audio) => (audio ? 15 : 10), audioParam: true },
  'veo3.1': { resolutions: ['720p', '1080p'], ratios: VEO_RATIOS, durations: [4, 6, 8], maxPrompt: 1000, min: 0, rate: (_res, audio) => (audio ? 40 : 20), audioParam: true },
};

// Gemini API USD per second (ai.google.dev/gemini-api/docs/pricing, 2026-09-30), audio included by default.
// lastFrame is documented for Veo 3.1 and Fast; the Lite column was not confirmed, so it is refused.
export const GEMINI_MODELS = {
  'veo-3.1-lite-generate-preview': { usd: { '720p': 0.05, '1080p': 0.08 }, keyframes: false },
  'veo-3.1-fast-generate-preview': { usd: { '720p': 0.10, '1080p': 0.12, '4k': 0.30 }, keyframes: true },
  'veo-3.1-generate-preview': { usd: { '720p': 0.40, '1080p': 0.40, '4k': 0.60 }, keyframes: true },
};

const fail = (message) => { throw new Error(message); };

export function estimateCost(job) {
  const seconds = job.seconds;
  if (job.provider === 'runway') {
    const spec = RUNWAY_MODELS[job.model] ?? fail(`unknown Runway model "${job.model}"; supported: ${Object.keys(RUNWAY_MODELS).join(', ')}`);
    const credits = Math.max(spec.min, seconds * spec.rate(job.resolution, Boolean(job.audio)));
    return { credits, usd: round(credits * CREDIT_USD), basis: `${spec.rate(job.resolution, Boolean(job.audio))} credits/s x ${seconds}s${spec.min > credits - 1e-9 && seconds * spec.rate() < spec.min ? ` (minimum ${spec.min})` : ''}` };
  }
  if (job.provider === 'gemini') {
    const spec = GEMINI_MODELS[job.model] ?? fail(`unknown Gemini model "${job.model}"; supported: ${Object.keys(GEMINI_MODELS).join(', ')}`);
    const rate = spec.usd[job.resolution] ?? fail(`${job.model} has no ${job.resolution} price`);
    return { credits: null, usd: round(rate * seconds), basis: `$${rate}/s x ${seconds}s` };
  }
  return fail(`unknown provider "${job.provider}" (runway | gemini)`);
}
const round = (n) => Math.round(n * 10000) / 10000;

export function validateJob(job) {
  if (!['runway', 'gemini'].includes(job.provider)) fail(`unknown provider "${job.provider}" (runway | gemini)`);
  if (!job.prompt || !String(job.prompt).trim()) fail('prompt is required');
  if (!Number.isFinite(job.seconds) || job.seconds <= 0) fail('seconds must be a positive number (auto is not allowed: it bills the maximum up front)');
  if (job.lastFrame && !job.firstFrame) fail('a last frame needs a first frame (last-frame-only is not supported)');
  if (job.provider === 'runway') {
    const spec = RUNWAY_MODELS[job.model] ?? fail(`unknown Runway model "${job.model}"; supported: ${Object.keys(RUNWAY_MODELS).join(', ')}`);
    if (!job.firstFrame) fail('Runway image_to_video needs --first (a first-frame image)');
    if (!spec.resolutions.includes(job.resolution)) fail(`${job.model} has no published price for ${job.resolution}; use ${spec.resolutions.join(' or ')}`);
    if (spec.durations && !spec.durations.includes(job.seconds)) fail(`${job.model} accepts ${spec.durations.join(', ')} seconds`);
    if (spec.ratios && !spec.ratios.includes(job.ratio)) fail(`${job.model} ratio must be one of ${spec.ratios.join(', ')}`);
    if (job.ratio && !/^\d+:\d+$/.test(job.ratio)) fail('ratio must look like 1280:720');
    if (String(job.prompt).length > spec.maxPrompt) fail(`prompt is ${String(job.prompt).length} characters; ${job.model} allows ${spec.maxPrompt}`);
    if (job.audio && !spec.audioParam && !job.model.startsWith('seedance')) fail(`${job.model} does not take an audio flag`);
  } else {
    const spec = GEMINI_MODELS[job.model] ?? fail(`unknown Gemini model "${job.model}"; supported: ${Object.keys(GEMINI_MODELS).join(', ')}`);
    if (![4, 6, 8].includes(job.seconds)) fail('Veo durations are 4, 6 or 8 seconds');
    if (['1080p', '4k'].includes(job.resolution) && job.seconds !== 8) fail('Veo requires 8 seconds at 1080p and 4k');
    if (!['16:9', '9:16'].includes(job.ratio ?? '16:9')) fail('Gemini aspect ratio must be 16:9 or 9:16');
    if (!(job.resolution in spec.usd)) fail(`${job.model} has no ${job.resolution} price`);
    if (job.lastFrame && !spec.keyframes) fail(`last-frame support for ${job.model} is not confirmed in Google's docs; use veo-3.1-fast-generate-preview or veo-3.1-generate-preview`);
  }
  return true;
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
export function readImage(path) {
  const mime = MIME[extname(path).toLowerCase()] ?? fail(`unsupported image type for ${path} (png, jpg, webp)`);
  const bytes = readFileSync(path);
  if (bytes.length > 3_700_000) fail(`${path} is ${bytes.length} bytes; Runway data URIs are limited to 5 MB after base64, so keep images under about 3.7 MB`);
  return { mime, base64: bytes.toString('base64') };
}

export function buildRunwayRequest(job, images) {
  const spec = RUNWAY_MODELS[job.model];
  const uri = (image) => `data:${image.mime};base64,${image.base64}`;
  const promptImage = [{ uri: uri(images.first), position: 'first' }];
  if (images.last) promptImage.push({ uri: uri(images.last), position: 'last' });
  const body = { model: job.model, promptImage, promptText: job.prompt, duration: job.seconds };
  if (job.ratio) body.ratio = job.ratio;
  if (spec.audioParam || job.model.startsWith('seedance')) body.audio = Boolean(job.audio);
  if (job.seed !== undefined) body.seed = job.seed;
  return { url: `${RUNWAY_BASE}/v1/image_to_video`, body };
}

export function buildGeminiRequest(job, images) {
  const toImage = (image) => ({ bytesBase64Encoded: image.base64, mimeType: image.mime });
  const instance = { prompt: job.prompt };
  if (images.first) instance.image = toImage(images.first);
  if (images.last) instance.lastFrame = toImage(images.last);
  const parameters = { durationSeconds: job.seconds, resolution: job.resolution, aspectRatio: job.ratio ?? '16:9' };
  return { url: `${GEMINI_BASE}/models/${job.model}:predictLongRunning`, body: { instances: [instance], parameters } };
}

const json = async (response, what) => {
  const text = await response.text();
  if (!response.ok) fail(`${what} failed: HTTP ${response.status} ${text.slice(0, 300).replace(/key_[a-f0-9]+|AQ\.[\w.-]+/g, '<redacted>')}`);
  try { return JSON.parse(text); } catch { return fail(`${what} returned non-JSON: ${text.slice(0, 120)}`); }
};
const download = async (url, fetchImpl, headers = {}) => {
  const response = await fetchImpl(url, { headers });
  if (!response.ok) fail(`download failed: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};

export async function runRunway(job, images, { fetch: fetchImpl = fetch, key, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), pollMs = 5000, timeoutMs = 20 * 60_000 } = {}) {
  if (!key) fail('RUNWAYML_API_SECRET is not set');
  const headers = { Authorization: `Bearer ${key}`, 'X-Runway-Version': RUNWAY_VERSION, 'Content-Type': 'application/json' };
  const { url, body } = buildRunwayRequest(job, images);
  const created = await json(await fetchImpl(url, { method: 'POST', headers, body: JSON.stringify(body) }), 'Runway create');
  const taskId = created.id ?? fail('Runway create returned no task id');
  const started = Date.now();
  for (;;) {
    const task = await json(await fetchImpl(`${RUNWAY_BASE}/v1/tasks/${taskId}`, { headers }), 'Runway task poll');
    if (task.status === 'SUCCEEDED') {
      const outputUrl = task.output?.[0] ?? fail(`task ${taskId} succeeded without output`);
      return { taskId, outputUrl, bytes: await download(outputUrl, fetchImpl) };
    }
    if (task.status === 'FAILED') fail(`Runway task ${taskId} failed: ${task.failureCode ?? 'unknown'} ${String(task.failure ?? '').slice(0, 200)}`);
    if (task.status === 'CANCELLED') fail(`Runway task ${taskId} was cancelled`);
    if (Date.now() - started > timeoutMs) fail(`timed out waiting for Runway task ${taskId} (still ${task.status}); check it in the portal before retrying so credits are not spent twice`);
    await sleep(pollMs);
  }
}

export async function runGemini(job, images, { fetch: fetchImpl = fetch, key, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), pollMs = 10000, timeoutMs = 20 * 60_000 } = {}) {
  if (!key) fail('GEMINI_API_KEY is not set');
  const headers = { 'x-goog-api-key': key, 'Content-Type': 'application/json' };
  const { url, body } = buildGeminiRequest(job, images);
  const created = await json(await fetchImpl(url, { method: 'POST', headers, body: JSON.stringify(body) }), 'Gemini create');
  const name = created.name ?? fail('Gemini create returned no operation name');
  const started = Date.now();
  for (;;) {
    const op = await json(await fetchImpl(`${GEMINI_BASE}/${name}`, { headers: { 'x-goog-api-key': key } }), 'Gemini operation poll');
    if (op.done) {
      if (op.error) fail(`Gemini operation ${name} failed: ${JSON.stringify(op.error).slice(0, 300)}`);
      const uri = op.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri ?? fail(`Gemini operation ${name} finished with no video (possibly filtered by safety)`);
      return { taskId: name, outputUrl: uri, bytes: await download(uri, fetchImpl, { 'x-goog-api-key': key }) };
    }
    if (Date.now() - started > timeoutMs) fail(`timed out waiting for Gemini operation ${name}; check it before retrying`);
    await sleep(pollMs);
  }
}

// Spend guard. Returns { ok, reason }. A run needs an explicit approval at or above the estimate, and anything
// above the default cap needs an explicit over-cap flag as well.
export function checkSpend({ estimate, approvedCredits, approvedUsd, balanceCredits, overCap = false, capCredits = DEFAULT_CAP_CREDITS }) {
  if (estimate.credits !== null) {
    if (approvedCredits === undefined) return { ok: false, reason: `pass --approve-credits ${estimate.credits} (or more) to spend; nothing runs by default` };
    if (approvedCredits < estimate.credits) return { ok: false, reason: `approved ${approvedCredits} credits is below the estimate ${estimate.credits}` };
    if (estimate.credits > capCredits && !overCap) return { ok: false, reason: `estimate ${estimate.credits} credits exceeds the ${capCredits}-credit job cap; the owner must approve with --owner-approved-over-cap` };
    if (balanceCredits !== undefined && balanceCredits < estimate.credits) return { ok: false, reason: `balance ${balanceCredits} credits is below the estimate ${estimate.credits}` };
  } else {
    if (approvedUsd === undefined) return { ok: false, reason: `pass --approve-usd ${estimate.usd} (or more) to spend; nothing runs by default` };
    if (approvedUsd < estimate.usd) return { ok: false, reason: `approved $${approvedUsd} is below the estimate $${estimate.usd}` };
    if (estimate.usd > capCredits * CREDIT_USD && !overCap) return { ok: false, reason: `estimate $${estimate.usd} exceeds the $${capCredits * CREDIT_USD} job cap; the owner must approve with --owner-approved-over-cap` };
  }
  return { ok: true, reason: '' };
}

// Parse KEY=value names from .env text without ever returning other values.
export function readKey(name, { env = process.env, dotenvText = '' } = {}) {
  if (env[name]) return env[name];
  const line = dotenvText.split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : undefined;
}

const sha = (data) => createHash('sha256').update(data).digest('hex');
export function appendLedger(path, entry) {
  mkdirSync(dirname(path), { recursive: true });
  if (!existsSync(path) || readFileSync(path, 'utf8').trim() === '') {
    writeFileSync(path, '# Media ledger\n\nGenerated assets: provider, model, prompt hash, cost and license terms. Generated footage never stands in for real product footage or results.\n\n| Date | Provider | Model | Seconds | Res | Prompt sha256 | Est cost | Task | Output | Output sha256 | Notes |\n|---|---|---|---|---|---|---|---|---|---|---|\n');
  }
  const cost = entry.estimate.credits !== null ? `${entry.estimate.credits} credits ($${entry.estimate.usd})` : `$${entry.estimate.usd}`;
  appendFileSync(path, `| ${entry.date} | ${entry.job.provider} | ${entry.job.model} | ${entry.job.seconds} | ${entry.job.resolution} | ${sha(entry.job.prompt).slice(0, 12)} | ${cost} | ${entry.taskId} | ${entry.out} | ${sha(entry.bytes).slice(0, 12)} | ${entry.notes ?? ''} |\n`);
}
