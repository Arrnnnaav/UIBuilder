# Portfolio priorities and risks

Product-manager reconciliation, 2026-09-28, against D30 and current candidate
evidence. G3 is satisfied in `STATE.md` and `QA_REPORT.md`; no G3 work is listed as
open. Approved product scope is unchanged. Orchestrator retains dispatch and gate
authority.

## Ordered remaining work

| Order | Priority | Work | Dependency | Agent | Acceptance |
|---|---|---|---|---|---|
| 1 | Must / S7 | Deploy the G3 candidate and verify the observed URL, canonical/entity/PDF URLs, sitemap, robots, contact endpoint and SEO output. Keep custom domain deferred. | G3 satisfied; deployment access | ship/growth | A19 |
| 2 | Must / S7 | Review deployed contact and telemetry settings. Use owner-controlled credentials for enabled providers, otherwise preserve direct-email fallback and monitoring no-op behavior. Never release E2E keys or `CONTACT_DRY_RUN`. | Deployed site; owner-controlled provider configuration if enabled | backend/ship | A22 |
| 3 | Must / S7 | Dogfood BusinessOS `/connect`; demonstrate editable-path limits, owner-approved PR and separate publish approval. | Deployed site; owner GitHub credentials and approvals | orchestrator/ship | A21 |
| 4 | Must / S7 | Produce playable launch video and schema-valid `/learn` build memory from the delivered site and measured outcomes. | Deployed/verified site | ship/orchestrator | A20 |
| 5 | Follow-up / portability | Establish and review Linux static visual-snapshot baselines, then validate remote CI against the pushed candidate. Keep current Windows candidate snapshots and results; treat this portability task as post-G3 follow-up. | Snapshot conventions and remote CI run | ship/frontend | CI portability evidence; not a G3 gate |

## Current evidence and remaining risks

| Risk / decision | Impact | Evidence | Mitigation / owner | Status |
|---|---|---|---|---|
| No production deployment is evidenced. | Public URL and post-deploy metadata/endpoint behavior cannot yet be verified. | `docs/STATE.md`; `docs/DEPLOY.md`; A19 | Deploy the accepted G3 candidate and run endpoint/SEO smoke checks / ship+growth | Open S7 task |
| Provider credentials and receipts are owner-controlled release settings. | Real email or telemetry receipt cannot be claimed without configured providers and deployment. | `docs/SECURITY_REPORT.md`; `docs/QA_REPORT.md`; A22 | Configure only explicitly enabled providers after deployment; absent keys retain verified safe fallback/no-op / backend+ship | Unavailable until release configuration; no G3 blocker |
| BusinessOS real-site connection and approvals have not been exercised. | Automated maintenance handoff is not demonstrated on the live portfolio. | BusinessOS connector contract; A21 | After deployment, exercise `/connect`, owner-approved PR, then separate publish approval / orchestrator+ship | Open S7 task |
| Launch artifact and build memory are not recorded. | Delivery story and measured outcomes are not packaged for the owner. | `brain/builds/portfolio.json`; A20 | Create launch video and `/learn` memory after deployed-site verification / ship+orchestrator | Open S7 task |
| Linux snapshot baseline and remote CI validation are pending. | Cross-platform snapshot/CI portability remains unverified; current local Windows E2E evidence passes. | `e2e/__snapshots__/win32/*-static-pilot/`; `.github/workflows/sites.yml`; A05/A15 | Establish Linux baselines and run remote workflow on pushed source / frontend+ship | Follow-up only; not a G3 blocker |
| Search rankings, AI citations and hiring outcomes need post-launch observation. | Technical SEO cannot guarantee third-party visibility or recruiting outcomes. | `docs/GROWTH_REPORT.md`; product outcome check in `ACCEPTANCE.md` | Track observed results after launch without promising outcomes / growth | Expected measurement |

## Resolved owner decisions (do not reopen)

- **License:** owner selected Apache 2.0 with explicit patent terms; root license and
  notices are recorded.
- **Styleguide indexing:** owner chose indexable. `/styleguide` is public/indexable;
  `/e2e-error` remains internal/noindex.
- **Architecture:** D30 selects 12 Astro static content routes by default, with Next
  retaining API/headers/error handling and `PORTFOLIO_STATIC_PILOT=0` rollback.
- **Domain:** custom domain is deferred. Provisional Vercel hostname is not evidence
  of a live deployment.
- **Optional providers:** real credentials and receipts are release configuration.
  G3 verifies safe no-key behavior; never release E2E keys or `CONTACT_DRY_RUN`.
- **Claims:** supplied resume authorizes Dehurdle attribution; LinkedIn, residence,
  availability and pending-source metrics remain omitted until confirmed/sourced.

## G3 evidence summary

Current reports record a clean default build, SEO audit with zero findings, clean
security/dependency audit, 46 passing unit tests, 202 passing browser checks with two
expected skips across Chromium/WebKit at 390/1440, and all 12 Lighthouse route/device
combinations passing with all categories at 100. Mobile LCP is 1356-1359ms and desktop
LCP 327-329ms; every measured CLS is below 0.1. A17 and A18 are verified. See
`ACCEPTANCE.md`, `QA_REPORT.md`, `PERF_REPORT.md` and the dated evidence files.
