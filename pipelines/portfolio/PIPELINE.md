# Pipeline: portfolio

**For:** a personal site (developer, designer, founder).
**Host:** Vercel Hobby ($0).
**Entity:** Person.

## Required inputs (S1 interview)
- Name, role, and a one-line positioning ("I build X for Y")
- Bio (3–5 sentences) and location/timezone
- 3–6 projects, each with:
  - title and one-line problem
  - role and stack
  - outcome, as a number if possible
  - 2–4 images and links
- Socials (these become `sameAs`), résumé PDF (optional), contact email
- 3 vibe words, plus anything to avoid
- Domain, if any

## Stages
Standard `AGENTS.md` flow, with these specifics:
- **research:** reference slots lean on the portfolio/studio refs in the brain (poch-studio, moah-studio, noth, meinhard-taxer, airborne-studio, bruno-simon, k95, elu-dev). All of them are inspiration only.
- **design council:** direction B may propose one interactive hero object (pattern `hero-interactive-object`), and only if it lazy-loads after LCP.
- **growth:**
  - Person schema with `sameAs`
  - a home-page FAQ ("What does NAME do?", "Is NAME available for work?", …)
  - an llms.txt that lists the projects

## Definition of Done
`AGENTS.md` §4, plus:
- every project has a case-study page with image `alt` text
- the work index is keyboard-navigable
