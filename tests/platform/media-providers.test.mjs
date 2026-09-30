import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appendLedger, buildGeminiRequest, buildRunwayRequest, checkSpend, estimateCost, readImage, readKey, runGemini, runRunway, validateJob } from '../../scripts/lib/media-providers.mjs';

const base = { provider: 'runway', model: 'veo3.1_fast', prompt: 'slow push in', seconds: 4, ratio: '1280:720', resolution: '720p', firstFrame: 'a.png' };
const img = (n) => ({ mime: 'image/png', base64: `img${n}` });
const respond = (body, ok = true, status = 200) => ({ ok, status, text: async () => JSON.stringify(body), json: async () => body, arrayBuffer: async () => Buffer.from(String(body)) });
const bytesResponse = (text) => ({ ok: true, status: 200, arrayBuffer: async () => Buffer.from(text) });

test('cost estimates match the published rates', () => {
  assert.deepEqual(estimateCost({ ...base }).credits, 40);
  assert.equal(estimateCost({ ...base, model: 'seedance2_mini', seconds: 5 }).credits, 80);
  assert.equal(estimateCost({ ...base, model: 'seedance2_mini', seconds: 3 }).credits, 64);
  assert.equal(estimateCost({ ...base, audio: true }).credits, 60);
  assert.equal(estimateCost({ ...base, model: 'seedance2', resolution: '1080p', seconds: 5 }).credits, 200);
  assert.equal(estimateCost({ ...base, provider: 'gemini', model: 'veo-3.1-lite-generate-preview', seconds: 8 }).usd, 0.4);
  assert.equal(estimateCost({ ...base, provider: 'gemini', model: 'veo-3.1-fast-generate-preview', seconds: 8, resolution: '1080p' }).usd, 0.96);
});

test('invalid jobs are refused with a reason', () => {
  assert.throws(() => validateJob({ ...base, firstFrame: undefined }), /--first/);
  assert.throws(() => validateJob({ ...base, seconds: 5 }), /4, 6, 8 seconds/);
  assert.throws(() => validateJob({ ...base, ratio: '100:100' }), /ratio must be one of/);
  assert.throws(() => validateJob({ ...base, model: 'seedance2_fast', resolution: '1080p' }), /no published price/);
  assert.throws(() => validateJob({ ...base, model: 'nope' }), /unknown Runway model/);
  assert.throws(() => validateJob({ ...base, prompt: 'x'.repeat(1001) }), /allows 1000/);
  assert.throws(() => validateJob({ ...base, firstFrame: undefined, lastFrame: 'b.png' }), /--first|first frame/);
  assert.throws(() => validateJob({ ...base, provider: 'gemini', model: 'veo-3.1-lite-generate-preview', lastFrame: 'b.png', ratio: '16:9' }), /not confirmed/);
  assert.throws(() => validateJob({ ...base, provider: 'gemini', model: 'veo-3.1-generate-preview', resolution: '1080p', seconds: 4, ratio: '16:9' }), /8 seconds at 1080p/);
  assert.equal(validateJob({ ...base, lastFrame: 'b.png' }), true);
});

test('Runway request uses keyframe positions, duration and the audio flag', () => {
  const { url, body } = buildRunwayRequest({ ...base, lastFrame: 'b.png', audio: false }, { first: img(1), last: img(2) });
  assert.equal(url, 'https://api.dev.runwayml.com/v1/image_to_video');
  assert.deepEqual(body.promptImage.map((p) => p.position), ['first', 'last']);
  assert.match(body.promptImage[0].uri, /^data:image\/png;base64,img1$/);
  assert.deepEqual({ model: body.model, duration: body.duration, ratio: body.ratio, audio: body.audio, promptText: body.promptText }, { model: 'veo3.1_fast', duration: 4, ratio: '1280:720', audio: false, promptText: 'slow push in' });
});

test('Gemini request maps first and last frames into the instance', () => {
  const job = { ...base, provider: 'gemini', model: 'veo-3.1-fast-generate-preview', ratio: '16:9' };
  const { url, body } = buildGeminiRequest(job, { first: img(1), last: img(2) });
  assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast-generate-preview:predictLongRunning');
  assert.deepEqual(body.instances[0].image, { bytesBase64Encoded: 'img1', mimeType: 'image/png' });
  assert.deepEqual(body.instances[0].lastFrame, { bytesBase64Encoded: 'img2', mimeType: 'image/png' });
  assert.deepEqual(body.parameters, { durationSeconds: 4, resolution: '720p', aspectRatio: '16:9' });
});

test('Runway run polls until success then downloads without auth headers', async () => {
  const calls = [];
  const statuses = [{ status: 'PENDING' }, { status: 'RUNNING', progress: 0.5 }, { status: 'SUCCEEDED', output: ['https://cdn.example/out.mp4'] }];
  const fetchMock = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.endsWith('/v1/image_to_video')) return respond({ id: 'task1' });
    if (url.includes('/v1/tasks/')) return respond(statuses.shift());
    return bytesResponse('VIDEO');
  };
  const result = await runRunway(base, { first: img(1) }, { fetch: fetchMock, key: 'k', sleep: async () => {}, pollMs: 0 });
  assert.equal(result.taskId, 'task1');
  assert.equal(result.bytes.toString(), 'VIDEO');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer k');
  assert.equal(calls[0].options.headers['X-Runway-Version'], '2024-11-06');
  assert.equal(calls.at(-1).options.headers?.Authorization, undefined);
});

test('Runway failure and timeout name the task and never leak the key', async () => {
  const failing = async (url) => (url.endsWith('/v1/image_to_video') ? respond({ id: 't2' }) : respond({ status: 'FAILED', failure: 'bad', failureCode: 'SAFETY.INPUT' }));
  await assert.rejects(runRunway(base, { first: img(1) }, { fetch: failing, key: 'secret-key', sleep: async () => {} }), /t2 failed: SAFETY\.INPUT/);
  const stuck = async (url) => (url.endsWith('/v1/image_to_video') ? respond({ id: 't3' }) : respond({ status: 'RUNNING' }));
  await assert.rejects(runRunway(base, { first: img(1) }, { fetch: stuck, key: 'secret-key', sleep: async () => {}, timeoutMs: -1 }), /timed out waiting for Runway task t3/);
  const unauthorized = async () => respond({ error: 'key_abc123 invalid' }, false, 401);
  await assert.rejects(runRunway(base, { first: img(1) }, { fetch: unauthorized, key: 'k' }), (e) => /HTTP 401/.test(e.message) && !/key_abc123/.test(e.message));
});

test('Gemini run polls the operation and downloads with the key header', async () => {
  const calls = [];
  const ops = [{ done: false }, { done: true, response: { generateVideoResponse: { generatedSamples: [{ video: { uri: 'https://files.example/v.mp4' } }] } } }];
  const fetchMock = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.endsWith(':predictLongRunning')) return respond({ name: 'operations/abc' });
    if (url.endsWith('operations/abc')) return respond(ops.shift());
    return bytesResponse('GEMVIDEO');
  };
  const job = { ...base, provider: 'gemini', model: 'veo-3.1-fast-generate-preview', ratio: '16:9' };
  const result = await runGemini(job, { first: img(1) }, { fetch: fetchMock, key: 'gk', sleep: async () => {}, pollMs: 0 });
  assert.equal(result.bytes.toString(), 'GEMVIDEO');
  assert.equal(calls[0].options.headers['x-goog-api-key'], 'gk');
  assert.equal(calls.at(-1).options.headers['x-goog-api-key'], 'gk');
  const filtered = async (url) => (url.endsWith(':predictLongRunning') ? respond({ name: 'operations/z' }) : respond({ done: true, response: { generateVideoResponse: {} } }));
  await assert.rejects(runGemini(job, { first: img(1) }, { fetch: filtered, key: 'gk', sleep: async () => {} }), /no video/);
});

test('spend guard needs explicit approval, respects the cap and the balance', () => {
  const est = { credits: 40, usd: 0.4 };
  assert.equal(checkSpend({ estimate: est }).ok, false);
  assert.equal(checkSpend({ estimate: est, approvedCredits: 30 }).ok, false);
  assert.equal(checkSpend({ estimate: est, approvedCredits: 40, balanceCredits: 500 }).ok, true);
  assert.match(checkSpend({ estimate: est, approvedCredits: 40, balanceCredits: 10 }).reason, /balance 10/);
  const big = { credits: 150, usd: 1.5 };
  assert.match(checkSpend({ estimate: big, approvedCredits: 150, balanceCredits: 500 }).reason, /job cap/);
  assert.equal(checkSpend({ estimate: big, approvedCredits: 150, balanceCredits: 500, overCap: true }).ok, true);
  assert.equal(checkSpend({ estimate: { credits: null, usd: 0.4 }, approvedUsd: 0.4 }).ok, true);
  assert.equal(checkSpend({ estimate: { credits: null, usd: 0.4 } }).ok, false);
});

test('keys come from the environment or .env text and image reading limits size and type', (t) => {
  assert.equal(readKey('A', { env: { A: 'from-env' }, dotenvText: 'A=file' }), 'from-env');
  assert.equal(readKey('A', { env: {}, dotenvText: 'X=1\r\nA=from-file\r\n' }), 'from-file');
  assert.equal(readKey('B', { env: {}, dotenvText: 'A=1' }), undefined);
  const dir = mkdtempSync(join(tmpdir(), 'uib-media-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'a.png'), Buffer.from([1, 2, 3]));
  assert.deepEqual(readImage(join(dir, 'a.png')), { mime: 'image/png', base64: 'AQID' });
  writeFileSync(join(dir, 'a.gif'), 'x');
  assert.throws(() => readImage(join(dir, 'a.gif')), /unsupported image type/);
  writeFileSync(join(dir, 'big.png'), Buffer.alloc(3_800_000));
  assert.throws(() => readImage(join(dir, 'big.png')), /under about 3\.7 MB/);
});

test('ledger writes its header once and one row per asset', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'uib-media-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, 'docs', 'media', 'MEDIA_LEDGER.md');
  const entry = { date: '2026-09-30', job: base, estimate: estimateCost(base), taskId: 't1', out: 'clip.mp4', bytes: Buffer.from('v'), notes: 'balance 500 -> 460 credits' };
  appendLedger(path, entry);
  appendLedger(path, { ...entry, taskId: 't2' });
  const text = readFileSync(path, 'utf8');
  assert.equal((text.match(/# Media ledger/g) ?? []).length, 1);
  assert.equal((text.match(/\| t[12] \|/g) ?? []).length, 2);
  assert.match(text, /40 credits \(\$0\.4\)/);
  assert.match(text, /balance 500 -> 460 credits/);
});
