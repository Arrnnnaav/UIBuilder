# USER FLOW — portfolio

> ux agent, S2, 2026-09-25. Built from PRODUCT.md (audience, job to be done, conversions) and SEO_STRATEGY.md (entry queries). Structure only.

**Job to be done (PRODUCT):** within 60 seconds, a visitor believes "this person ships real backends and AI systems, measures them, and is honest about the numbers", then contacts him or opens GitHub.

**Conversions**
- Primary: contact form submitted on `/contact` (or a click on the confirmed email once it exists). PostHog event `contact_submit` (if a key is set).
- Secondary: `outbound_github` (profile or repo), `outbound_linkedin` (once verified), `resume_download` (if `/resume` ships).
- Trust signal, not a conversion, but tracked: `source_link_click`, when a visitor opens the source behind a number. It shows whether the evidence differentiator is used.

## Primary journey — recruiter verifying a candidate (the 60-second test)
Entry: a Google search for "Arnav Khandelwal" or "Arnav Khandelwal MNIT Jaipur", the site URL in a résumé or LinkedIn, or the GitHub profile `blog` link.

1. **`/` hero (0–5 s).** H1 names him with the disambiguating descriptor: "Arnav Khandelwal, backend and AI engineer, MNIT Jaipur", plus the positioning line. Beside it sits one measured result with its source (Edge Node: mean latency 5.36 s → 0.97 s, n=50, source link). The visitor knows this is the right Arnav and sees the site's premise straight away: claims come with sources.
2. **`/` measured-results ledger (5–25 s).** Six rows, one headline number per flagship, each with n=, method and source type. Scanning it gives breadth (backend, agents, fintech, desktop AI, ML, AWS) and rigour.
3. **`/` selected work (25–45 s).** The visitor picks the project closest to the role → **`/work/<slug>`**.
4. **Case study (45 s–3 min).** The sticky rail answers "role, stack, date, outcome" at a glance. The body runs Problem → Approach (3 beats) → Result (ledger + evidence figure) → Links. The visitor may open a source file on GitHub (new tab, so the site stays open).
5. **Case-study end.** Three routes out: the closing CTA "Talk to Arnav about backend or AI work" → `/contact`; next/prev case; related cases.
6. **`/contact`.** Short form (name, email, message) with Turnstile → inline success, and the page offers a next step (see the dead-end check).

Fast path for someone already convinced: the nav `Contact` CTA or the footer's big CTA from any page, which is 1 click to `/contact`.

## Secondary journeys

### S1 — Engineering manager landing from a long-tail query
Entry: a search such as "Ollama localhost slow IPv6 127.0.0.1 fix" or "run TRIBE v2 on 4GB GPU" lands **directly on a case study**, not on home.
1. The case FAQ block (answer-first) or the Approach beat answers the query immediately.
2. The visitor wonders who wrote it. The rail has an author line linking to `/about`, and the breadcrumb Home › Work reveals the rest of the site.
3. Related cases → a second case study → `/about` → `/contact` or GitHub.
Design implication: every case study must stand alone. It restates who Arnav is in one line (the rail's author line) and never assumes the visitor came from home.

### S2 — Recruiter due diligence
Entry: "Arnav Khandelwal about", a click on About, or "Arnav Khandelwal resume".
1. `/about`: bio, then the timeline (MNIT, the internship, Amazon ML Summer School '25, the hackathons), then skills, each mapped to the project that proves it.
2. The timeline's internship row → `/work/edge-node`, and the skills map → case studies.
3. `/resume` if it ships (download is a conversion), otherwise GitHub. Then `/contact`.

### S3 — Hackathon judge or collaborator arriving from a GitHub README
Entry: a README → site link (an off-site owner action in SEO_STRATEGY) lands on `/work/studyos`, `/work/ledgerbridge` and similar.
1. They read the case, then open the live demo (StudyOS, only once its uptime is checked) or the repo.
2. Related case, or `/contact`.

### S4 — Founder looking for a freelance backend/AI builder
Entry: home via a referral.
1. `/` ledger → `/work` (to see breadth, including "More work" groups such as agents & evaluation and retrieval & NLP).
2. `/about` skills map → `/contact`. The message field's placeholder prompts for "what you're building and when".

### S5 — Answer engines and AI crawlers
Entry: `llms.txt`, the sitemap, or a crawl.
1. Each page opens with its H1 and an answer-first lede. The FAQ blocks give 40–60 word direct answers, and every number matches `content/evidence/*` exactly.
2. Links from `llms.txt` lead to the six case studies, `/about` and `/contact`. No JS is needed to read any content: ledgers and diagrams are server-rendered, and diagrams carry text alternatives.

### S6 — Visitor who arrives on a broken or missing URL
404 → the recovery page offers Home, Work (with the six case studies listed) and Contact. An error-boundary crash offers Retry, Home and Contact.

## Dead-end check
Every page must offer a next step that isn't the browser back button.

| Page | Next step(s) inside the content | Next step in chrome (nav/footer) | Status |
|---|---|---|---|
| `/` | ledger rows → case studies; work rows → case studies; "18 more public repos" → `/work#more-work`; bio teaser → `/about`; FAQ answers → `/work`, `/about` | nav + footer big CTA → `/contact` | OK |
| `/work` | 6 case rows; 18 outbound repo links in the group tiles | footer big CTA → `/contact` | OK |
| `/work/edge-node` | Links block (repo, benchmark report); related ×2; prev/next; closing CTA → `/contact` | breadcrumb, nav, footer | OK |
| `/work/cited-researcher` | same set | same | OK |
| `/work/ledgerbridge` | same set | same | OK |
| `/work/ghostcursor` | same set | same | OK |
| `/work/neuroux` | same set + demo video | same | OK |
| `/work/studyos` | same set + live demo link (only after the uptime check) | same | OK |
| `/about` | timeline rows → case studies; skills map → case studies; `/resume` (if shipped); profile links; closing CTA → `/contact` | breadcrumb, nav, footer | OK |
| `/contact` | **Before submit:** direct channels (GitHub, verified LinkedIn, confirmed email). **After success:** an inline confirmation with "While you wait: see the work" → `/work` and GitHub. **On error:** values are kept, an inline error shows, and the direct channels act as a fallback | breadcrumb, nav; the footer's big CTA switches to "See the work" → `/work`, because it would otherwise point at the current page | OK (after the footer variant) |
| `/resume` (conditional) | PDF download; cited case studies; `/contact` | nav, footer | OK |
| 404 | Home, Work, the six case links, Contact | nav, footer | OK |
| error boundary / `/e2e-error` | Retry, Home, Contact | nav, footer | OK |
| `/styleguide` | internal only, noindex; link back to Home | nav | OK (internal) |

**Gaps found and fixed in the wireframes:**
1. `/contact` footer self-link, fixed with the footer variant.
2. The success state had no next step, fixed by adding the "see the work" link.
3. Long-tail visitors landing on a case study had no "who is this" path, fixed with the rail author line → `/about`.
4. StudyOS's live demo may be down, so the link ships only after an uptime check, and the repo link is always present as the fallback.

## Owner-dependent branches (flow changes, not new pages)
- **Email not confirmed:** `/contact` shows the form + GitHub only. No `mailto` anywhere.
- **LinkedIn not verified:** hidden everywhere, including `sameAs`.
- **Résumé PDF not supplied:** `/resume` is not built; remove it from the footer and `/about`.
- **Availability not stated:** home FAQ Q3 is omitted, not stubbed.
- **Dehurdle naming not approved:** copy says "a backend internship (2026)", and the timeline row does not name the company.
- **Résumé-attested numbers not approved** (Cited Researcher 152 s → 26 s): the row is omitted and the Cited Researcher headline falls back to "33 unit tests" (README).
