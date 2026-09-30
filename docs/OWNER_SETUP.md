# Owner setup checklist

What to set up, in what order, the best option for each job, and the fallback when it is missing. State as of 2026-09-30. Prices and terms: `docs/MEDIA_PROVIDERS.md`. Check what is ready with `node scripts/health.mjs`, `node scripts/media-preflight.mjs` and `claude mcp list`.

## Already working (nothing to do)
Node 24, pnpm, git, gh, Docker (Semgrep and Gitleaks routes), ffmpeg and ffprobe, Tavily CLI, agent-browser, Vercel CLI 61.1.0, Wrangler 4.144.0, Codex 0.158 with a ChatGPT login (stills), Monid CLI 0.1.7 (no key), Higgsfield CLI 1.1.26 (not logged in), GitHub MCP, Jev key in the ignored root `.env`.

## Set up now (free)
1. **Stitch MCP (design concepts): DONE 2026-09-30.** Added at user scope as `stitch`, connected, 15 tools; `design-director` uses all but `delete_project`, one Stitch project per fork. The key is in your `~/.claude.json`, so every Claude Code project on this machine can reach it; because it was pasted in chat, regenerate it when convenient and re-run the command below with the new key. The original setup notes follow. Create a Stitch API key where Google's MCP docs say (stitch.withgoogle.com/docs/mcp/setup; that page could not be fetched, so confirm the key screen there), then run it yourself so the key stays out of chat:
   `! claude mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: <your key>" -s user`
   Then `claude mcp list` should show it connected; its tools appear in a new session. The key is stored in plain text in `~/.claude.json` (user scope). Verified: the endpoint answers an MCP `initialize` without a key; the tool list needs the key and is untested. Stitch can create designs in your Google account, so ask the agent to list its tools before using them.
   Fallback: the manual loop (agent writes the prompt with `stitch-design-taste`, you paste results back), then `design-director` HTML mockups, which are the baseline anyway.
2. **Google Flow (previz).** Sign in at labs.google/fx/tools/flow; 50 free credits a day. Save clips in `docs/media/` and the agent logs them in `MEDIA_LEDGER.md`. Previz only: free-tier output carries a watermark and limited commercial rights.
   Fallback: skip previz and go from the concept HTML to the prototype.
3. **Vercel MCP login (optional, S7 deploy).** `claude mcp list` shows it needs authentication. The Vercel CLI already covers deploys.
   Fallback: Vercel CLI, or Wrangler for client sites on Cloudflare.

## Set up when you commit to a film (paid)
Pick one paid key. Start with a small prepaid balance and a spend cap.
| Choice | Why | How | Key name |
|---|---|---|---|
| **Gemini API (Veo 3.1 Lite)** | cheapest first-party video, $0.05/s | enable billing in Google AI Studio, create a key | `GEMINI_API_KEY` |
| **Runway Dev API** | one key for Seedance 2 family, Veo 3.1, Wan 3, Hailuo 3 and image models | dev.runway.com, create an organization, buy credits ($0.01 each) | `RUNWAYML_API_SECRET` (verify in their SDK docs) |
| fal.ai | wide catalog, higher Seedance price | fal.ai, add balance | `FAL_KEY` |
| Monid | scroll-world already supports it, about $0.15/s by the skill's own figure | app.monid.ai, then `! monid keys add -k <key> -l main`, and set a budget or run cap | stored by the CLI |
Put keys in the ignored root `.env` (or the tool's own login), never in chat. **Adapter:** `node scripts/media-generate.mjs` covers Runway (live-tested) and Gemini (built from official shapes, untested until a key exists); fal has none. scroll-world itself still drives only Monid and Higgsfield, so a chain on Runway or Gemini is assembled clip by clip with that script.

## Test the Gemini path (needs your key, spends about $0.40)
Gemini is built from Google's official request shapes but has never run live. To prove it:
1. Get a key at aistudio.google.com/apikey and enable billing on that project (Veo has no free tier via the API). Add `GEMINI_API_KEY=<key>` to the ignored root `.env` yourself.
2. Ask me to run it, or run: `node scripts/media-generate.mjs --provider gemini --model veo-3.1-fast-generate-preview --first <a.png> --last <b.png> --prompt "<text>" --seconds 4 --resolution 720p --ratio 16:9 --out <clip.mp4>`. Without `--run` it is a dry run that prints the estimate ($0.10/s x 4s = $0.40).
3. To spend it: add `--run --approve-usd 0.4`. Then `node scripts/media-inbox-check.mjs <clip.mp4> --first <a.png> --last <b.png> --seconds 4 --ratio 16:9` must say pass. That proves the request shape, polling, download and last-frame support in one go.
The cheaper Lite model ($0.05/s) is refused for last frames because Google's docs do not confirm support.

## Manual clips: Google Flow request cards
Whenever a clip should be made by hand in Flow (or Kling, Hailuo, the Runway app), an agent writes a request card from `templates/docs/MEDIA_REQUEST.md` to `docs/media/requests/<id>.md`. You follow its numbered steps (about 5 minutes), save the download where it says, and reply `card <id> done`. I then check the file with `node scripts/media-inbox-check.mjs` (aspect ratio, length, resolution, and whether the first and last frames match what you attached) and log it. See `docs/examples/MEDIA_REQUEST.example.md`. Free-tier output is previz unless the studio's terms allow the use.

## Best pick per job and the fallback chain
| Job | Best | Fallbacks in order |
|---|---|---|
| Scene stills | Codex `image_gen` (already works) | Nano Banana 2 API ($0.067 per 1K), Runway `muse_image` or `seedream5_lite`, Higgsfield, owner-provided or licensed photography, labeled placeholder slots |
| Video clips | Gemini Veo 3.1 Lite, or Runway Dev on one key | fal Seedance, Monid, owner-made clips from Flow or Kling (previz unless the license allows), then a no-video story with Motion or GSAP sticky-stack and poster stills |
| Design concepts | Stitch MCP | Stitch manual loop, `design-director` HTML mockups |
| Browser testing | agent-browser | Playwright (also the G3 baseline) |
| Research | Tavily CLI | `web_search`, then WebSearch (Agent Reach is not installed) |
| Security scans | Docker Semgrep and Gitleaks | `security-review` skill and the package audit |
| Deploy | Vercel CLI (Wrangler for client sites) | Vercel MCP after login |
| Image ideas before G2 | Stitch, Flow, Codex | NVIDIA trial, only with owner approval, never shipped |

## Not worth setting up
Higgsfield login (Codex covers stills), NVIDIA for shipped assets (trial terms bar production), Hugging Face (about $0.10 a month), resellers with signup credits (unvetted), any local video generation (your call, and a 4 GB GPU).

## Decisions only you can make
Which paid video key; whether to lift the three cautioned resources (lightswind, mobbin, open-seo) on a case basis; which of Runway or Gemini to fund first.
