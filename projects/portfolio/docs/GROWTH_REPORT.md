# Growth report: final static review, 2026-09-27

## Current coverage

- **12 public indexable routes**: home, work index, six case studies, about,
  contact, résumé and the owner-approved public styleguide.
- One internal noindex route: `/e2e-error`. Crawler policy permits the public
  styleguide. CCBot remains denied; configured AI search crawlers remain allowed.
- **30 schema files**, with shared Person/WebSite and route-scoped page,
  breadcrumb and software entities. Case-study Articles cite verified sources.
- **11 answer-first FAQ files**, with at least 40 words per answer, llms.txt and
  the BusinessOS editable-path manifest.
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
- Used **2026-09-27** consistently for final route/page/Article editorial revision
  dates. These dates describe portfolio revision, not upstream project releases.
- Added verified-source citations to case-study Article entities.
- Reconciled report coverage with the owner's public styleguide decision.

## Runtime audit evidence and limits

The current clean production build was audited from the running local server:

```text
$ node scripts/seo-audit.mjs "http://localhost:3400"
seo:audit http://localhost:3400 — 0 findings (0 high)
```

The fresh result is also summarized in `docs/QA_REPORT.md`; it has 0 findings and
0 high findings. The full browser suite passed with 190 passes and two expected
desktop-only skips. The complete mobile Lighthouse matrix still fails the strict
LCP threshold on every public route, so this report does not mark G3 or deployment
passed.

## Remaining launch requirements

Reconcile provisional `https://arnav-khandelwal.vercel.app` URLs against the actual
deployment in site data, manifest, schema IDs, llms.txt and pending résumé evidence.
Verify live sitemap/robots, canonicals, rendered FAQ/schema and contact behavior.
Search Console/indexing requests and reciprocal GitHub links follow deployment
through owner accounts. The custom domain is deferred. Rankings and citations by
generative engines cannot be promised by implementing technical controls.
