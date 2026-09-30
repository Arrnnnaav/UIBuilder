// `monid keys list` exits 0 even with no key, so read its message rather than the exit code.
export const monidHasKey = (ok, output) => ok && String(output).trim().length > 0 && !/no api keys|not configured|no active/i.test(output);

// Pure readiness assessment for paid media generation (scroll-world and launch video).
// state: { ffmpeg, ffprobe, higgsfield: {installed, authed}, monid: {installed, has_key}, codex: {installed, logged_in} }
export function assess(state) {
  const s = {
    ffmpeg: Boolean(state.ffmpeg), ffprobe: Boolean(state.ffprobe),
    higgsfield: { installed: Boolean(state.higgsfield?.installed), authed: Boolean(state.higgsfield?.authed) },
    monid: { installed: Boolean(state.monid?.installed), has_key: Boolean(state.monid?.has_key) },
    codex: { installed: Boolean(state.codex?.installed), logged_in: Boolean(state.codex?.logged_in) },
  };
  const keys = { runway: Boolean(state.keys?.runway), gemini: Boolean(state.keys?.gemini), fal: Boolean(state.keys?.fal), nvidia: Boolean(state.keys?.nvidia) };
  const can = {
    stills: (s.higgsfield.installed && s.higgsfield.authed) || (s.codex.installed && s.codex.logged_in),
    video_chain: (s.monid.installed && s.monid.has_key) || (s.higgsfield.installed && s.higgsfield.authed),
    // Single clips with first and last frames through scripts/media-generate.mjs (Runway Dev or Gemini Veo).
    video_clips_api: keys.runway || keys.gemini,
    encode: s.ffmpeg && s.ffprobe,
  };
  const next_steps = [];
  if (!s.higgsfield.installed) next_steps.push('install the Higgsfield CLI: npm install -g @higgsfield/cli@1.1.26');
  else if (!s.higgsfield.authed) next_steps.push('owner: run `higgsfield auth login` (interactive OAuth), then `higgsfield workspace set <id>`');
  if (!s.monid.installed) next_steps.push('owner: install the Monid CLI from its official source (not recorded in this repo) and add a key; without it the video chain bills Higgsfield credits');
  else if (!s.monid.has_key) next_steps.push('owner: add a Monid key (`monid keys list` shows none)');
  if (!s.ffmpeg || !s.ffprobe) next_steps.push('install ffmpeg and ffprobe (frame extraction and encoding)');
  if (!can.stills && !s.codex.installed) next_steps.push('optional: Codex CLI with a ChatGPT login can render stills without Higgsfield credits');
  if (!can.video_clips_api) next_steps.push('owner: add RUNWAYML_API_SECRET or GEMINI_API_KEY to the ignored root .env to enable API clips (scripts/media-generate.mjs)');
  return { state: s, api_keys_present: keys, can, next_steps, note: 'Readiness only. Any paid batch still needs a stated estimate and owner approval for that run.' };
}
