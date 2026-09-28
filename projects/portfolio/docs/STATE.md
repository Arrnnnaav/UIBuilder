# STATE — portfolio
| Stage | Owner | Status | Artifact | Updated |
|---|---|---|---|---|
| S1 brief | orchestrator/product | ✅ | PRODUCT.md, SEO_STRATEGY.md; G1 passed 10/10 | 2026-09-26 |
| S2 research/UX | research/ux | ✅ | INSPIRATION.md, USER_FLOW.md, IA.md, WIREFRAMES.md; valid handoffs | 2026-09-26 |
| G1 | user | ✅ | Owner-approved positioning and evidence rules | 2026-09-25 |
| S3 design | design-director | ✅ | DESIGN.md, MOTION.md, tokens.css; 3 directions → hybrid | 2026-09-26 |
| G2 | user | ✅ | Approved hybrid design | 2026-09-25 |
| S4 build | frontend/backend/growth | ✅ | 12 indexable Astro static routes, six case studies, data-driven SEO, contact form/API, résumé, styleguide; `pnpm build` packages static pages by default | 2026-09-28 |
| S5 polish | design-director/ship | ✅ | 48 Next baselines and 48 static-candidate baselines; current static browser matrix passes 202 tests with 2 expected desktop-only skips | 2026-09-28 |
| S6 ship | ship/growth | ✅ | Default clean build, typecheck/lint/unit, runtime SEO/security, all-route browser/contrast checks and clean dependency audit pass; static Lighthouse passes all 12 routes on desktop/mobile | 2026-09-28 |
| G3 | automatic | ✅ passed | Default static hybrid candidate meets build, browser, accessibility, security, growth and visual requirements. Three-run Lighthouse: mobile LCP 1357–1359ms, CLS ≤0.035, all categories 100. Evidence in QA_REPORT.md, SECURITY_REPORT.md, PERF_REPORT.md and evidence/. | 2026-09-28 |
| S7 deploy | ship | ⬜ | Not deployed; actual deployment URL and production environment are unverified. Custom domain is deferred; provider receipts are conditional on owner-configured keys. | |
| BusinessOS `/connect` | orchestrator | ⬜ | Connector implementation exists; real-site dogfood needs deployed site and owner GitHub PAT | |
