import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assess, monidHasKey } from '../../scripts/lib/media-preflight.mjs';

test('monid key detection reads the message, not the exit code', () => {
  assert.equal(monidHasKey(true, 'No API keys configured. Run "monid keys add" to add one.\n'), false);
  assert.equal(monidHasKey(true, ''), false);
  assert.equal(monidHasKey(false, 'main  active'), false);
  assert.equal(monidHasKey(true, 'main (active)  monid_live_...\n'), true);
});

test('a Runway or Gemini key enables API clips independently of the skill backends', () => {
  assert.equal(assess({ keys: { runway: true } }).can.video_clips_api, true);
  assert.equal(assess({ keys: { gemini: true } }).can.video_clips_api, true);
  assert.equal(assess({ keys: { fal: true, nvidia: true } }).can.video_clips_api, false);
  assert.deepEqual(assess({ keys: { runway: true } }).api_keys_present, { runway: true, gemini: false, fal: false, nvidia: false });
});

test('nothing installed: no media capability and clear next steps', () => {
  const report = assess({});
  assert.deepEqual(report.can, { stills: false, video_chain: false, video_clips_api: false, encode: false });
  assert.ok(report.next_steps.some((step) => /npm install -g @higgsfield\/cli/.test(step)));
  assert.ok(report.next_steps.some((step) => /Monid/.test(step)));
});

test('an installed but unauthenticated Higgsfield CLI is not ready and asks the owner to log in', () => {
  const report = assess({ ffmpeg: true, ffprobe: true, higgsfield: { installed: true, authed: false } });
  assert.equal(report.can.stills, false);
  assert.equal(report.can.video_chain, false);
  assert.equal(report.can.encode, true);
  assert.ok(report.next_steps.some((step) => /higgsfield auth login/.test(step)));
});

test('Codex login can render stills and Monid plus a key can bill the video chain', () => {
  const report = assess({ ffmpeg: true, ffprobe: true, codex: { installed: true, logged_in: true }, monid: { installed: true, has_key: true } });
  assert.deepEqual(report.can, { stills: true, video_chain: true, video_clips_api: false, encode: true });
  assert.match(report.note, /owner approval/);
});
