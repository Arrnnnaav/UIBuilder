# Portfolio priorities and risks

Product-manager evidence reconciliation, 2026-09-28. The approved G1/G2 scope is
unchanged. Priorities distinguish G3 acceptance from S7 release and deployment work;
Orchestrator retains dispatch and gate authority.

## Ordered remaining work

| Order | Priority | Work | Dependency | Agent | Acceptance |
|---|---|---|---|---|---|
| 1 | Must / G3 blocker | Trace and resolve the shared mobile LCP bottleneck without changing Lighthouse settings or the `<2500ms` contract; rerun the clean full-route matrix. | Current clean build and route-level trace evidence | frontend/ship | A17 |
| 2 | Must / G3 | Repeat the current clean-production security/header/client-secret scan and bind evidence to the latest candidate build. | Final candidate build | ship/backend | A18 — complete 2026-09-28; `docs/evidence/security-runtime.txt` |
| 3 | Must / G3 | Rerun the integrated gate against the final candidate; update per-capability evidence/status and keep G3 pending unless every rulebook requirement passes. | Order 1 complete | orchestrator/ship/growth | A01–A18, `AGENTS.md` G3 |
| 4 | Must / S7 | Deploy only after G3; verify the actual URL, canonical/entity/PDF URLs, sitemap, robots, contact route and SEO output. Keep the custom domain deferred. | G3 passed; deployment access | ship/growth | A19 |
| 5 | Must / S7 | Review deployed contact/telemetry configuration: enable real delivery only with owner-configured Turnstile/Resend credentials, otherwise preserve a clear direct-email fallback; collect real telemetry receipts only for keys actually enabled. Never deploy test/dry-run flags. | Deployed site and owner-controlled credentials, if enabling providers | backend/ship | A22 |
| 6 | Must / S7 | Dogfood BusinessOS `/connect`; prove editable-path limits and the owner-approved PR followed by separate publish approval. | G3 passed, deployed site, owner GitHub PAT and approvals | orchestrator/ship | A21 |
| 7 | Must / S7 | Produce playable launch video and schema-valid `/learn` build memory from the delivered site and measured outcomes. | Deployed/verified site | ship/orchestrator | A20 |

## Risks and decisions

| Risk / decision | Impact | Evidence | Mitigation / owner | Status |
|---|---|---|---|---|
| Shared mobile LCP exceeds the approved strict threshold on all public routes. | G3 cannot pass; mobile performance contract is unmet. | `docs/PERF_REPORT.md`; `docs/evidence/perf-final-summary.json` | Trace common rendering path, implement evidence-backed fix and rerun full clean matrix / frontend+ship | open, highest priority |
| Clean-production security runtime/client scan. | Local scan cannot prove the configuration of a future deployment. | `docs/SECURITY_REPORT.md`; `docs/evidence/security-runtime.txt`; QA's 2026-09-28 clean rebuild | Recheck deployed response headers, E2E flags and client bundle during S7 / ship | local candidate verified; deployed check is S7 |
| Real contact and telemetry providers are not configured/proven on a deployed site. | The form cannot send a message and enabled telemetry cannot produce live receipts. | `docs/SECURITY_REPORT.md`; `docs/QA_REPORT.md` | This is unavailable before deployment. For release, either configure providers and verify receipts, or leave telemetry off and provide a clear direct-email fallback; never deploy test/dry-run flags / backend+ship | unavailable until release configuration; not a G3 provider-credential blocker |
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
- **Optional providers:** actual Resend/Turnstile/Sentry/PostHog credentials and
  live receipts are deployment configuration, not assumed G3 evidence. G3 must
  prove safe no-key behavior; release must never use E2E keys or `CONTACT_DRY_RUN`.
- **Unsupported biography and performance claims:** the supplied current résumé
  authorizes Dehurdle attribution; LinkedIn, residence, availability and
  pending-source metrics remain omitted until separately confirmed or sourced.
