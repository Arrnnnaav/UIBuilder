# Media request card: hero-01 (worked example)

Example of a filled card from `templates/docs/MEDIA_REQUEST.md`. The project, prompt and files are illustrative.

## Why this asset
- **Project / section / beat:** demo / hero / the visitor understands the studio works by hand, in daylight
- **Used as:** previz (studio terms not confirmed for commercial use)
- **Why manual, not API:** the 50 free daily credits cover it; the paid Runway balance is saved
- **Needed by:** S3.5 local interaction prototype

## Do this (about 5 minutes)
Button names in these studios change; if a label differs, pick the closest one and tell me what you saw.
1. Open https://labs.google/fx/tools/flow and sign in. Open or create a project named `demo`.
2. Choose the mode: **Frames to Video**.
3. Choose the model: **Veo 3.1 Fast**. Expected cost: **20 credits of the 50 daily** (third-party figure; stop and tell me if the app shows more).
4. Set aspect ratio **16:9**, length **8 seconds** (the shortest the model offers may differ; tell me), audio **off**, outputs **1**.
5. Upload the start frame `docs/media/frames/hero-01-first.png` and the end frame `docs/media/frames/hero-01-last.png`, in that order.
6. Paste the prompt below exactly, then generate.
7. Pick the best take. Download the **highest quality MP4** offered.
8. Save it as `docs/media/inbox/hero-01.mp4`.
9. Reply: `card hero-01 done`, plus which take you chose and the credits the app showed.

## Prompt (copy-paste)
```text
Slow push-in across a wooden workbench in soft morning window light. Dust drifts through the beam, a hand-drawn sketch on the bench comes into focus, and the camera settles on the finished ceramic piece from the end frame. Calm, tactile, shallow depth of field, natural color, no text.
```
**Avoid (negative prompt, if the studio has the field):** `text overlays, watermarks, logos, camera shake, extra hands`

## Files to attach
| Slot | File | Notes |
|---|---|---|
| Start frame | `docs/media/frames/hero-01-first.png` | made with Codex image_gen from the approved direction |
| End frame | `docs/media/frames/hero-01-last.png` | same session, same lighting |

## What I check when it comes back
Run by the agent: `node scripts/media-inbox-check.mjs docs/media/inbox/hero-01.mp4 --first docs/media/frames/hero-01-first.png --last docs/media/frames/hero-01-last.png --seconds 8 --ratio 16:9`. It fails on wrong aspect ratio, wrong length, low resolution, or first/last frames that do not match the frames you attached. A failure means a re-roll, decided by the owner because it spends free credits.

## Rights and record
- **Studio terms read on:** not yet · **Free-tier output allowed commercially:** unknown (previz only)
- **Visible watermark on this output:** expected yes
- The agent logs the clip in `docs/media/MEDIA_LEDGER.md` (studio, model, prompt hash, date, credits, terms status) and never treats generated footage as real product footage or real results.

## Status
requested
