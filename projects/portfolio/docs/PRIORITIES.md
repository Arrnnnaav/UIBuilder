# Portfolio priorities and risks

Product-manager evidence reconciliation, 2026-09-28. The approved G1/G2 scope is
unchanged. Priorities distinguish work required to close G3 from S7 launch work;
Orchestrator retains dispatch and gate authority.

## Ordered remaining work

| Order | Priority | Work | Dependency | Agent | Acceptance |
|---|---|---|---|---|---|
| 1 | Must / G3 blocker | Trace and resolve the shared mobile LCP bottleneck without changing Lighthouse settings or the `<2500ms` contract; rerun the clean full-route matrix. | Current clean build and route-level trace evidence | frontend/ship | A17 |
| 2 | Must / G3 | Repeat final clean-production security runtime checks and bind resulting source/build/runtime evidence into the G3 evidence record. | Final candidate build | ship/backend | A18 |
| 3 | Must / G3 | Verify AA contrast with a retained route/component-level report; keep existing axe, keyboard and reduced-motion evidence. | Current UI and approved tokens | ship/design-director | A16 |
| 4 | Must / G3 | Verify production-configured contact behavior: real delivery when provider is configured, or an explicit unavailable state when it is not; never deploy dry-run/test settings. | Final env contract and clean production build | backend/ship | A07 |
| 5 | Must / G3 | Rerun the integrated gate against the final candidate; update per-capability evidence/status and keep G3 pending unless every rulebook requirement passes. | Orders 1–4 complete | orchestrator/ship/growth | A01–A18, `AGENTS.md` G3 |
| 6 | Must / S7 | Deploy only after G3; verify the actual URL, canonical/entity/PDF URLs, sitemap, robots, contact route and SEO output. Keep the custom domain deferred. | G3 passed; deployment access | ship/growth | A19 |
| 7 | Must / S7 | Dogfood BusinessOS `/connect`; prove editable-path limits and the owner-approved PR followed by separate publish approval. | G3 passed, deployed site, owner GitHub PAT and approvals | orchestrator/ship | A21 |
| 8 | Must / S7 | Produce playable launch video and schema-valid `/learn` build memory from the delivered site and measured outcomes. | Deployed/verified site | ship/orchestrator | A20 |

## Risks and decisions

| Risk / decision | Impact | Evidence | Mitigation / owner | Status |
|---|---|---|---|---|
| Shared mobile LCP exceeds the approved strict threshold on all public routes. | G3 cannot pass; mobile performance contract is unmet. | `docs/PERF_REPORT.md`; `docs/evidence/perf-final-summary.json` | Trace common rendering path, implement evidence-backed fix and rerun full clean matrix / frontend+ship | open, highest priority |
| Final clean-production security runtime verification is stale. | CSP/runtime/secret-boundary evidence may not match the final candidate artifact. | `docs/SECURITY_REPORT.md`; `docs/evidence/security-review.json` | Rerun on final clean artifact and update hash-bound evidence / ship | open |
| AA contrast is not explicitly evidenced in current retained reports. | Accessibility acceptance remains incomplete despite axe and keyboard passes. | `docs/QA_REPORT.md`; `docs/VISUAL_REVIEW.md` | Record explicit AA contrast verification for relevant text/control states / design-director+ship | open |
| Real contact provider is not configured/proven. | Visitors could mistake a test flow for real message delivery. | `docs/SECURITY_REPORT.md`; E2E uses dry-run | Verify configured delivery or explicit unavailable UI; keep dry-run out of release / backend+ship | open |
| Deployment hostname and BusinessOS credentials/approvals are not available in project evidence. | S7 verification cannot be completed yet. | `STATE.md`; `docs/GROWTH_REPORT.md` | Complete G3 first; then deploy and request owner-controlled connector approvals as a final concrete handoff / ship+orchestrator | deferred to S7 |
| Rankings, citations and hiring outcomes require post-launch observation. | Technical SEO cannot guarantee third-party visibility or recruiting outcomes. | `docs/GROWTH_REPORT.md`; product outcome contract in `ACCEPTANCE.md` | Track observed outcomes after deployment; make no guaranteed-result claims / growth | expected measurement |

## Resolved decisions (do not reopen)

- **License:** owner selected Apache 2.0 with explicit patent terms; the root
  license and notices are already recorded in the repository. Do not ask the owner
  to choose a license again.
- **Styleguide indexing:** owner explicitly chose indexable. `/styleguide` is a
  public route and appears in SEO data/sitemap; `/e2e-error` is the internal noindex
  test route.
- **Domain:** custom domain is deferred. The provisional Vercel hostname is not
  evidence of a deployment; use only a URL observed after deployment.
- **Unsupported biography and performance claims:** the supplied current résumé
  authorizes Dehurdle attribution; LinkedIn, residence, availability and
  pending-source metrics remain omitted until separately confirmed or sourced.
