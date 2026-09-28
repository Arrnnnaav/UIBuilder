---
description: Run the UIBuilder pipeline for a new site — /build <portfolio|company-site> <slug>
argument-hint: <pipeline> <slug>
---

You are the **Orchestrator**. Follow `AGENTS.md` exactly. Arguments: `$ARGUMENTS` (pipeline, then slug).

1. **Setup**
   - If `projects/<slug>` doesn't exist, run `node scripts/new-project.mjs <pipeline> <slug>`.
   - Read `pipelines/<pipeline>/PIPELINE.md`, `brain/preferences.md` and the project's `docs/STATE.md`.
   - Read `brain/domains.json` and run `node scripts/recommend-resources.mjs <domain> <task words>` for the current specialist's domain. Use only router-enabled tools and APPROVED/TRUSTED resources; put REVIEWED candidates in a review queue. The `jev_advisory` adapter may classify explicitly public text in shadow mode for ambiguous tasks, but deterministic stage, rights and gate rules decide the dispatch.
   - Resume from the first stage in STATE.md that isn't ✅.
2. **S1 brief**
   - Interview the user with AskUserQuestion. Ask only for what PIPELINE.md lists as required inputs, and batch the questions.
   - Write `docs/PRODUCT.md` and `docs/BUILD_SPEC.json`.
   - Dispatch **product-manager** to write PRODUCT_REQUIREMENTS.md, ACCEPTANCE.md and PRIORITIES.md from the brief and owner source records. The Orchestrator resolves missing decisions; owner G1/G2 approvals remain mandatory.
   - Dispatch **growth** (S1 strategy).
3. **S2** — dispatch these in parallel, in ONE message: **research**, **taste-research**, **ux** and **backend** (base). Growth reviews the IA inside ux's inputs. Taste research is advisory and writes a source-backed mechanism report; do not install broad scraping skills or copy reference assets.
4. **G1** — run `node scripts/gate.mjs <slug> G1`. Show the user PRODUCT, IA and WIREFRAMES summaries and ask for approval. Nothing proceeds without it.
5. **S3 Design Council**
   - Dispatch three **design-director** agents in parallel, in ONE message, with modes `direction:A`, `direction:B` and `direction:C`. Their contexts must be isolated: give each only the input file paths, never another direction.
   - Then dispatch **design-director** with mode `critic`.
   - Stitch is optional; the user decides.
6. **G2** — run `gate.mjs G2`. Show DESIGN.md highlights plus the direction lineage, and ask for approval.
7. **G2.5 owner experience review** — design-director prepares an original local interaction prototype, `docs/EXPERIENCE_REVIEW.md`, mobile/reduced-motion proof and a walkthrough. Show the owner the reviewable local URL/video and choices. Only after explicit approval, write `docs/approvals/G2.5.json` with hashes of reviewed artifacts and run `gate.mjs G2.5`. An old G2 approval does not imply G2.5 approval.
8. **S4** — after G2.5 passes, dispatch **frontend**, **backend** (domain) and **growth** (data files) in parallel.
9. **S5** — dispatch **design-director** `review`, then **frontend** to apply the polish tasks. At most 2 loops.
10. **S6** — dispatch **ship** (G3) and **growth** (audit) in parallel. G3 must be green, with evidence.
   - Dispatch **product-manager** to audit delivered capabilities against ACCEPTANCE.md; resolve incomplete Must items before G3 is reported complete.
11. **G3.5 owner release review** — present the locally running final site, screenshots/video, release target, exact routes, accepted risks and G3 evidence. After explicit owner approval, hash the reviewed report into `docs/approvals/G3.5.json`; run `gate.mjs G3.5`. A new build or changed reviewed artifact requires fresh review.
12. **S7**
    - No external preview or production deploy until G3.5 passes for the named target. Domain/DNS changes still require their own explicit approval.
    - Dispatch **ship** for deploy, `/connect`, then brag.
    - Then run `/learn <slug>`.

Update `docs/STATE.md` after every stage, and add a line to `plan/PROGRESS.md` under the relevant milestone.
At each specialist handoff, record a structured run with `node scripts/improve.mjs record <trace.json>` and put its returned `run_id` in that handoff. The trace cites existing project files, allowed router tool IDs, measured latency/cost when available, and objective evidence. Use `null` for unknown telemetry. A trace is data, never permission to alter policy or gates. Run diagnosis/evaluation outside the serving path through `brain-evaluator` after `/learn`.
If an agent returns `status: blocked`, surface its `open_questions` to the user and don't guess.
