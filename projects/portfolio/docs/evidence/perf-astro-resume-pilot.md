# Astro static résumé pilot

Date: 2026-09-28. Branch: `experiment/astro-static-lcp-pilot`.

This is a one-route architecture experiment, not a G3 result and not a migration decision. Astro 7.3.5 statically rendered the existing résumé React component to `/resume/index.html`; the HTML reused the route's existing content and SEO data, the shared portfolio stylesheet, and the supplied PDF. The generated page contains no Next, React hydration, or Astro island scripts.

## Build and runtime checks

- `pnpm exec astro build --root astro-pilot` — passed; one static route generated.
- `pnpm perf -- http://127.0.0.1:3418` with `PERF_ROUTES=/resume`, `PERF_FACTORS=mobile`, `PERF_RUNS=3` — all three runs passed. Detailed results: `perf-astro-resume-pilot.json`.
- Median mobile scores: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1,356ms; CLS 0.002; TBT 0ms.
- Playwright at 390×844 and 1440×900 — HTTP 200, correct title/H1/canonical, 53 links, no horizontal overflow, no page/console errors, and no framework runtime scripts.
- Axe reported 0 violations at both viewport sizes. Built HTML has one set of page and breadcrumb JSON-LD, global Person/WebSite schemas, and the résumé FAQ schema; canonical, robots, Open Graph, and Twitter metadata are present.
- A 390×844 side-by-side screenshot comparison with a fresh production Next build confirmed matching first-fold layout, type scale, spacing, and mobile timeline treatment. Explicit Tailwind source paths were needed for Astro to include the utility classes used by existing app/components.
- A temporary Next.js `beforeFiles` rewrite served the Astro HTML and copied hashed CSS from the production Next server at `/resume`; the existing `/contact` route continued to render its form. Both responses carried the configured CSP. The rewritten `/resume` had no Next chunk scripts or browser errors, its CSS loaded as `text/css`, and a three-run mobile Lighthouse set passed at 1,355ms median LCP. Details: `perf-astro-next-rewrite-pilot.json`.
- The PDF URL returned HTTP 200 as `application/pdf`, 219,089 bytes. Its hash matches the owner-supplied résumé recorded in the content review.
- The CSS is 29,349 bytes. Computed mobile styles resolve Archivo at 17px body and 33px H1, with the desktop nav hidden and mobile fallback visible.

The current full Next production matrix is still authoritative for G3: its 12 mobile routes miss LCP <2,500ms. This one-page pilot shows that static HTML can meet the target on a representative content route. It does not validate the other 11 routes, the interactive navigation/focus behavior, contact submission security, response headers, deployment, or production monitoring. Those are required before any architecture replacement or G3 pass.

## Pilot implementation notes

Files are isolated under `astro-pilot/` except for the shared `public/fonts/archivo-latin.woff2` asset and the Astro dependencies/configuration. Astro emits an additional 191KB React client asset through its integration, but the generated HTML does not reference or request it; a future packaging script should copy only referenced assets. The temporary Next rewrite and copied generated HTML/assets were removed after the test. Next documents `beforeFiles` as running before filesystem routes, which permits this route override ([Next.js rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)). Astro's asset folder is configurable for same-origin packaging ([Astro build.assets](https://docs.astro.build/en/reference/configuration-reference/#buildassets)). The page layout is intentionally a functional prototype: the mobile menu is a native `<details>` fallback and does not yet match the approved full-screen dialog interaction; the shared external-link icon treatment and some metadata details also need design review. Keep this branch as an experiment until full route, interaction, security, and deployment checks are complete.
