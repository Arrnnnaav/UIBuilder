# M5 — BusinessOS: git-site connector + AEO/GEO

Repo: `D:\PROJECTS\abc\business-os`. Spec: `docs/superpowers/specs/2026-09-25-git-site-connector-design.md` (R7).
Note: the repo has a lot of uncommitted user work. Only touch the files listed here, and never reset or stash.

## Tasks
1. `core/integrations/site-connector.mjs`: the interface, `assertSiteConnector()`, and `resolveSiteConnector(tenant, vault)`.
2. `integrations/git-site/connector.mjs`: `GitSiteConnector` over GitHub REST with an injectable `fetch`, plus manifest glob matching.
3. `core/seo/website-auditor.mjs`: add the AEO/GEO finding codes. `plugins/seo/opportunity-engine.mjs`: add the `aeo_gap` / `geo_gap` opportunity types.
4. `plugins/seo/validators.mjs`: per-payload-type validation (meta, jsonld, faq, llms_txt, crawler_policy), keeping the existing grounding rules.
5. `core/runtime/policy-engine.mjs`: add the `site.*` capabilities and hard-denials.
6. `plugins/seo/experiment-service.mjs`: add the git lifecycle states.
7. `apps/server.mjs`: routes `POST /api/sites` (connect), `GET /api/sites/:id/audit`, `POST /api/seo/git/draft`, `POST /api/seo/git/:id/publish`, `POST /api/seo/git/:id/rollback`. The existing WordPress route is left unchanged.
8. Tests: `tests/git-site-connector.selftest.mjs`, `tests/seo-aeo-geo.selftest.mjs`, `tests/site-publish-flow.selftest.mjs`, all added to `npm test`.
9. Export the auditor rule codes to `core/seo/rules/aeo-geo.json`. UIBuilder copies them to `brain/seo-rules/`.

## Done when
`npm test` is green, including the new selftests, and the existing SEO selftests are unchanged.
