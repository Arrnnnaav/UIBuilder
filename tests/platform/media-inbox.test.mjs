import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateClip, meanAbsDiffPercent, parseProbe } from '../../scripts/lib/media-inbox.mjs';

const probe = (over = {}) => ({ streams: [{ codec_type: 'video', codec_name: 'h264', width: 1280, height: 720, r_frame_rate: '24/1' }], format: { duration: '4.000000', size: '986242' }, ...over });

test('probe output is reduced to the facts the checks need', () => {
  assert.deepEqual(parseProbe(probe()), { ok: true, codec: 'h264', width: 1280, height: 720, fps: 24, seconds: 4, hasAudio: false, sizeBytes: 986242 });
  const withAudio = parseProbe(probe({ streams: [...probe().streams, { codec_type: 'audio' }] }));
  assert.equal(withAudio.hasAudio, true);
  assert.equal(parseProbe({ streams: [] }).ok, false);
});

test('frame difference is a percent of full scale and needs equal buffers', () => {
  assert.equal(meanAbsDiffPercent(Buffer.from([0, 0, 0]), Buffer.from([0, 0, 0])), 0);
  assert.equal(meanAbsDiffPercent(Buffer.from([0, 0]), Buffer.from([255, 255])), 100);
  assert.equal(meanAbsDiffPercent(Buffer.from([0, 255]), Buffer.from([51, 204])), 20);
  assert.throws(() => meanAbsDiffPercent(Buffer.from([1]), Buffer.from([1, 2])), /same size/);
});

test('a matching clip passes and a mismatched one lists every problem', () => {
  const good = evaluateClip(parseProbe(probe()), { ratio: '16:9', seconds: 4, first: 2, last: 3 });
  assert.deepEqual(good.problems, []);
  const bad = evaluateClip(parseProbe(probe({ streams: [{ codec_type: 'video', codec_name: 'vp9', width: 640, height: 640, r_frame_rate: '30/1' }], format: { duration: '9', size: '40000000' } })), { ratio: '16:9', seconds: 4, first: 40, last: 55 });
  assert.equal(bad.problems.length, 5);
  assert.ok(bad.problems.some((p) => /aspect ratio/.test(p)) && bad.problems.some((p) => /length 9s/.test(p)) && bad.problems.some((p) => /below 720p/.test(p)) && bad.problems.some((p) => /first frame/.test(p)) && bad.problems.some((p) => /last frame/.test(p)));
  assert.ok(bad.notes.some((n) => /vp9/.test(n)) && bad.notes.some((n) => /MB/.test(n)));
});

test('portrait 9:16 at 1080 wide passes the resolution floor and audio only adds a note', () => {
  const info = parseProbe({ streams: [{ codec_type: 'video', codec_name: 'h264', width: 720, height: 1280, r_frame_rate: '24/1' }, { codec_type: 'audio' }], format: { duration: '8', size: '1000' } });
  const result = evaluateClip(info, { ratio: '9:16', seconds: 8 });
  assert.deepEqual(result.problems, []);
  assert.ok(result.notes.some((n) => /audio/.test(n)));
});
