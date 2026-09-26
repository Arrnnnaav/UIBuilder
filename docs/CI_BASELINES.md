# Standalone site CI and baseline qualification

The root site matrix proves source checks, dependency audit and production builds.
It does not run browser or performance gates. Standalone site workflows under
`projects/*/.github/` become active when the corresponding site is its own repository.

Standalone CI first builds with production defaults, then runs SEO/performance
against that artifact. The bounded readiness probe and server cleanup live in one
step; no undeclared `npx wait-on` dependency is downloaded. A second build explicitly
enables the error-route fixture and Turnstile test keys for the browser suite.
The test artifact is not the production deployment artifact.

## Qualify Linux snapshots deliberately

Linux browser rendering needs its own baselines for Chromium/WebKit at 390/1440.
Ordinary CI uses `--update-snapshots=none`: missing baselines fail, rather than
being generated and reported as a visual pass. A Git-tracked Linux directory is
required up front; the screenshot suite establishes per-route/project completeness.

On a Linux environment matching CI, after the approved visual review:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium webkit
E2E_ERROR_ROUTE=1 CONTACT_DRY_RUN=1 NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA pnpm build
E2E_SKIP_BUILD=1 pnpm test:e2e --update-snapshots=missing
```

Inspect every generated baseline against DESIGN.md and the rendered result, record
review evidence in VISUAL_REVIEW.md, and commit reviewed `e2e/__snapshots__/linux/`
images. Then run normal comparison CI. Baseline generation is qualification work,
not a G3 pass. Do not update snapshots automatically to silence a real regression.

Existing Windows snapshots do not prove Linux comparisons. Until Linux snapshots
are qualified and committed, standalone visual CI remains pending even if the root
source matrix is green. Production deployment must use a clean production build
after the browser artifact; never publish the E2E dry-run/error fixture artifact.
