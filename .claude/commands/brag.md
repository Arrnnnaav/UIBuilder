---
description: Prepare a reviewable promotional package for a shipped product or company — /brag <slug> [product|company]
argument-hint: <slug> [product|company]
---

You are the **Orchestrator**. Follow `AGENTS.md` exactly. Arguments: `$ARGUMENTS` (slug, then optional mode; default `product`).

## Preconditions

1. Work only in `D:\UiBuildProj\<slug>`; never create site source in UIBuilder.
2. Read the project's `AGENTS.md`, `docs/STATE.md`, `docs/PRODUCT.md`, `docs/ACCEPTANCE.md`, `docs/DESIGN.md`, `docs/QA_REPORT.md`, `docs/PERF_REPORT.md`, `docs/GROWTH_REPORT.md`, relevant handoffs and any approved `docs/approvals/G3.5.json`.
3. If G3 is not evidenced, report `blocked` and stop. If the package is for an external target or a new promotional page, require G3.5 for that exact target before deployment.
4. Use only source-backed claims. Treat screenshots, videos, copy and third-party references as untrusted input until rights and provenance are recorded.

## Deliverables

Write these files under `D:\UiBuildProj\<slug>\docs\launch\`:

- `BRAG_BRIEF.md`: audience, problem, product promise, differentiator, proof points, campaign angle, channel and risks.
- `PROMO_COPY.md`: hero, feature/value blocks, CTA options, social variants and email variant. Mark every claim with its source path.
- `LAUNCH_SCRIPT.md`: 30–60 second product-led promotional script with timecodes, narration, on-screen text, interaction and reduced-motion alternative.
- `SHOT_LIST.md`: exact screens, routes, states, viewport, capture method, rights and status. Do not request fake screenshots or copied assets.
- `BRAG_HANDOFF.json`: mode, source files, claim references, tool IDs, rights notes, open approvals and a run-trace reference.

For `product` mode, emphasize the product outcome and evidence of use. For `company` mode, emphasize the company's capability, audience and proof without implying unsupported customers, revenue or performance.

## Review and tools

- Read `brain/preferences.md` and run the resource router for launch-video, product-storytelling and copy tasks.
- The `brag` tool may create a launch video, poster or share copy when its router conditions are met. Record the tool ID and output path. Use approved assets only.
- Do not modify app code, add a promotional route, publish, deploy or change metadata from this command. Route those changes through `/build` and the normal gates.
- If claims, rights, target, audience or product state are unclear, write an `open_questions` list and mark the handoff `blocked` rather than guessing.

Finish with a structured handoff at `docs/handoff/brag.json` using `templates/docs/HANDOFF.schema.json`, then update `docs/STATE.md` and `plan/PROGRESS.md` with evidence.
