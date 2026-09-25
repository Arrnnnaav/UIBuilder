# M4 — Personal portfolio (end to end)

**Goal:** the first real run of the pipeline, ending in a live site that passes G3.

## Needs from user (S1 interview)
- Name, role and a one-line positioning
- Bio
- 3–6 projects, each with a title, problem, role, stack, outcome, images and links
- Socials, résumé PDF, contact email
- 3 vibe words, plus anything they dislike
- Domain, if any

## Steps
- **S1–S7** per `AGENTS.md`, using `pipelines/portfolio`.
- **Deploy:** Vercel Hobby, connected to the GitHub repo so PR previews work.
- **Connect:** run `/connect portfolio` to produce the handoff for the BusinessOS tenant.

## Done when
- G3 is green, with evidence in `projects/portfolio/docs/QA_REPORT.md`.
- The live URL is recorded in PROGRESS.
- `brain/builds/portfolio.json` is written with lineage.
