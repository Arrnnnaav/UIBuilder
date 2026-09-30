# M4 — Personal portfolio (end to end)

**Current state:** portfolio source lives in `D:\UiBuildProj\portfolio`, not in this harness.
Read its `docs/STATE.md` before continuing; that file is the current status authority. The
previous G2 approval applies only to the former design. The Sep 29 redesign review is waiting
for the owner's choice, so production UI work and new deployment remain gated.

**Goal:** complete the owner-approved redesign and resume the release path through G3/G3.5.

## Needs from user (S1 interview)
- Name, role and a one-line positioning
- Bio
- 3–6 projects, each with a title, problem, role, stack, outcome, images and links
- Socials, résumé PDF, contact email
- 3 vibe words, plus anything they dislike
- Domain, if any

## Steps
- **S1–S7** per `AGENTS.md`, using `pipelines/portfolio` and the external site repository.
- **Current next step:** review `D:\UiBuildProj\portfolio\docs\DESIGN_REVIEW.md` and `.html`; choose a direction and approve the exact hashes before production UI work.
- After G2, complete the original local interaction prototype and paired G2.5 review before implementation.
- **Deploy:** Vercel Hobby, connected to the GitHub repo so PR previews work.
- **Connect:** run `/connect portfolio` only after release gates and the approved target; the site repository owns its `seo.manifest.json`.

## Done when
- The current redesign passes G2 and G2.5, and the final source passes G3 with evidence in `D:\UiBuildProj\portfolio\docs/`.
- The live URL is recorded in PROGRESS.
- `brain/builds/portfolio.json` is written with lineage.
