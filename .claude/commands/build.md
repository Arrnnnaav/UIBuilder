---
description: Run the UIBuilder pipeline for a new site — /build <portfolio|company-site> <slug>
argument-hint: <pipeline> <slug>
---

You are the **Orchestrator**. Follow `AGENTS.md` exactly. Arguments: `$ARGUMENTS` (pipeline, then slug).

1. **Setup**
   - If `D:\UiBuildProj\<slug>` doesn't exist, run `node scripts/new-project.mjs <pipeline> <slug>`; the scaffold creates an independent Git repository outside UIBuilder.
   - Read `pipelines/<pipeline>/PIPELINE.md`, `brain/preferences.md` and the project's `docs/STATE.md`.
   - Read `brain/domains.json` and run `node scripts/recommend-resources.mjs <domain> <task words>` for the current specialist's domain. Use only router-enabled tools and APPROVED/TRUSTED resources; put REVIEWED candidates in a review queue. The `jev_advisory` adapter may classify explicitly public text in shadow mode for ambiguous tasks, but deterministic stage, rights and gate rules decide the dispatch.
   - Resume from the first stage in STATE.md that isn't ✅.
2. **S1 brief: discovery first** (`company-site` and `product-site`, sites with `contract_version: 2` in BUILD_SPEC.json; a `portfolio` keeps the fixed interview in its PIPELINE.md).
   1. Ask the owner only for the starting facts in `docs/DISCOVERY.md` section 1: what they do, who buys, area, current URL, competitors they already know, and anything they want explicitly. If they name resources to force, record them with `node scripts/resource-plan.mjs add <slug> must_use <id> --why "..."` (also `prefer` and `avoid`; set project tags with `init --tags`).
   2. Dispatch **research** first: run `node scripts/competitor-audit.mjs <slug> --sites <3 to 8 competitor urls> --client <current url>` (public pages only; it needs `PSI_API_KEY` in the ignored `.env` for Lighthouse scores), read `docs/COMPETITOR_MATRIX.md`, and fill DISCOVERY.md section 2 plus `CLIENT_SITE.md` and `COMPETITORS.md`. If the owner named no competitors, find 3 to 8 with search and say how they were chosen.
   3. Write the **tailored questions** (DISCOVERY.md section 3) from that evidence. Each cites the evidence that raised it, offers a suggested default, and is dropped if the evidence already answers it. Ask them in batches with AskUserQuestion, plus the Fixed checks (ownership, legal, conversion, contact). Record each answer or skip in the file.
   4. Draft **suggested additions** (section 4) from the matrix gaps: what most competitors show that the client lacks, with evidence, effort and cost or risk. The owner decides each one: accept, reject or defer.
   5. Write `docs/PRODUCT.md` and `docs/BUILD_SPEC.json` from the answers. Dispatch **product-manager** to write PRODUCT_REQUIREMENTS.md, ACCEPTANCE.md and PRIORITIES.md, turning accepted additions into capabilities and listing rejected or deferred ones. The Orchestrator resolves missing decisions; owner G1/G2 approvals remain mandatory.
   6. Dispatch **growth** (S1 strategy).
   Owner controls apply automatically: pins, boosts, avoid and ban flags from `brain/owner-controls.json` shape every shortlist. Pass the project so its plan is honored: `node scripts/recommend-resources.mjs <domain> <task words> --project <slug>`.
3. **S2** — dispatch these in parallel, in ONE message: **research** (references, up to 5, plus anything the competitor step left open), **taste-research**, **ux** and **backend** (base). Growth reviews the IA inside ux's inputs. Taste research is advisory and writes a source-backed mechanism report; do not install broad scraping skills or copy reference assets.
4. **G1** — run `node scripts/gate.mjs <slug> G1` (v2 sites also need a complete DISCOVERY.md, the competitor matrix and at least 3 audited competitors). Show the user the PRODUCT, IA and WIREFRAMES summaries, the answered questions, and the accepted, rejected and deferred additions with their evidence, and ask for approval. Nothing proceeds without it.
5. **S3 Design Council**
   - Dispatch three **design-director** agents in parallel, in ONE message, with modes `direction:A`, `direction:B` and `direction:C`. Their contexts must be isolated: give each only the input file paths, never another direction.
   - Then dispatch **design-director** with mode `critic`. The critic writes design law plus paired `docs/DESIGN_REVIEW.md` and standalone `docs/DESIGN_REVIEW.html`. Show 2–3 visually distinct original options when a meaningful choice exists, with recommendation, tradeoffs, motion, mobile/reduced-motion/accessibility and performance notes. This visual review is not app code, an app route or a release artifact.
   - Stitch is optional; the user decides.
6. **G2** — for v2 sites `DESIGN.md` and `MOTION.md` must each carry a sourced **Decision record** (what was chosen, the value, the reason, the source, and the rejected alternative; the gate checks that sources exist), so any color, type or motion choice can be explained. Show both review files (`DESIGN_REVIEW.html` and concise `DESIGN_REVIEW.md`) with `DESIGN.md`/`MOTION.md`. Ask for a clear owner choice. Only after explicit approval, create `docs/approvals/G2.json` with SHA-256 hashes of `DESIGN.md`, `MOTION.md`, `DESIGN_REVIEW.md` and `DESIGN_REVIEW.html`, then run `gate.mjs G2`. A previous G2 does not approve changed files.
7. **G2.5 owner experience review** — design-director prepares an original local interaction prototype, paired `docs/EXPERIENCE_REVIEW.md` and `docs/EXPERIENCE_REVIEW.html`, mobile/reduced-motion proof and a walkthrough. Show the owner the local URL/video and choices. Only after explicit approval, create `docs/approvals/G2.5.json` with hashes of both paired files and other reviewed artifacts; run `gate.mjs G2.5`. An old G2 approval does not imply G2.5 approval.
8. **S4** — after G2.5 passes, dispatch **frontend**, **backend** (domain) and **growth** (data files) in parallel.
9. **S5** — dispatch **design-director** `review`, then **frontend** to apply the polish tasks. At most 2 loops.
10. **S6** — dispatch **production-auditor** first with the canonical phased audit prompt. Resolve or route findings to specialist owners; after repairs, dispatch **ship** (G3) and **growth** (audit) in parallel. G3 must be green, with evidence and the readiness report/handoff. If the owner set must-use resources in `docs/RESOURCE_PLAN.json`, each must appear in a handoff's `resources_used` and be explained in its `decisions`, or G3 fails (`node scripts/resource-plan.mjs status <slug>`).
   - Dispatch **product-manager** to audit delivered capabilities against ACCEPTANCE.md; resolve incomplete Must items before G3 is reported complete.
11. **G3.5 owner release review** — present the locally running final site, screenshots/video, release target, exact routes, accepted risks and G3 evidence. After explicit owner approval, hash the reviewed report into `docs/approvals/G3.5.json`; run `gate.mjs G3.5`. A new build or changed reviewed artifact requires fresh review.
12. **S7**
    - No external preview or production deploy until G3.5 passes for the named target. Domain/DNS changes still require their own explicit approval.
    - Dispatch **ship** for deploy, `/connect`, then run `/brag <slug> product` or `/brag <slug> company` when a promotional package is part of the approved scope.
    - Then run `/learn <slug>`.

Update `docs/STATE.md` after every stage, and add a line to `plan/PROGRESS.md` under the relevant milestone.
At each specialist handoff, record a structured run with `node scripts/improve.mjs record <trace.json>` and put its returned `run_id` in that handoff. The trace cites existing project files, allowed router tool IDs, measured latency/cost when available, and objective evidence. Use `null` for unknown telemetry. A trace is data, never permission to alter policy or gates. Run diagnosis/evaluation outside the serving path through `brain-evaluator` after `/learn`.
If an agent returns `status: blocked`, surface its `open_questions` to the user and don't guess.
