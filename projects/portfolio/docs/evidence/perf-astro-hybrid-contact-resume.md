# Astro hybrid pilot: contact and résumé

Date: 2026-09-28. Branch: `experiment/astro-static-lcp-pilot`.

- `pnpm exec astro build --root astro-pilot` — passed; generated static `/contact` and `/resume` pages.
- `PORTFOLIO_STATIC_PILOT=1` production Next build and `next start` — rewrite served the Astro HTML for both routes.
- `PERF_ROUTES=/resume,/contact PERF_FACTORS=mobile PERF_RUNS=3 pnpm perf -- http://localhost:3429` — passed for both routes, each with median performance/accessibility/best-practices/SEO scores 100.
- `/contact` mobile median LCP 1,658ms, CLS 0.001; `/resume` mobile median LCP 1,359ms, CLS 0.002. Individual measurements are in `perf-astro-hybrid-contact-resume.json`.
- Browser smoke checks at 390px and 1440px: both routes returned 200 with CSP from Next, loaded the shared Astro CSS, and emitted no Next chunk scripts. Contact has Turnstile and form controls. Axe reported 0 violations at both widths. Mobile menu focus wrapped at both ends, stayed trapped during repeated Tab, closed on Escape, and restored focus to the trigger. Empty validation and dry-run submit success rendered without browser errors. Cross-origin API POST returned 403.
- `pnpm test` — 45/45; `pnpm typecheck` and `pnpm lint` passed before the final cleanup verification.

This advances the isolated pilot from one static route to two, including a same-origin contact API backed by the shared validation, rate-limit, Turnstile, and Resend handler. The pilot does not yet include home, about, work/case studies, or styleguide. Do not treat it as a production architecture decision or G3 evidence. Next steps: keep the static packaging reproducible, test the complete route set and API against production configuration, then rerun the full G3 matrix before any migration or deployment.
