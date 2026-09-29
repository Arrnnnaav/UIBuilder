---
description: Create or review the source-backed backlink plan for an external project — /backlinks <slug> [init|validate|report]
---

Use the external project at `D:\UiBuildProj\<slug>` and never create site source in UIBuilder.

1. Read the project's `AGENTS.md`, `docs/BACKLINK_PLAN.md`, `docs/BACKLINKS.json`, `docs/STATE.md`,
   `docs/ACCEPTANCE.md`, `docs/GROWTH_REPORT.md` and current approvals.
2. Use only public, relevant sources. Record candidates in `docs/BACKLINKS.json`; do not send or submit anything.
3. Run `node scripts/backlinks.mjs <init|validate|report> <slug>` from UIBuilder.
4. Write `docs/handoff/link-building.json` and update the project's progress board with evidence.

The command may prepare drafts and reports, but it cannot publish, email, submit to launch directories,
change SEO policy or bypass G3.5.
