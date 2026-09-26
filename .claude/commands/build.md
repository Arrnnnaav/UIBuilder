---
description: Run the UIBuilder pipeline for a new site — /build <portfolio|company-site> <slug>
argument-hint: <pipeline> <slug>
---

You are the **Orchestrator**. Follow `AGENTS.md` exactly. Arguments: `$ARGUMENTS` (pipeline, then slug).

1. **Setup**
   - If `projects/<slug>` doesn't exist, run `node scripts/new-project.mjs <pipeline> <slug>`.
   - Read `pipelines/<pipeline>/PIPELINE.md`, `brain/preferences.md` and the project's `docs/STATE.md`.
   - Resume from the first stage in STATE.md that isn't ✅.
2. **S1 brief**
   - Interview the user with AskUserQuestion. Ask only for what PIPELINE.md lists as required inputs, and batch the questions.
   - Write `docs/PRODUCT.md` and `docs/BUILD_SPEC.json`.
   - Dispatch **product-manager** to write PRODUCT_REQUIREMENTS.md, ACCEPTANCE.md and PRIORITIES.md from the brief and owner source records. The Orchestrator resolves missing decisions; owner G1/G2 approvals remain mandatory.
   - Dispatch **growth** (S1 strategy).
3. **S2** — dispatch these in parallel, in ONE message: **research**, **ux** and **backend** (base). Growth reviews the IA inside ux's inputs.
4. **G1** — run `node scripts/gate.mjs <slug> G1`. Show the user PRODUCT, IA and WIREFRAMES summaries and ask for approval. Nothing proceeds without it.
5. **S3 Design Council**
   - Dispatch three **design-director** agents in parallel, in ONE message, with modes `direction:A`, `direction:B` and `direction:C`. Their contexts must be isolated: give each only the input file paths, never another direction.
   - Then dispatch **design-director** with mode `critic`.
   - Stitch is optional; the user decides.
6. **G2** — run `gate.mjs G2`. Show DESIGN.md highlights plus the direction lineage, and ask for approval.
7. **S4** — dispatch **frontend**, **backend** (domain) and **growth** (data files) in parallel.
8. **S5** — dispatch **design-director** `review`, then **frontend** to apply the polish tasks. At most 2 loops.
9. **S6** — dispatch **ship** (G3) and **growth** (audit) in parallel. G3 must be green, with evidence.
   - Dispatch **product-manager** to audit delivered capabilities against ACCEPTANCE.md; resolve incomplete Must items before G3 is reported complete.
10. **S7**
    - Ask the user before any deploy.
    - Dispatch **ship** for deploy, `/connect`, then brag.
    - Then run `/learn <slug>`.

Update `docs/STATE.md` after every stage, and add a line to `plan/PROGRESS.md` under the relevant milestone.
If an agent returns `status: blocked`, surface its `open_questions` to the user and don't guess.
