// Checks for a clip that came back from a manual studio (Google Flow, Kling, Hailuo, Runway app).
// Pure functions here; scripts/media-inbox-check.mjs runs ffprobe and ffmpeg and feeds them in.

export function parseProbe(probe, sizeBytes = 0) {
  const streams = probe?.streams ?? [];
  const video = streams.find((s) => s.codec_type === 'video');
  const audio = streams.find((s) => s.codec_type === 'audio');
  if (!video) return { ok: false, reason: 'no video stream found' };
  const [num, den] = String(video.r_frame_rate ?? '0/1').split('/').map(Number);
  const seconds = Number(probe?.format?.duration ?? video.duration ?? 0);
  return { ok: true, codec: video.codec_name, width: video.width, height: video.height, fps: den ? Math.round((num / den) * 100) / 100 : 0, seconds: Math.round(seconds * 100) / 100, hasAudio: Boolean(audio), sizeBytes: sizeBytes || Number(probe?.format?.size ?? 0) };
}

// Mean absolute difference between two equally sized raw RGB buffers, as a percent of full scale.
export function meanAbsDiffPercent(a, b) {
  if (!a?.length || a.length !== b?.length) throw new Error('frame buffers must be non-empty and the same size');
  let total = 0;
  for (let i = 0; i < a.length; i++) total += Math.abs(a[i] - b[i]);
  return Math.round((total / a.length / 255) * 10000) / 100;
}

export function evaluateClip(info, expect = {}) {
  const problems = [];
  const notes = [];
  if (!info.ok) return { problems: [info.reason], notes };
  if (expect.ratio) {
    const [w, h] = expect.ratio.split(':').map(Number);
    const want = w / h;
    const got = info.width / info.height;
    if (Math.abs(got - want) / want > 0.02) problems.push(`aspect ratio ${info.width}x${info.height} (${got.toFixed(3)}) does not match ${expect.ratio}`);
  }
  if (expect.seconds !== undefined) {
    const slack = expect.secondsSlack ?? 0.6;
    if (Math.abs(info.seconds - expect.seconds) > slack) problems.push(`length ${info.seconds}s is not within ${slack}s of ${expect.seconds}s`);
  }
  const minHeight = expect.minHeight ?? 720;
  if (Math.min(info.width, info.height) < minHeight && Math.max(info.width, info.height) < minHeight * 1.7) problems.push(`resolution ${info.width}x${info.height} is below ${minHeight}p`);
  if (expect.first !== undefined && expect.first > (expect.tolerance ?? 10)) problems.push(`first frame differs from the attached start frame by ${expect.first}% (tolerance ${expect.tolerance ?? 10}%)`);
  if (expect.last !== undefined && expect.last > (expect.tolerance ?? 10)) problems.push(`last frame differs from the attached end frame by ${expect.last}% (tolerance ${expect.tolerance ?? 10}%)`);
  if (info.codec !== 'h264') notes.push(`codec is ${info.codec}; re-encode to H.264 before wiring it into the scrub engine`);
  if (info.hasAudio) notes.push('has an audio track; strip it for scrubbed video (-an)');
  if (info.sizeBytes > 25 * 1024 * 1024) notes.push(`file is ${(info.sizeBytes / 1048576).toFixed(1)} MB; re-encode before shipping`);
  return { problems, notes };
}
