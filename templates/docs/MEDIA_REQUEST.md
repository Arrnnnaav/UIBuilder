# Media request card: {{id}}

Copy this file to `docs/media/requests/<id>.md` and fill every field. Used when a clip or still must be made by hand in a free studio (Google Flow, Kling, Hailuo or the Runway app) instead of a paid API. The owner follows "Do this" top to bottom and replies "card <id> done". Free-studio output is **previz** unless the owner confirms the studio's terms allow the use (see Rights).

## Why this asset
- **Project / section / beat:** {{slug}} / <section name> / <what the visitor should understand>
- **Used as:** previz | final (only if rights below are confirmed)
- **Why manual, not API:** <free credits are enough | API budget saved | studio has a look the API lacks>
- **Needed by:** <stage, e.g. S3.5 prototype>

## Do this (about 5 minutes)
Button names in these studios change; if a label differs, pick the closest one and tell me what you saw.
1. Open <studio URL> and sign in. Open or create a project named `{{slug}}`.
2. Choose the mode: **<Frames to Video | Text to Video | Ingredients to Video>**.
3. Choose the model: **<e.g. Veo 3.1 Fast>**. Expected cost: **<n credits of the daily free allowance>**; stop and tell me if the app shows more.
4. Set aspect ratio **<16:9 | 9:16>**, length **<n seconds>**, audio **<on | off>**, outputs **<1>**.
5. Upload the start frame `<docs/media/frames/<id>-first.png>` and, if listed, the end frame `<docs/media/frames/<id>-last.png>`. Keep them in this order.
6. Paste the prompt below exactly, then generate.
7. Pick the best take. Download the **highest quality MP4** offered (not a GIF, not a screen recording).
8. Save it as `docs/media/inbox/<id>.mp4`.
9. Reply: `card <id> done`, plus which take you chose and the credits the app showed.

## Prompt (copy-paste)
```text
<one paragraph: subject, camera move, lighting, mood, what changes from the first frame to the last. No text, logos or real people unless approved.>
```
**Avoid (negative prompt, if the studio has the field):** `<text overlays, watermarks, extra fingers, camera shake>`

## Files to attach
| Slot | File | Notes |
|---|---|---|
| Start frame | `docs/media/frames/<id>-first.png` | <where it came from: Codex image_gen, design, etc.> |
| End frame | `docs/media/frames/<id>-last.png` | omit if none |

## What I check when it comes back
Run by the agent: `node scripts/media-inbox-check.mjs docs/media/inbox/<id>.mp4 --first <first> --last <last> --seconds <n> --ratio <16:9>`. It fails on wrong aspect ratio, wrong length, low resolution, or first/last frames that do not match the frames you attached. A failure means a re-roll, decided by the owner because it spends free credits.

## Rights and record
- **Studio terms read on:** <date> · **Free-tier output allowed commercially:** yes | no | unknown (unknown means previz only)
- **Visible watermark on this output:** yes | no
- The agent logs the clip in `docs/media/MEDIA_LEDGER.md` (studio, model, prompt hash, date, credits, terms status) and never treats generated footage as real product footage or real results.

## Status
requested · delivered · checked · accepted · rejected (reason)
