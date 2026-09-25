# SEO / AEO / GEO STRATEGY — portfolio

> Growth agent, S1, 2026-09-25. Inputs: `docs/PRODUCT.md`, `docs/CONTENT_SOURCE.md`, `pipelines/portfolio/*`, `brain/seo-rules/aeo-geo.json`. SERP checks were run the same day with WebSearch (US index). Every fact below traces to CONTENT_SOURCE: **[R]** is the résumé, **[GH:repo]** is the public repo. **TODO(owner)** marks an item the owner must confirm before S4 publishes it. No data files are written in S1.

## Entities (who or what this site is about; sameAs profiles)

### Primary entity: Person
| Property | Value | Status |
|---|---|---|
| `name` | Arnav Khandelwal | [R], GitHub profile |
| `jobTitle` | Software Engineer | [R] |
| `description` | Backend and AI engineer who builds local-first LLM systems and measures them | PRODUCT one-line, option 1. The owner picks at G1 |
| `alumniOf` / `affiliation` | CollegeOrUniversity "Malaviya National Institute of Technology Jaipur" (MNIT Jaipur), B.Tech Electrical Engineering, Aug 2023 onward. `sameAs` → `https://en.wikipedia.org/wiki/Malaviya_National_Institute_of_Technology_Jaipur`, `https://mnit.ac.in` | [R]. A linked, well-known institution is the strongest disambiguator we have (see collisions below) |
| `knowsAbout` | Python, Java, SQL, FastAPI, Spring Boot, PyTorch, Transformers, LLMs, RAG, LangChain, Ollama, Docker | [R] skills list, verbatim |
| Experience | Backend Engineering Intern, Dehurdle, Jun–Aug 2026 | [R]. **TODO(owner):** PRODUCT open question 4 asks whether Dehurdle may be named publicly. Until confirmed, schema omits Dehurdle and copy says "a backend internship" |
| `award` | "Bronze, Asian Championship (skating), 2018" | [R]. Amazon ML Summer School '25 goes in the description or `knowsAbout` context, not in `award` (it is a programme, not a prize). JEE Main 98.6 percentile goes in the About copy only |
| `address` | `addressLocality: Jaipur`, `addressCountry: IN` | **TODO(owner):** inferred from MNIT; GitHub has no location |
| `email` | none until confirmed | **TODO(owner):** `arnavkhandelwal446@email.com` looks like a typo. Never publish it unconfirmed |
| `image` | none | **TODO(owner):** headshot missing. Person schema ships without `image` rather than with a placeholder |
| `url` / `@id` | `{SITE_URL}/` and `{SITE_URL}/#person` | **TODO(owner):** no domain yet (PRODUCT open question 10) |

### sameAs
| Profile | URL | Status |
|---|---|---|
| GitHub | `https://github.com/Arrnnnaav` | verified (gh API) |
| LinkedIn | `https://www.linkedin.com/in/arnav-khandelwal` | **TODO(owner): UNVERIFIED.** The SERP shows 40+ LinkedIn profiles named Arnav Khandelwal, most with numeric suffixes (for example `arnav-khandelwal-13b6851a2`, `arnavkhandelwal`). The bare `arnav-khandelwal` handle may belong to someone else. Do not add it to `sameAs` until the owner pastes his own URL |
| X / Twitter | none known | TODO(owner): add if one exists |
| Crunchbase, Google Business Profile | not applicable to a student Person entity | skip |

### Secondary entities (one per flagship case study)
Each is `SoftwareSourceCode` with `author` → `{SITE_URL}/#person` and `codeRepository` → the GitHub repo:
1. **Project Edge Node**, `https://github.com/Arrnnnaav/Project-Edge-Node` (Python, FastAPI, Ollama)
2. **Cited Multi-Agent Researcher**, `https://github.com/Arrnnnaav/Cited-Multi-Agent-Researcher` (Python, TypeScript, FastAPI, Gemini)
3. **LedgerBridge (AI Finance Controller)**, `https://github.com/Arrnnnaav/LedgerBridge-AI-` (Python)
4. **GhostCursor**, `https://github.com/Arrnnnaav/AIOS` (Python, Windows UI Automation, Ollama)
5. **NeuroUX**, `https://github.com/Arrnnnaav/neuroux` (Python, TypeScript, PyTorch, Next.js)
6. **StudyOS**, `https://github.com/Arrnnnaav/StudyOS-Hackathon` (TypeScript, Next.js, AWS). It also has a live demo URL; that goes in the case study as a link only after its uptime is checked
7. *(pending)* BusinessHQ: no entity until the owner supplies material

### Name-collision finding (drives the whole strategy)
The query `"Arnav Khandelwal"` returns other people with the same name: ZoomInfo pages (a Nike retail associate, a software developer at Currency in Irvine, a BITS Pilani NSS member), LinkedIn profiles (Medtronic IT analyst, TCU, UC Davis / Davis Consulting Group), a LinkedIn directory with "40+ profiles", and a FIDE chess profile. `Arnav Khandelwal MNIT Jaipur` returns nothing about this Arnav. The SERP is unowned and crowded. Winning it depends on **consistent disambiguators everywhere**, not only on this site:
- **Canonical descriptor:** "Arnav Khandelwal, backend and AI engineer, MNIT Jaipur". Use it in the home title, the Person `description`, the llms.txt summary, the OG image, and (owner actions, off-site) the GitHub bio and the LinkedIn headline.
- **Owner actions, off-site, $0, high impact** (not our files; listed in the handoff):
  1. Set the GitHub profile `name`, `bio`, `location` and `blog` (= the site URL). All four are empty today.
  2. Create a profile README repo `Arrnnnaav/Arrnnnaav` (it currently returns 404) that links to the site.
  3. Put the site URL in the LinkedIn "Website" field and the Contact info.
  4. These reciprocal links plus `rel="me"` on the site close the identity loop for Google and answer engines.

## Intent map
Slugs are proposed here for ux to confirm in IA.md (IA.md is still the empty template).

| Route | Primary query | Secondary | Intent |
|---|---|---|---|
| `/` | Arnav Khandelwal | Arnav Khandelwal MNIT Jaipur; Arnav Khandelwal software engineer; Arrnnnaav | Navigational (recruiter verifying a candidate) |
| `/work` | Arnav Khandelwal projects | backend AI engineer portfolio FastAPI; local LLM projects portfolio | Navigational + evaluation |
| `/work/edge-node` | offline LLM telemetry classifier FastAPI Ollama | Ollama localhost slow IPv6 127.0.0.1 fix; Qwen3 4B latency benchmark TTFT VRAM | Informational (debugging story is the long-tail hook) |
| `/work/cited-researcher` | cited multi-agent research system FastAPI Gemini | orchestrator subagents citation agent LLM judge; asyncio parallel research agents | Informational / evaluation |
| `/work/ledgerbridge` | deterministic bank ledger Razorpay reconciliation | Razorpay Buildathon Track 04; auditable reconciliation exception taxonomy; many-to-one payout batch matching | Informational / evaluation |
| `/work/ghostcursor` | local AI desktop guide that never clicks | Windows UI Automation AI guide VS Code; bounded AI assistant human-in-the-loop | Informational |
| `/work/neuroux` | TRIBE v2 UX scoring | run TRIBE v2 on 4GB GPU; brain activation UX score video text | Informational |
| `/work/studyos` | StudyOS Point & Ask | AWS First Commit Hackathon StudyOS; Chrome extension spaced repetition engineering students | Navigational / informational |
| `/about` | Arnav Khandelwal about | Arnav Khandelwal skills; Arnav Khandelwal experience; Amazon ML Summer School 2025 | Navigational (recruiter due diligence) |
| `/contact` | contact Arnav Khandelwal | hire backend AI engineer intern India | Transactional |
| `/resume` *(only if a PDF is supplied)* | Arnav Khandelwal resume | Arnav Khandelwal CV | Navigational |
| `/styleguide`, `/e2e-error` | none | none | `noindex,nofollow`, excluded from sitemap and llms.txt |

### Title seeds for S4 (primary keyword first, brand last, 10–70 chars)
- `/`: "Arnav Khandelwal · Backend & AI Engineer, MNIT Jaipur" (on the home page the name is the primary keyword)
- `/work`: "Projects: Local-LLM Backends & AI Systems · Arnav Khandelwal"
- `/work/edge-node`: "Edge Node: Offline LLM Telemetry Classifier · Arnav Khandelwal"
- `/work/ledgerbridge`: "LedgerBridge: Auditable Razorpay Reconciliation · Arnav Khandelwal"
- `/work/ghostcursor`: "GhostCursor: Local AI Desktop Guide · Arnav Khandelwal"
- Descriptions lead with the outcome and one sourced number (for example "5.36s → 0.97s mean latency over 50 requests").

## Answer-engine questions (the questions buyers ask; each gets an answer-first block)
Each question becomes an `h2`/`h3` question heading followed immediately by a direct 40–60 word answer (rule `no-answer-first-block`), and feeds that page's FAQPage schema. The seeds below are drafts; S4 finalises the wording. No answer may add a claim that is missing from CONTENT_SOURCE.

### Home (`content/faq/home.json`)
1. **What does Arnav Khandelwal do?** Seed (≈50 words): "Arnav Khandelwal is a software engineer and Electrical Engineering student at MNIT Jaipur. He builds backends and AI systems, mostly local-first LLM services in Python and FastAPI, and benchmarks them. During a 2026 backend internship he cut an offline telemetry service's mean latency from 5.36s to 0.97s." [R][GH:Project-Edge-Node]
2. **What has Arnav Khandelwal built?** Six flagships, one clause each, with the headline number: LedgerBridge 103,049 records at 5.114s median (n=5); GhostCursor 361 hermetic tests and 27/30 raw intent accuracy; NeuroUX video inference 50 min → ~80 s; Cited Researcher; StudyOS (live AWS deploy); Edge Node. [GH]
3. **Is Arnav Khandelwal available for internships or full-time roles?** **TODO(owner):** PRODUCT names recruiters hiring for internships and then new-grad roles as the audience, but the owner has not stated availability, start dates or remote/relocation preferences. The answer stays blocked until he does. Never invent dates.
4. **What tech stack does Arnav Khandelwal use?** Python, Java, SQL; FastAPI, Spring Boot; PyTorch, Transformers; LLMs, RAG, LangChain, Ollama; Docker. [R] Add examples from repos: Pydantic, asyncio/SSE, Next.js, AWS (DynamoDB, ECS). [GH]
5. **How does Arnav verify the numbers on this site?** Every result links to its source: a committed benchmark report, a README table with n= and method, or "résumé-attested" where no public source exists. This is the site's differentiator and a strong GEO signal. It depends on the owner's answer to PRODUCT open question 6.

### About (`content/faq/about.json`)
6. **Where does Arnav Khandelwal study?** B.Tech Electrical Engineering, MNIT Jaipur, since Aug 2023. [R]
7. **What was Arnav's backend internship?** Backend Engineering Intern, Jun–Aug 2026: an offline FastAPI telemetry service with Pydantic validation, retry/backoff and Docker Compose. Latency went from 5.3s to 1.0s after he fixed IPv6-first localhost DNS. [R] Naming Dehurdle is gated on owner consent.
8. **What recognition has Arnav received?** Amazon ML Summer School '25; JEE Main 98.6 percentile; Asian Championship skating bronze (2018). [R]

### Contact (`content/faq/contact.json`)
9. **How do I contact Arnav Khandelwal?** Use the contact form (Turnstile-protected), or email once confirmed, GitHub and LinkedIn once verified. **No response-time promise** unless the owner states one.

### Case studies (`content/faq/work-<slug>.json`, 1–2 each, optional but recommended for long-tail AEO)
- Edge Node: "Why was the local Ollama API slow on localhost?" (IPv6-first resolution of `localhost`; switching to `127.0.0.1` took mean latency from 5.356s to 0.973s). [GH benchmark_report.md]
- LedgerBridge: "Does an AI decide the matches?" (No. A deterministic 3-pass matcher decides; an optional local model only narrates, read-only.) [GH]
- GhostCursor: "Does GhostCursor control the mouse?" (No. It highlights one control, waits for the human and verifies the result.) [GH]
- NeuroUX: "Can TRIBE v2 run on a 4 GB laptop GPU?" (Yes, with 4-bit NF4 LLaMA for text and fp16 V-JEPA2 for video.) [GH]

## Schema plan (route → JSON-LD types)
All nodes use `@context: "https://schema.org"` and stable `@id`s rooted at `{SITE_URL}`. The Person node is defined once (`content/schema/person.json`, which replaces the starter's `organization.json`) and referenced by `@id` everywhere else.

| Route | JSON-LD types | Notes |
|---|---|---|
| every page (layout) | `Person` (`#person`), `WebSite` (`#website`, `publisher`/`author` → `#person`, `inLanguage: en`) | Satisfies `missing-org-schema` on `/`. `sameAs` must hold at least GitHub, or `missing-sameas-entities` fires |
| `/` | `WebPage` (`about` → `#person`), `FAQPage` (from `faq/home.json`) | No SearchAction; the site has no search |
| `/about` | `ProfilePage` (`mainEntity` → `#person`, `dateModified`), `BreadcrumbList`, `FAQPage` (from `faq/about.json`) | ProfilePage is Google's supported type for a person's profile page |
| `/work` | `CollectionPage` + `ItemList` of the six `SoftwareSourceCode` `@id`s, `BreadcrumbList` | |
| `/work/[slug]` | `SoftwareSourceCode` (`#project`: `name`, `description`, `codeRepository`, `programmingLanguage`, `author` → `#person`, `dateModified` = last push), `Article` for the case-study write-up (`author` → `#person`, `about` → `#project`, `headline`, `datePublished`, `image` once screenshots exist), `BreadcrumbList` (Home › Work › Project), optional `FAQPage` | `Article` with `author` pre-empts `missing-author-eeat` / `missing-article-schema` if the audit classes case studies as articles. NeuroUX adds a `VideoObject` only once the demo video is hosted in a way that renders (the repo `.mp4` raw URL is not a watch page) |
| `/contact` | `ContactPage` (`about` → `#person`), `BreadcrumbList`, optional `FAQPage` | Person `email`/`contactPoint` stays empty until confirmed |
| `/resume` | `WebPage` + `BreadcrumbList` if the route ships | |
| `/styleguide`, `/e2e-error`, 404 | none | noindex |

## llms.txt outline
```
# Arnav Khandelwal

> Backend and AI engineer and B.Tech Electrical Engineering student at MNIT Jaipur (India). Builds local-first LLM systems and backends in Python/FastAPI and Java/Spring Boot, and publishes measured results with their sources.

## About
- [About]({SITE_URL}/about): education, 2026 backend internship, skills, recognition (Amazon ML Summer School '25)
- [Contact]({SITE_URL}/contact): contact form; GitHub https://github.com/Arrnnnaav

## Selected work
- [Project Edge Node]({SITE_URL}/work/edge-node): offline FastAPI + Ollama telemetry classifier; mean latency 5.36s → 0.97s over 50 requests
- [Cited Multi-Agent Researcher]({SITE_URL}/work/cited-researcher): orchestrator + parallel search agents + citation agent returning cited answers; 33 unit tests
- [LedgerBridge]({SITE_URL}/work/ledgerbridge): deterministic, auditable bank/ledger/Razorpay reconciliation; 103,049 records at 5.114s median (n=5)
- [GhostCursor]({SITE_URL}/work/ghostcursor): local Windows AI guide that points at the next control but never clicks; 361 hermetic tests
- [NeuroUX]({SITE_URL}/work/neuroux): Meta TRIBE v2 brain-response UX scoring on a 4 GB GPU; video inference 50 min → ~80 s
- [StudyOS]({SITE_URL}/work/studyos): learning workflow with a Chrome "Point & Ask" extension, deployed on AWS

## More work
- [All projects]({SITE_URL}/work): agents & evaluation, retrieval & NLP, hyperspectral classification, computer vision

## Optional
- [Résumé]({SITE_URL}/resume): only if the PDF is supplied
```
Rules: numbers match the case-study pages exactly (S4 copies them from the same content source). Edge Node's line drops the Dehurdle name unless the owner consents. Cited Researcher's 152s→26s stays out of llms.txt while it is [R only] and unconfirmed.

## AI crawler policy (allow/deny: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot)
- **Allow:** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended. For a job-seeker's portfolio, being present in model training data and in AI answers is the goal: recruiters increasingly ask assistants "who is X".
- **Deny:** CCBot (the pipeline default).
- **Disallow paths for all agents:** `/styleguide`, `/e2e-error`, plus `/api/` if backend adds any.
- This matches the starter's `content/seo/crawlers.json`, so S4 needs no policy change. The owner can flip any bot later through BusinessOS (`crawler_policy`). `robots.ts` must never block the five audited bots, or `ai-crawlers-blocked` (high) fires.

## Internal linking plan
- **Home** → all six case studies (work grid), `/about`, `/contact`; the FAQ answers link to their proof page (for example the stack answer links to `/about`, the "what has he built" answer to `/work`).
- **/work** → every case study, plus outbound links to "more work" repos.
- **Each case study** → previous/next case study, one or two related ones (Edge Node ↔ GhostCursor, which share local Ollama + Qwen3 4B; Cited Researcher ↔ LedgerBridge, which share evidence/audit discipline), its GitHub repo, `/contact` as the closing CTA, and a visible breadcrumb matching BreadcrumbList.
- **/about** → the case studies it mentions (the internship → Edge Node), GitHub and LinkedIn with `rel="me"`.
- **Footer (all pages)** → GitHub (and LinkedIn once verified) with `rel="me"`, `/llms.txt` need not be linked.
- Anchor text is descriptive ("LedgerBridge reconciliation case study"), never "click here" or a bare "View".

## Competitors / SERP + AI-answer notes
Checked 2026-09-25 (WebSearch, US index).

| Query | Who ranks | This entity? | Takeaway |
|---|---|---|---|
| `"Arnav Khandelwal"` | ZoomInfo ×3 (Nike, Currency, BITS Pilani), LinkedIn ×5 incl. 40+ profile directory, FIDE chess profile | No | Namesake-dominated. Needs the disambiguators and off-site links above |
| `Arnav Khandelwal MNIT Jaipur` | MNIT reports, unrelated Khandelwal Wikipedia pages | No | Low competition. The About page + Person `alumniOf` MNIT can own this query quickly |
| `Arnav Khandelwal software engineer backend AI FastAPI` | Aditya Khandelwal (adityakhandelwal.dev), Arnav Deepaware (arnavd.co), Arnav Kulkarni | No | Near-namesake portfolios exist. Our title must contain the full name + "backend & AI" |
| `Arrnnnaav github` | GitHub repos smb-safeops, BuisnessHQ, StudyOS-Hackathon, LearningHQ; awesomeclaudeplugins.com lists learning-hq-plugin | Yes (repos only) | The handle is indexed but points to no site. **Note:** smb-safeops and BuisnessHQ appear as indexed GitHub pages although CONTENT_SOURCE lists them as private; owner should check their visibility |
| `backend AI engineer portfolio FastAPI local LLM` | GitHub portfolio repos (sasideep0053-ui, code-shubhambhatt, mike-elio), dev.to/hashnode tutorials, job boards | No | Generic head term dominated by GitHub + tutorials. Win long-tails via case studies instead |
| LedgerBridge query | 9+ Razorpay Buildathon Track 04 repos (ledgerlens, ledgerloop, LedgerProof, razorpay-ledgerguard, parity, recon-ai-finance-controller…) | No | Crowded peer field. Differentiate on the published scale benchmark and honesty about evidence limits |
| GhostCursor query | `ghost-cursor` npm/Puppeteer library (Bright Data, Scrapeless, DeepWiki), a Chrome extension, Ghosthand MCP | No | **Hard name collision.** Always pair the name with "local AI desktop guide"; the slug stays `ghostcursor` but titles lead with the descriptor |
| Cited Researcher query | adityamhaske/Multi-Agent-Research-Assistant and other LangGraph research-agent repos | No | Crowded. Lean on the "query type decides how many agents run" angle |
| NeuroUX query | ndpvt-web/neuroscore, CortexLab, TRIBE v2 explainer blogs, arXiv | No | Emerging topic; "run TRIBE v2 on a 4 GB GPU" is a real, underserved long-tail |
| StudyOS query | **Arrnnnaav/StudyOS-Hackathon ranks #1**; snipt, StudyO (studystudio.us) | Yes (repo) | Only project already found. The case study should link the repo and vice versa |
| Edge Node query | Ollama/Qwen3 tutorials | No | Generic name. The IPv6/localhost latency story is the unique hook |

### AI-answer check
The search tool's synthesized answer acts as a proxy for an answer engine. For "Arnav Khandelwal" it listed five other people and asked for more context. For "Arnav Khandelwal software engineer backend AI FastAPI" it answered "no specific profile found". For the StudyOS query it described the project accurately from the GitHub README and cited `Arrnnnaav/StudyOS-Hackathon`. **Conclusion:** answer engines currently cannot identify this person at all. GitHub READMEs are the only thing they cite, so README quality and a README → site link are part of GEO. Re-run this check after launch and after the owner's off-site actions (S6/S7).
