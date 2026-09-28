# Growth report: final static and runtime review, 2026-09-28

## Search policy references

- Google's [generative AI Search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) emphasizes useful, original content and foundational SEO; it provides no special length, schema or `llms.txt` shortcut.
- Google's [Google-Extended documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) distinguishes Gemini/Vertex AI use from Google Search crawling, inclusion and ranking.
- Google's [FAQ rich-result update](https://developers.google.com/search/blog/2023/08/howto-faq-changes) limits expected rich-result visibility; the site's FAQ markup mirrors visible answers for consistency without promising enhancements.
- Google's [ProfilePage structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page) supports the Person profile representation; valid markup does not guarantee a search feature.

## Current coverage

- **12 public indexable routes**: home, work index, six case studies, about,
  contact, résumé and the owner-approved public styleguide.
- One internal noindex route: `/e2e-error`. Crawler policy permits the public
  styleguide. CCBot remains denied; configured AI search crawlers remain allowed.
- **30 schema files**, with shared Person/WebSite and route-scoped page,
  breadcrumb and software entities. Case-study Articles cite verified sources.
- **11 answer-first FAQ files**, with at least 40 words per answer, llms.txt and
  the BusinessOS editable-path manifest.
- Every FAQ is rendered from its route data. The full Chromium/WebKit matrix now
  asserts exact visible question/answer parity with FAQPage JSON-LD for all 11
  FAQ files; `/resume` and `/work` now render their existing FAQ content, and
  `/styleguide` no longer duplicates the home FAQ.
- Six case studies, **10 verified metrics** and **one pending-source metric**.
  Verified means corroborated in a public source, not independently rerun here.

## Static review evidence

Command: `node projects/portfolio/docs/final-content-review.mjs`.
Result is recorded in `docs/evidence/content-review.json`:

```text
publicRoutes: 12
internalNoindexRoutes: 1
schemaFiles: 30
faqFiles: 11
projects: 6
verifiedMetrics: 10
pendingMetrics: 1
errors: []
```

The review inspected metadata length bounds/canonicals, schema URLs, manifest/site
URL agreement, metric source IDs and commit-pinned GitHub URLs, FAQ answer lengths,
the visible-metric filter and exact key measurements. The public PDF SHA-256
matches `C:/Users/user/Downloads/resume (2).pdf`:
`e13747b7fdfe5efd7758b9321c25f8049a432f34ad0e30d3d81fc9157a1cfb7a`.
No network, build, browser or performance process ran during this review.

### Current branch recheck, 2026-09-28

Re-ran `node docs/final-content-review.mjs` and `pnpm validate:content` after
the current branch change. The review again reports 12 public routes, one
internal noindex route, 30 schema files, 11 FAQ files, six projects, 10
verified metrics, one pending-source metric, and no errors. The original resume
PDF still matches the published PDF at SHA-256
`e13747b7fdfe5efd7758b9321c25f8049a432f34ad0e30d3d81fc9157a1cfb7a`.

GitHub API lookup resolved all six commit-pinned README/source references in
`content/evidence/*.json` to the exact recorded commit IDs. This verifies that
the citations resolve to immutable commits; it does not independently rerun
the projects' measurements. Current command output is retained in
`docs/evidence/growth-audit-current-2026-09-28.txt`.

## Provenance and numerical precision

The original résumé supplies identity, education and the corrected Gmail address.
The six public READMEs and Edge Node benchmark were previously fetched with
`gh api`; source snapshots and commit-pinned links preserve that provenance.
Repositories were not fetched again during today's final static review.

Edge Node remains **5.356s → 0.973s**, with 50 latency requests and a separate
10-request TTFT sample. LedgerBridge remains **103,049 records / 5.114s median /
five runs**; sealed consistency is not real-world accuracy. GhostCursor remains
**27/30** on the frozen intent set and **361** documented tests. NeuroUX stays
**50 min → ~80 s**, explicitly approximate and experimental. Cited Researcher's
**152s → 26s** is still pending-source and filtered from visible metrics. No demo
uptime, hiring availability, LinkedIn URL or residential location is inferred.

## Changes in this review

- Added the local AI desktop descriptor to GhostCursor's metadata title, addressing
  the documented name collision.
- Route and schema `lastModified` values currently use **2026-09-28** for this
  portfolio content review; they do not represent upstream project release dates.
- Added verified-source citations to case-study Article entities.
- Reconciled report coverage with the owner's public styleguide decision.

## Runtime audit evidence and limits

The current production runtime on 2026-09-28 was audited from the running local server:

```text
$ node scripts/seo-audit.mjs "http://localhost:3402"
seo:audit http://localhost:3402 — 0 findings (0 high)
```

After the earlier server exited, I repeated the same audit against the currently
running clean production build at `http://localhost:3410`:

```text
$ node scripts/seo-audit.mjs http://localhost:3410
seo:audit http://localhost:3410 — 0 findings (0 high)
```

The current branch's local production server on `http://localhost:3410` still
returns HTTP 200 for `/` and `/contact`, with the expected route titles, and
the explicit production SEO audit remains at zero findings. The generic
`pnpm seo:audit` script defaults to port 3000, where no server was listening;
the explicit URL check is the valid runtime result for this run.

This current-session output is retained at
`docs/evidence/seo-audit-growth-resume-2026-09-28.txt`. A direct request to
`/sitemap.xml` returned the 12 intended indexable routes, each with the
provisional Vercel canonical host; it excludes `/e2e-error`. The generated
`/robots.txt` includes the configured AI crawler policy and blocks that test
route. This is a localhost production-build check, not evidence that the
provisional hostname currently serves the build or is indexed.

The output is retained in `docs/evidence/seo-audit-growth-2026-09-28.txt`. The
focused `SEO files are served` Playwright check passed in Chromium and WebKit at
desktop and mobile sizes (4/4; `docs/evidence/seo-robots-current.txt`). A previous
PowerShell attempt to run the full robots test matrix stalled and is retained in
`docs/evidence/seo-robots-stalled-pwsh-attempt.txt`; the successful focused run
is the current robots evidence. The full browser suite separately passed with
198 passes and two expected desktop-only skips, including exact route/FAQ parity
and sitemap/llms checks. The complete mobile Lighthouse matrix still fails the
strict LCP threshold on every public route, so this report does not mark G3 or
deployment passed.

## Remaining launch requirements

Reconcile provisional `https://arnav-khandelwal.vercel.app` URLs against the actual
deployment in site data, manifest, schema IDs, llms.txt and pending résumé evidence.
Verify live sitemap/robots, canonicals, rendered FAQ/schema and contact behavior.
Search Console/indexing requests and reciprocal GitHub links follow deployment
through owner accounts. The custom domain is deferred. Rankings and citations by
generative engines cannot be promised by implementing technical controls.
