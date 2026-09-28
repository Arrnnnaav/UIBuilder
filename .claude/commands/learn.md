---
description: Write build memory and update trust/scores after a project — /learn <slug>
argument-hint: <slug>
---

For project `projects/$ARGUMENTS`:

1. Read `docs/handoff/*.json`, `docs/QA_REPORT.md`, `docs/PERF_REPORT.md`, `docs/GROWTH_REPORT.md`, `docs/VISUAL_REVIEW.md` and `docs/DESIGN.md`.
2. Ask the user for feedback (AskUserQuestion). Keep it short: overall 1–10, best part, weakest part, and anything that looked generic.
3. Write `brain/builds/$ARGUMENTS.json` (schema `brain/schema/build.schema.json`):
   - resources_used, patterns_used
   - **lineage**: every section, with the patterns/directions/resources it came from
   - scores: lighthouse per category, axe violations, seo high/medium/low, visual review loops, and the user rating
   - feedback, worked, failed
4. Record the owner's feedback with `node scripts/improve.mjs feedback <run-id> <feedback.json>`, using an evidence reference in `projects/<slug>/docs/`. If a run was not traced, create a truthful run record from its handoff and retained command evidence first; unknown token/cost fields stay `null`. Do not invent a passed gate from a historical narrative.
5. Update descriptive `scores[<project_type>] = {used, accepted, avg_rating, perf_impact}` on resources and patterns only when actual outcomes support them. These are observations, not authority to change `trust`, license status or tool permissions. A rating alone never promotes trust.
6. Run `node scripts/improve.mjs diagnose` and dispatch `brain-evaluator` offline when a failure category recurs. Its proposal must name supporting run IDs and a bounded candidate; evaluate against separate targeted, unrelated regression and decline cases. No agent creates owner approval or promotes itself. See `docs/SELF_IMPROVING_BRAIN.md`.
7. Append verified taste feedback to `brain/preferences.md` → Feedback log.
8. Run `node scripts/validate-brain.mjs` and `node scripts/improve.mjs monitor`. Summarize observed outcomes, missing data and any trust review request. A trust-level change needs separate source-rights verification and owner review.
