# M1 — Skeleton + Designer Brain seed

**Goal:** create the repo skeleton and a brain seeded from `links.docx`.

## Tasks
1. Create the directories: `brain/{patterns,builds,seo-rules}`, `pipelines/`, `templates/{docs,marketing-starter}`, `projects/`, `.claude/{agents,commands,skills}`.
2. Add doc templates in `templates/docs/`: PRODUCT, USER_FLOW, IA, WIREFRAMES, DESIGN, MOTION, SEO_STRATEGY, VISUAL_REVIEW, QA_REPORT, STATE, plus `HANDOFF.schema.json`.
3. `brain/tools.json`: the capability → tool registry with an agent allowlist, cost, `enabled_if` and fallback. Media tools are disabled.
4. `brain/resources.json`: all ~60 links from `C:\Users\user\Downloads\links.docx` with category, usage_mode, best_for, trust and provenance.
5. `brain/patterns/*.json`: seed patterns (hero, nav, case-study, about, contact, footer, motion, faq-answer-first), each with provenance and scores per project type.
6. `brain/preferences.md`: taste memory, starting from the user's stated dislikes (generic gradients, template dashboards, too much glow).
7. `brain/schema/*.schema.json`: JSON Schemas for resource, pattern and build.
8. `scripts/validate-brain.mjs`: validates every brain file against its schema, with no dependencies.

## Done when
- `node scripts/validate-brain.mjs` exits 0.
- `resources.json` has ≥55 entries and every entry has a usage_mode.
