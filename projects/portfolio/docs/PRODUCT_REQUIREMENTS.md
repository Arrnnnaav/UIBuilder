# Portfolio product requirements

Product-manager delivery contract, 2026-09-26. Inputs: PRODUCT.md (owner G1
decision and résumé refresh), CONTENT_SOURCE.md, S4_CONTENT_CONTRACT.md, DESIGN.md,
WIREFRAMES.md and STATE.md. This records approved scope; it adds no design direction
and grants no gate approval.

## Audience and outcome

Recruiters and engineering managers hiring backend/AI engineers are primary;
collaborators, hackathon judges and founders are secondary. In 60 seconds the site
should make Arnav's positioning legible: fast, auditable systems with honest numbers.
The visitor can inspect source-backed work, then contact Arnav, open GitHub or download
his résumé. A timed reviewer session can test comprehension; analytics are useful
after launch but cannot prove hiring outcomes.

## Capability map

| ID | Approved capability | User outcome | Authoritative source |
|---|---|---|---|
| P01 | Home, Work, six case studies, About, Contact and Résumé | Clear path from identity to evidence to contact | PRODUCT.md; S4_CONTENT_CONTRACT.md |
| P02 | Six flagship studies: Edge Node, Cited Researcher, LedgerBridge, GhostCursor, NeuroUX and StudyOS | Understand problem, role, approach, outcome and limits | CONTENT_SOURCE.md §4; public source snapshots |
| P03 | Evidence ledgers and source links | Audit every quantitative claim and its caveat | DESIGN.md; content/evidence/*.json; G1 policy |
| P04 | Approved report visual language | Read on mobile/desktop, identify sourced results | DESIGN.md; MOTION.md; WIREFRAMES.md |
| P05 | Contact form and confirmed direct email | Start a conversation without losing form state | WIREFRAMES.md; résumé refresh |
| P06 | Résumé PDF and accessible HTML résumé | Recruiter can read and download owner material | Supplied resume (2).pdf; PRODUCT.md refresh |
| P07 | Route SEO, Person identity, linked case-study schemas and answer-first FAQs | Crawlers and readers receive coherent, factual information | SEO_STRATEGY.md; AGENTS.md §6 |
| P08 | Editable growth files and BusinessOS manifest | Owner-approved maintenance cannot edit arbitrary source | seo.manifest.json; BusinessOS connector contract |
| P09 | Utility pages and recovery | Styleguide supports review; 404/error boundary recover | WIREFRAMES.md |
| P10 | Optional monitoring with clean no-op behavior | Observe visits/errors when configured | AGENTS.md §4/5 |
| P11 | Verified quality and launch handoff | Site is tested and ready to maintain | AGENTS.md G3 and S7 |

## Claim publication policy

- Edge Node: exact 5.356 s → 0.973 s, 50 latency requests, public benchmark source;
  use the source precision in pages, FAQ, metadata, schema and llms.txt.
- LedgerBridge: 103,049 records, 5.114 s median (n=5), with environment/context;
  sealed benchmark consistency is not real-world accuracy. Preserve this caveat.
- GhostCursor: README-reported 27/30 intent accuracy, bounded execution and test
  counts. Counts are repository reports, not fresh runs performed by UIBuilder.
- Cited Researcher: 152 s → 26 s remains pending-source and hidden; public
  architecture/README evidence may be described without that timing claim.
- NeuroUX: omit the mixed extrapolated text baseline; approximate video timing
  must remain hardware-specific, with sample-size limitations explicit.
- StudyOS: use contributor wording, no invented performance/hackathon outcome;
  live-demo status/link requires an observed uptime check.
- BusinessHQ and private repositories remain excluded until usable owner-approved
  public material exists. Employer attribution, LinkedIn, residence and hiring
  availability are omitted until confirmed. Resume-provided email is confirmed.

## Constraints and non-goals

Keep the approved hybrid design, exact precision and restrained motion: no section
scroll reveals, one retract signature with reduced-motion fallback, token colors,
Archivo and literal-code-only Martian Mono. Use owner diagrams/content; no reference
assets or generic stock imagery. No marketing-site auth/database. Free personal
hosting is the target; custom domain is deferred. The provisional Vercel hostname
is configuration only until a deployment is observed.

Custom-domain purchase, new flagship projects, fabricated benchmark results and
automatically published BusinessOS edits are outside this approved build.
