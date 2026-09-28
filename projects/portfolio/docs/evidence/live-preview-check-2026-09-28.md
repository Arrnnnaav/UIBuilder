# Live preview verification — 2026-09-28

## Deployment state

- Vercel project: `arnav-khandelwal-portfolio`, Hobby scope `arrnnnaavs-projects`.
- Verified deployment: `https://arnav-khandelwal-portfolio-dz7z8450s-arrnnnaavs-projects.vercel.app`, ID `dpl_GZ2Cx1CbLfxbAaZgt6cbRw9SYmnw`, target `preview`, status Ready.
- Preview access is protected by Vercel Authentication. The temporary automation bypass was used only in memory for the checks below and was removed afterward. No bypass credential is recorded here.
- The first CLI deployment was automatically assigned target `production` and two project aliases. Both aliases were removed, then that specific deployment was deleted. A fresh deployment explicitly targeted `preview`; current Vercel project listing shows no production URL, and the alias list is empty.
- The project is not connected to GitHub auto-deploy. No custom domain, production alias, or DNS change was made.

## SEO and content

- The production-built preview passed `node scripts/seo-audit.mjs <preview-url>` with the Vercel bypass header: **0 findings, 0 high**. The audit covered all 12 public routes, `/llms.txt`, `robots.txt`, and `sitemap.xml`.
- Browser checks returned HTTP 200 on all 12 public routes. Every page had one H1, a title, description, canonical, and structured data. Exact route metadata and results are in `live-preview-browser-check-2026-09-28.json`.
- The public preview response includes `X-Robots-Tag: noindex`; canonical URLs still point to the provisional `https://arnav-khandelwal.vercel.app` origin, which returns 404. This is intentional for a protected preview; reconcile canonicals only after the owner selects a stable public host.
- Vercel documents that Preview Deployments receive `X-Robots-Tag: noindex` and that Vercel Authentication protects preview URLs on Hobby. See [Vercel response headers](https://vercel.com/docs/headers/response-headers) and [deployment protection](https://vercel.com/docs/deployment-protection).

## Browser and runtime checks

- Chromium: 12/12 public routes loaded with correct metadata and schema; no console or network errors.
- Mobile widths: `/`, `/work`, and `/contact` loaded at 390px with no horizontal overflow. The mobile menu opened as a modal and closed with Escape.
- Résumé PDF: HTTP 200, `application/pdf`, 219,089 bytes.
- Internal `/e2e-error`: HTTP 404.
- Origin-less `POST /api/contact`: HTTP 403. No message was sent and no provider credentials were configured.
- Desktop and mobile full-page home screenshots are saved alongside this report.

## One-run deployed Lighthouse observation

One Lighthouse run per public route and device profile is in `live-preview-lighthouse-one-run-2026-09-28.json`. Across 24 rows, performance scores were 0.92–1.00 desktop and 0.94–1.00 mobile; accessibility and best-practices were 1.00; LCP was 277–352ms desktop and 856–1,244ms mobile; CLS was ≤0.026 desktop and ≤0.035 mobile.

The full Lighthouse gate exited non-zero because its preview crawlability and AI-discovery fetches see deployment protection and Vercel's `noindex` header: SEO scored 0.58 and agentic-browsing 0.50–0.67. This is not evidence about the future public production domain. The protected live SEO audit, local G3 matrix, and current preview header are recorded separately. The single-run live sweep supplements, but does not replace, the three-run local G3 performance evidence.
