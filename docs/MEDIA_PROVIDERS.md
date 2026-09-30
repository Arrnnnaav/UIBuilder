# Media providers (video, stills, design studios)

Verified 2026-09-30. Rule 8 applies: check live pricing again before spending. "Verified" means read on the provider's own page; "reported" means a third-party blog, treat as a lead only. No local generation (owner decision, and the dev machine has a 4 GB GPU anyway).

## Bottom line
There is **no reliable free API for shippable video**. Free options are manual studios or trial terms that forbid production use. The cheapest legitimate API path is pay-as-you-go at about $0.05 to $0.30 per second, so a 6-scene scroll film costs roughly $4 to $22 before retries.

## Reference job: 6-scene scroll-world chain
The skill's defaults are 6 dive clips of 8s plus 5 connectors of 5s, about 73 seconds of output. Seams need a model that accepts start and end frames. Add 1.5x to 2x for re-rolls.
| Route | Rate | 73s |
|---|---|---|
| Gemini API, Veo 3.1 Lite 720p (verified) | $0.05/s | $3.65 |
| Runway Dev, `wan3` 480p (verified) | $0.05/s | $3.65 |
| Runway Dev, `wan3` 720p (verified) | $0.10/s | $7.30 |
| Runway Dev, `veo3.1_fast` no audio (verified) | $0.10/s | $7.30 |
| Runway Dev, `seedance2_mini` (verified) | $0.16/s | $11.68 |
| Runway Dev, `seedance2_fast` (verified) | $0.29/s | $21.17 |
| Runway Dev, `seedance2` 480p/720p (verified) | $0.36/s | $26.28 |
| fal, Seedance 2.0 720p fast (verified) | $0.2419/s | $17.66 |
| fal, Seedance 2.0 720p (verified) | $0.3034/s | $22.15 |
| Monid, Seedance 2.0 720p (skill's own figure, unverified) | about $0.15/s | about $11 |
Reported but unverified: Atlas Cloud Seedance fast at $0.022/s and BytePlus $0.04 to $0.78/s. Treat resellers with signup credits (Apiframe and similar) as unvetted: unknown terms and reliability.

## Providers
| Provider | Agent path | Free start | Notes |
|---|---|---|---|
| Runway Dev API | HTTP API, one key, model router | None confirmed for the API (app credits are separate); credits $0.01 each | Seedance 2 family, Veo 3.1, Wan 3, Hailuo 3, Gen-4 Turbo, plus images (`muse_image` 1 credit, `seedream5_lite` 4). Best single-key option. Tool `runway_api`. |
| Gemini API | HTTP API | None for Veo or images (official) | Veo 3.1 Lite is the cheapest first-party video; Nano Banana 2 about $0.067 per 1K image. Tool `gemini_media_api`. |
| fal.ai | HTTP API | Promotional credits only | Wide catalog; community MCPs unvetted. Tool `fal_api`. |
| Monid | CLI (installed, no key) | Owner adds a key | Used by scroll-world today. Tool `monid_video`. |
| Higgsfield | CLI (installed, not logged in) | Owner login | Only needed by scroll-world for stills; Codex `image_gen` (ChatGPT login) already covers stills, so it can stay idle. |
| Google Flow | Manual studio, no API | 50 credits per day (official) | Previz only: the free tier reportedly adds a visible watermark and limits commercial rights. Tool `google_flow_manual`. |
| Google Stitch | Manual loop today; official MCP exists | Free beta; limits reported inconsistently | UI concepts and HTML export. Docs page not fetched, so MCP setup is unverified. Tool `stitch`. |
| NVIDIA API Catalog | HTTP API (OpenAI-compatible) | Trial credits (reported 1,000) | Trial terms bar production use of the API or its output. Pre-G2 concept exploration only. Resource is kept in review (ask the owner). |
| Kling, Hailuo, Pika, Runway app | Consumer apps | Daily or signup credits | Manual only; APIs are paid. Same previz-only rule as Flow. |
| Hugging Face Inference Providers | HTTP API | $0.10 per month (reported) | Routes to fal and Replicate; the free amount is negligible. |

## Recommended setup
1. **Stills:** Codex `image_gen` (ChatGPT login, no extra spend).
2. **Previz and story boards:** Google Flow free credits and Stitch, run by the owner; files go in `docs/media/` and into `MEDIA_LEDGER.md`.
3. **Final video:** one paid API key. Runway Dev for breadth on one key, or the Gemini API for the cheapest Veo. Start with a small prepaid balance and a spend cap.
4. **Concept images before G2:** NVIDIA trial only if the owner approves, never shipped.
5. Keep Monid and Higgsfield installed but idle; use Monid only if its live price beats the others.

## Gaps to close before spending
- **Adapter (done for Runway and Gemini):** `node scripts/media-generate.mjs` renders one clip from a first frame and an optional last frame. It is a dry run unless `--run` plus an approval at or above the estimate is given, refuses anything over 100 credits without `--owner-approved-over-cap`, reads the live balance, and writes a row to `MEDIA_LEDGER.md`. Runway was live-tested on 2026-09-30 (`veo3.1_fast`, 4 s, first and last frame, 40 credits; both end frames matched). Gemini is built from the official SDK shapes but not live-tested (no key). fal has no adapter. The scroll-world skill itself still only drives Monid and Higgsfield, so a chain on Runway or Gemini is assembled clip by clip with this script: dive clips, then connectors whose first and last frames are the neighbours' boundary frames.
- **First/last frame:** verified from the Runway SDK types: `seedance2`, `seedance2_fast`, `seedance2_mini`, `veo3.1` and `veo3.1_fast` accept both; `gen4.5`, `gen4_turbo` and `happyhorse` do not. On the Gemini API, `veo-3.1-generate-preview` and `veo-3.1-fast-generate-preview` accept `lastFrame`; Lite is unconfirmed and refused.
- **Terms:** read each provider's output and commercial terms before shipping generated assets. Record generator, model, prompt hash, date, license and cost in `docs/MEDIA_LEDGER.md`.
- **Keys:** the owner creates them and stores them in the ignored root `.env` or the tool's own login. Never paste a key into chat. Names expected: `RUNWAYML_API_SECRET` (verify in Runway's SDK docs), `GEMINI_API_KEY`, `FAL_KEY`, `NVIDIA_API_KEY`.
