# QA additions: company-site
- Every `/services/[slug]`, `/work/[slug]` and `/blog/[slug]` page passes e2e and axe.
- The Keystatic admin works locally (`/keystatic`) and is excluded from the sitemap and robots.
- The Cloudflare Workers Builds preview posts a preview URL on PRs. BusinessOS relies on this.
- `/privacy` exists whenever PostHog or Sentry is enabled.
