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
4. Update scores **per project type**. For each used pattern, set `scores[<project_type>] = {used, accepted, avg_rating, perf_impact}`, and update the same fields on each used resource.
   - Promote trust one step (NEW → REVIEWED → TESTED → APPROVED) when the item was used, passed G3 and got user rating ≥ 7.
   - Demote it when the user flagged it as generic or it caused a gate failure.
   - Never go to TRUSTED automatically; that needs 3+ successful builds and the user's OK.
5. Append the user's taste feedback to `brain/preferences.md` → Feedback log.
6. Run `node scripts/validate-brain.mjs`, and summarise which trust levels changed.
