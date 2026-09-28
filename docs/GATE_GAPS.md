# Gate coverage audit

Product-manager audit of `scripts/gate.mjs` and portfolio `e2e/site.spec.ts` /
`scripts/perf.mjs`, 2026-09-26. This is a snapshot of files read during active work;
the Orchestrator owns concurrent fixes. No gate was executed by this audit.

| Rulebook requirement | Observed implementation gap | Required proof/fix |
|---|---|---|
| npm audit high clean | G3 blocks only `pnpm audit --prod`; full audit exit is ignored | Block on complete high-level audit, or explicitly owner-approved policy change |
| security-review no high, CSP, Zod/rate limit/no client secrets | Security header E2E is narrow; gate has no SECURITY_REPORT or review check | Security review plus retained specific verification, not just file presence |
| Monitoring receipt when keys exist; no-op otherwise | Gate has no provider evidence/no-op check | Conditional provider test receipt or meaningful missing-key checks |
| Visual snapshots committed | Gate seeds absent baselines and reruns; does not establish Git-tracked reviewed baselines | Separate baseline creation/review from passing comparison; verify tracked baseline coverage |
| Keyboard navigation works | Current E2E tests skip link and only Contact/Home nav | Full keyboard menu/nav/form tests; WebKit direct focus is not complete tab-order proof |
| Reduced motion respected | axe/screenshots emulate reduced motion; no assertion of animation fallback | Explicit computed/runtime final-state assertion with reduced motion |
| Every page/nav/contact/404/error in four browser/viewports | Route loop covers configured SEO pages, nav only tests two labels; error Retry is untested | Validate four Playwright projects and exercise all intended navigation/recovery flows |
| Lighthouse every page, strict LCP/CLS | perf filters only indexable routes and uses >2500/>0.1, allowing equality | Clarify utility-page scope without quietly reducing bar; use strict boundaries matching `<` |
| Growth route completeness and schema validity | SEO-map loop can never discover a missing actual route by itself | Compare app/project route inventory to SEO map; validate JSON-LD and visible FAQ parity |
| QA and growth reports prove checks | `filled()` compares length/template; valid prose is not execution evidence | Parse/check current run evidence and require applicable security/perf/visual review records |
| G1/G2 owner approval | Gates check artifacts, not the owner's approval event/state | Keep approval as separate mandatory Orchestrator check; artifact gate pass alone is not owner approval |

## Existing useful checks

The gate does execute typecheck, lint, token/content validation, unit tests,
production build, production-server growth/performance checks and browser suite.
Those checks are useful evidence for their actual covered assertions. Their presence
does not prove omitted behavioral requirements or the validity of generated reports.

Root CI intentionally checks the harness only; site CI runs in each independent repository and must not be
reported as full G3. Project-local Actions are not automatically run by the root
repository. Fresh baselines and gate summaries should be inspected before claiming
the complete approved site is finished.
