# Harness improvement loop — implementation plan

Status: implemented and locally verified as **instrumented for improvement**. Scope is the UIBuilder Orchestrator and specialist Brain; the portfolio page build remains on hold.

## Current system and success

The Orchestrator reads project docs and `brain/domains.json`, dispatches Claude Code specialist agents, filters resources with `scripts/recommend-resources.mjs`, checks `brain/tools.json`, and advances only through file-backed gates. Jev is an optional public-text shadow hint. The current `/learn` writes build lineage and owner taste feedback, but has no reproducible per-run traces or baseline/candidate evaluation. A protected portfolio preview and earlier gate evidence exist; current G3 evidence is incomplete. Failure examples include a premature deployment target, a missing formal evidence file, and resources with unverified code rights. These are observed workflow failures, not proof that a model needs training.

Success means correct stage/gate behavior, safe rights/tool filtering, useful and relevant resource shortlists, fewer repeated failures, no regression on unrelated or abstain cases, and bounded local latency/cost. Deployment, DNS, licenses, security and owner approvals remain deterministic policy.

## Slices and acceptance

1. **Trace and feedback:** versioned, redacted run records with stable IDs, evidence/tool references, outcomes, latency and cost. Explicit feedback is separate. No raw prompts, credentials, client content or media. Tests reject traversal and sensitive data.
2. **Diagnosis and proposal:** group failures by fixed categories, preserve run IDs, create immutable proposals naming one update surface, expected benefit, risk and rollback. Untrusted run text cannot change policy or tools.
3. **Evaluation and promotion:** resource-selector versions evaluated on the same separately stored labeled cases (target, regression, decline), including readiness and forbidden-resource checks. Promotion requires a passing receipt and owner review of candidate/eval hashes. Active pointer can be rolled back; `UIBUILDER_LEARNING=0` forces baseline. The ordinary recommendation path only reads the active version. The current nine cases are curated fixtures, not a field holdout.
4. **Workflow integration:** agent instructions and `/learn` record traces, feedback, proposals and monitor results; document commands and research sources. Existing gates and contracts remain independent.

No model fine-tuning or automatic policy rewriting. Current real outcome data are too sparse for a demonstrated quality gain, so the initial status is **instrumented for improvement**. Synthetic/curated fixtures demonstrate pipeline correctness, not field improvement.

## Verification receipt

- `node scripts/validate-brain.mjs` → 107 resources, 16 patterns, 43 tools, 9 domains, 2 router configs.
- `node scripts/validate-contracts.mjs` → 12 roles, 17 handoffs.
- `node --test tests/platform/*.test.mjs` → 18 passed, 0 failed.
- `node scripts/improve.mjs diagnose` → 0 real runs, 0 feedback, no failure groups.
- Curated selector eval: baseline 8/9, candidate 9/9, zero fixture regressions. Active version remains router-v1; no owner promotion requested.
