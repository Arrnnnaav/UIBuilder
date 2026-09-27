# Growth report — demo starter

The starter's `/`, `/contact` and `/styleguide` routes are registered. The styleguide is owner-approved as indexable and appears in the sitemap and crawler allowlist. JSON-LD, sitemap, robots.txt, FAQ and llms.txt checks are part of `validate:content` and the live SEO audit.

Command: `pnpm seo:audit` against the production server.
Result: 3 low-severity `missing-sameas-entities` findings (expected placeholder identity data), 0 high findings.

This confirms the scaffold SEO behavior only; it does not represent a client content or launch review. G3 remains pending on styleguide mobile LCP and the required complete evidence record.
