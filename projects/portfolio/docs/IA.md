# INFORMATION ARCHITECTURE — portfolio

> ux agent, S2, 2026-09-25. Inputs: `docs/PRODUCT.md`, `docs/SEO_STRATEGY.md` (intent map, internal linking plan, FAQ plan), `docs/CONTENT_SOURCE.md`, `pipelines/portfolio/PAGES.md`. The slugs proposed in SEO_STRATEGY are **adopted unchanged**. Structure only; no visual styling.

## Route table
Each route's primary keyword comes from SEO_STRATEGY §Intent map. "Crumb" is the visible breadcrumb, which must match the BreadcrumbList JSON-LD.

| Route | Purpose | Primary intent / keyword | Secondary keywords | Crumb | Links to (in-body, beyond global nav/footer) | Index |
|---|---|---|---|---|---|---|
| `/` | Who he is, measured proof, selected work, contact | Arnav Khandelwal (navigational) | Arnav Khandelwal MNIT Jaipur; Arnav Khandelwal software engineer; Arrnnnaav | none | all 6 case studies (work rows and ledger rows), `/work#more-work`, `/about`, `/contact`, source files on GitHub; FAQ answers link to `/work` and `/about` | index |
| `/work` | Full project index: 6 flagships + 6 "more work" groups | Arnav Khandelwal projects | backend AI engineer portfolio FastAPI; local LLM projects portfolio | Home › Work | all 6 case studies, outbound repo links for the 18 "more work" repos, `/contact` | index |
| `/work/edge-node` | Case study: offline FastAPI + Ollama telemetry classifier | offline LLM telemetry classifier FastAPI Ollama | Ollama localhost slow IPv6 127.0.0.1 fix; Qwen3 4B latency benchmark TTFT VRAM | Home › Work › Edge Node | prev `/work/studyos`, next `/work/cited-researcher`, related `/work/ghostcursor` + `/work/neuroux`, repo, `benchmark_report.md`, `/contact` | index |
| `/work/cited-researcher` | Case study: cited multi-agent research system | cited multi-agent research system FastAPI Gemini | orchestrator subagents citation agent LLM judge; asyncio parallel research agents | Home › Work › Cited Researcher | prev `/work/edge-node`, next `/work/ledgerbridge`, related `/work/ledgerbridge` + `/work/studyos`, repo, `/contact` | index |
| `/work/ledgerbridge` | Case study: deterministic, auditable Razorpay reconciliation | deterministic bank ledger Razorpay reconciliation | Razorpay Buildathon Track 04; auditable reconciliation exception taxonomy; many-to-one payout batch matching | Home › Work › LedgerBridge | prev `/work/cited-researcher`, next `/work/ghostcursor`, related `/work/cited-researcher` + `/work/ghostcursor`, repo, README benchmark section, `/contact` | index |
| `/work/ghostcursor` | Case study: local AI desktop guide that never clicks | local AI desktop guide that never clicks | Windows UI Automation AI guide VS Code; bounded AI assistant human-in-the-loop | Home › Work › GhostCursor | prev `/work/ledgerbridge`, next `/work/neuroux`, related `/work/edge-node` + `/work/ledgerbridge`, repo, `/contact` | index |
| `/work/neuroux` | Case study: TRIBE v2 brain-response UX scoring on a 4 GB GPU | TRIBE v2 UX scoring | run TRIBE v2 on 4GB GPU; brain activation UX score video text | Home › Work › NeuroUX | prev `/work/ghostcursor`, next `/work/studyos`, related `/work/edge-node` + `/work/cited-researcher`, repo, demo video, `/contact` | index |
| `/work/studyos` | Case study: StudyOS learning loop + Point & Ask extension, deployed on AWS | StudyOS Point & Ask | AWS First Commit Hackathon StudyOS; Chrome extension spaced repetition engineering students | Home › Work › StudyOS | prev `/work/neuroux`, next `/work/edge-node`, related `/work/cited-researcher` + `/work/neuroux`, repo, live demo (only after uptime check), `/contact` | index |
| `/about` | Bio, timeline, skills mapped to proof, recognition | Arnav Khandelwal about | Arnav Khandelwal skills; Arnav Khandelwal experience; Amazon ML Summer School 2025 | Home › About | `/work/edge-node` (internship), every case study named in the skills map and timeline, `/resume` (if shipped), GitHub + LinkedIn (`rel="me"`), `/contact` | index |
| `/contact` | Contact form + direct channels | contact Arnav Khandelwal | hire backend AI engineer intern India | Home › Contact | GitHub (`rel="me"`), LinkedIn once verified, confirmed email once confirmed, `/work` (after-submit next step) | index |
| `/resume` | **Conditional:** ships only if the owner supplies a résumé PDF. HTML résumé + PDF download | Arnav Khandelwal resume | Arnav Khandelwal CV | Home › Résumé | PDF download, each case study it cites, `/about`, `/contact` | index (only when shipped) |
| `/styleguide` | Internal component/token gallery (starter utility) | none | none | none | none | `noindex,nofollow`, excluded from sitemap + llms.txt |
| `/e2e-error` | Test route that throws, to exercise the error boundary (starter utility) | none | none | none | Home, `/work`, `/contact` (via the error boundary) | `noindex,nofollow`, excluded from sitemap + llms.txt |

Not a route, but part of the IA: the **404 page** (`app/not-found.tsx`, noindex) and the **error boundary** (`app/error.tsx`). Both are wireframed in WIREFRAMES.md.

## Slug rules
- Short, lowercase, keyword-bearing, no dates: `edge-node`, `cited-researcher`, `ledgerbridge`, `ghostcursor`, `neuroux`, `studyos`.
- GhostCursor keeps its slug, but its H1 and title lead with the descriptor "local AI desktop guide" because of the `ghost-cursor` npm name collision (SEO_STRATEGY).
- BusinessHQ has **no route** in V1. If the owner supplies material, it is added as `/work/businesshq` and inserted into the prev/next ring after `/work/studyos`.
- "More work" repos get **no routes**. They live as grouped tiles at `/work#more-work` and link out to GitHub.

## Global navigation
- **Top bar** (pattern `nav-minimal-overlay`): wordmark "Arnav Khandelwal" → `/`; links `Work`, `About`, `GitHub` (external, `rel="me"`); CTA `Contact`. Four items total. `aria-current="page"` on the active link (Work is also current on every `/work/*` page).
- **Footer** (pattern `footer-big-cta`): oversized CTA → `/contact`; sitemap column (Home, Work, About, Contact, Résumé if shipped); a "Case studies" column listing all six with descriptive anchors; profiles (GitHub, LinkedIn once verified, both `rel="me"`); location stamp "Jaipur, India" only once confirmed by the owner.
- **Skip link** "Skip to content" on every page.

## Case-study ring (prev/next order)
edge-node → cited-researcher → ledgerbridge → ghostcursor → neuroux → studyos → (wraps to) edge-node. This order is also the order of the rows on `/` and `/work`.

## Related-case pairs
Grounded in SEO_STRATEGY's internal linking plan, extended to cover all six with a stated reason:
- Edge Node ↔ GhostCursor: both run local Ollama `qwen3:4b-instruct`.
- Cited Researcher ↔ LedgerBridge: both are built around evidence and auditability.
- NeuroUX ↔ Edge Node: both fit model inference into a small local GPU budget.
- StudyOS ↔ Cited Researcher: both return LLM answers grounded in supplied context.
- LedgerBridge ↔ GhostCursor: deterministic logic decides; the model never does.
- NeuroUX ↔ Cited Researcher and StudyOS ↔ NeuroUX fill the second slot on those pages.

## Anchor-text rules
- Descriptive and keyword-bearing, e.g. "LedgerBridge reconciliation case study", "Edge Node benchmark report (GitHub)". Never "click here", "View" or "Read more" alone.
- Outbound links to GitHub say where they go ("source: benchmark_report.md on GitHub") and open in a new tab with a visible external-link marker.

## Content data files that drive the structure (for frontend/growth)
- `content/work/<slug>.json` (or Keystatic collection): case-study fields — title, descriptor, problem, role, stack, dates, 3 approach beats, links, related slugs, media status.
- `content/evidence/<slug>.json`: the **single source of every number** shown on the site (ledger rows). Home, case studies, FAQ answers, OG images and llms.txt all read from it, so a number can never differ between pages.
- `content/work/more-work.json`: the 6 groups and their repos.
- `content/faq/home.json`, `about.json`, `contact.json`, `work-<slug>.json` per SEO_STRATEGY.
