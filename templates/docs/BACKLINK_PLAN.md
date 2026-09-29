# Backlink and authority plan — {{slug}}

This file is the reviewable, source-backed plan for earning references to this site.
It is not a list of purchased links. Every target needs a public source URL, a reason
the audience is relevant, an owner-approved status change before outreach, and evidence
of the published link before it is counted.

## Operating rules

- Keep candidates, outreach, accepted placements and verified links in `docs/BACKLINKS.json`.
- Record the source page used to qualify a target; never invent authority or audience numbers.
- Do not publish, email, submit to Product Hunt, or change a profile without owner approval.
- Reject link farms, paid links with undisclosed sponsorship, copied articles, irrelevant directories,
  automated comments and reciprocal-link schemes.
- A link counts as **verified** only when its public page was checked on `last_checked` and the
  destination, anchor and `rel` attribute were recorded.
- Search Console exports are evidence, not truth about causality. Keep the export date and property.

## Campaign lanes

1. **Profiles and project sources:** GitHub, university/internship profiles and relevant ecosystems.
2. **Editorial:** original technical articles, case studies and interviews with a real audience fit.
3. **Launch/showcase:** Product Hunt, relevant showcases and community launch pages, only when the
   product is public and the launch target has passed G3.5.
4. **Monitoring:** Search Console links export, referring-page checks and quarterly quality review.

Run `node scripts/backlinks.mjs validate <slug>` before a review and
`node scripts/backlinks.mjs report <slug>` to produce `docs/BACKLINK_REPORT.md`.
