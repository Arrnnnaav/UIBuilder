# Portfolio priorities and risks

Product-manager review, 2026-09-26. Scope follows approved G1/G2 and the owner request
to complete the portfolio and growth setup. Orchestrator owns state and dispatch.

## Ordered work

| Order | Priority | Work | Dependency | Agent | Acceptance |
|---|---|---|---|---|---|
| 1 | Must | Finish evidence-driven pages, six case studies and shared navigation | Existing G2-approved design and S4 data contract | frontend | A01–A05, A12 |
| 2 | Must | Integrate résumé download and confirmed contact, honest optional-provider states | Owner PDF and env schema | backend/frontend | A06–A08 |
| 3 | Must | Validate source-backed growth data, FAQ/schema parity, route coverage and provisional URL consistency | Final page/data shape | growth | A03–A04, A09–A10 |
| 4 | Must | S5 review of approved design; polish at most two loops | Integrated pages | design-director/frontend | A05; timed reader check |
| 5 | Must | Complete full G3 with retained browser/security/perf evidence | S5; all source fixes | ship/backend/growth | A13–A18 |
| 6 | Must | Prepare deploy settings and inspect actual preview/live URL when owner deployment approval is supplied | G3 and account access | ship/growth | A19 |
| 7 | Must | Exercise BusinessOS manifest connection, approved PR/publish flow and record handoff | Accessible Git site/connector; owner approvals | orchestrator/ship | A11 |
| 8 | Must | Create launch artifact and measured build memory | Verified deployed/preview site | ship/orchestrator | A20 |
| 9 | Should | Capture project screenshots/media from owner/public sources | Functional portfolio; source permissions | research/frontend | A02, A05 |
| 10 | Later | Custom domain, indexing observations and AI citation monitoring | Owner domain choice; live site and time | owner/growth | A19; post-launch report |

## Risk register

| Risk | Impact | Evidence | Mitigation / owner | Status |
|---|---|---|---|---|
| Unsupported résumé timing leaks into SEO/HTML | Breaks approved honest positioning | G1 policy; source refresh | Filter pending-source everywhere; content and rendered checks / growth | open |
| NeuroUX extrapolated timing mistaken for measured result | Misleading technical claim | README caveat in CONTENT_SOURCE.md | Omit text baseline; qualify video/hardware/sample / growth | open |
| Provisional hostname treated as observed deployment | Broken canonicals/download/entity URLs | S4_CONTENT_CONTRACT.md | Replace and smoke-check all URLs after deployment / ship | open |
| Contact UI reports success without delivery config | Loses primary conversion | Optional email provider | Explicit unavailable state plus direct email; provider test when configured / backend | open |
| Starter E2E selectors omit new nav and form semantics | Green tests miss real flows or fail incorrectly | Existing site.spec.ts | Align tests with approved accessible labels and exercise all nav / ship | open |
| Gate checks narrower than rulebook | Premature G3 pass | docs/GATE_GAPS.md | Root gate audit/fix and meaningful coverage / orchestrator | open |
| Employer/role/location/private-project assertions | Incorrect or unauthorized public attribution | Open source questions | Omit unsupported specifics; contributor label; owner decision if adding / growth | contained |
| No monitoring keys or provider credentials | Cannot prove live provider receipts | Optional env design | Verify no-op now, receipt evidence only when configured / backend | open |
| New license chosen without owner intent | Wrong redistribution terms | docs/LICENSING.md | Owner chooses MIT/Apache/other before root LICENSE / owner | open |

## Decisions that do not block independent work

Custom domain is deferred explicitly. LinkedIn, residence, employer attribution,
availability and StudyOS solo/team status can remain omitted. BusinessHQ can remain
excluded under the existing source rule. Screenshots/headshot are optional because
approved evidence diagrams provide a usable fallback. Deploy and BusinessOS write
approvals are separate owner actions; all preceding implementation and verification
should be concrete before requesting them.
