# M6 — Dashboard UI + dogfood on portfolio

## Tasks
1. `apps/dashboard/src/plugins/seo/SeoWorkspace.jsx`: SEO / AEO / GEO tabs, findings grouped by page, a "Propose fix" action.
2. `apps/dashboard/src/core/needs-you/NeedsYouPage.jsx`: the git draft card shows the file diff, a preview link and validator results. Actions are *Approve → PR*, then later *Publish*.
3. Website connection page: repo, branch, domain, host and PAT, saved into the vault.
4. `/connect` in UIBuilder prints the values for this page, or POSTs them to `/api/sites` when running locally.
5. Dogfood: connect the portfolio → audit → approve a JSON-LD/FAQ fix → PR plus preview → publish → verified live.

## Done when
- A real merged `bos/*` PR exists on the portfolio repo.
- The verifier reports VERIFIED.
- The audit-log hash chain is intact.
