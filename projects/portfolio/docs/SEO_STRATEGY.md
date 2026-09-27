# SEO / AEO / GEO STRATEGY — portfolio

> Growth strategy begun in S1 (2026-09-25), reconciled with the shipped portfolio on 2026-09-28. The intent map and initial SERP notes below are historical research, not current instructions. **Current implementation and owner decisions take precedence over S1 drafts.** Facts trace to `docs/CONTENT_SOURCE.md`: **[R]** is the supplied resume and **[GH:repo]** is a public repository.

## Current source of truth (2026-09-28)

- The provisional site URL is `https://arnav-khandelwal.vercel.app`; the owner deferred choosing a custom domain. Reconcile URLs after deployment/domain selection.
- The supplied résumé PDF exists at `public/arnav-khandelwal-resume.pdf`. It confirms `arnavkhandelwal446@gmail.com`, MNIT Jaipur education and the Dehurdle internship. Its hash is in `docs/evidence/content-review.json`.
- The styleguide is public and indexable by owner decision; it is in the sitemap and `llms.txt`. `/e2e-error` is the noindex test route, excluded from the sitemap and `llms.txt`.
- GitHub is the only verified profile identity in `Person.sameAs`. Do not publish a guessed LinkedIn/X identity, residential address, job availability or response-time promise.
- Current GitHub API check: profile name is already Arnav Khandelwal; bio, location and blog are blank; `Arrnnnaav/Arrnnnaav` returned 404. Recheck before off-site actions.
- Visible project claims are tied to immutable public sources in `content/evidence/*.json`. Resume-only Cited Researcher timing remains excluded from visible metrics and `llms.txt`.
- FAQs are direct, evidence-backed answers. UIBuilder's local editorial contract asks for at least 40 words so each answer stands alone; this is not a Google requirement or ranking tactic. Do not pad answers to meet a count.
- `llms.txt` is retained because the UIBuilder SEO contract requires it and other systems may choose to consume it. Google Search says it does not use `llms.txt` for Search or AI features; do not claim it improves Google rankings.
- Google-Extended is allowed by owner policy. It controls eligible use of crawled content for Gemini Apps/Vertex AI; it does not control inclusion or ranking in Google Search.
- FAQ markup mirrors the visible Q&A for parity/interoperability. Google FAQ rich results are generally limited to well-known government and health sites; do not promise a Google FAQ enhancement.

Official guidance checked 2026-09-28: [Google generative AI Search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google-Extended token](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [FAQ rich-result eligibility](https://developers.google.com/search/blog/2023/08/howto-faq-changes), [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

The S1 intent map and initial SERP notes below are historical research, not current instructions. Current implementation and owner decisions take precedence over S1 drafts.

## Entities (who or what this site is about; sameAs profiles)

### Primary entity: Person
| Property | Value | Status |
|---|---|---|
| `name` | Arnav Khandelwal | [R], GitHub profile |
| `jobTitle` | Software Engineer | [R] |
| `description` | Backend and AI engineer; Electrical Engineering undergraduate at MNIT Jaipur | Current `content/schema/person.json`; consistent with the supplied resume and shipped profile copy |
| `affiliation` | CollegeOrUniversity "Malaviya National Institute of Technology Jaipur" (MNIT Jaipur) | Current `content/schema/person.json`; he is a current student, so do not describe him as an alumnus |
| `knowsAbout` | Python, Java, SQL, FastAPI, Spring Boot, PyTorch, Transformers, LLMs, RAG, LangChain, Ollama, Docker | [R] skills list, verbatim |
| Experience | Backend Engineering Intern, Dehurdle, Jun–Aug 2026 | [R]. Owner-supplied current résumé authorizes employer attribution. Résumé-only performance claims remain hidden unless supported by public evidence. |
| `award` | "Bronze, Asian Championship (skating), 2018" | [R]. Amazon ML Summer School '25 goes in the description or `knowsAbout` context, not in `award` (it is a programme, not a prize). JEE Main 98.6 percentile goes in the About copy only |
| `address` | not published | Do not infer residential address or location from the university; current profile data omits it |
| `email` | `arnavkhandelwal446@gmail.com` | Confirmed in the supplied resume and current `content/site.json`; the old S1 typo warning is resolved |
| `image` | none | **TODO(owner):** headshot missing. Person schema ships without `image` rather than with a placeholder |
| `url` / `@id` | Provisional Vercel URL and `/#person` | `content/site.json` uses `https://arnav-khandelwal.vercel.app`; reconcile only after the owner selects and deploys the final domain |

### sameAs
| Profile | URL | Status |
|---|---|---|
| GitHub | `https://github.com/Arrnnnaav` | Verified and published in `Person.sameAs` |
| LinkedIn | none published | Unverified; do not add a guessed sameAs URL. The 2026-09-25 SERP collision check is historical, not current identity verification |
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

### Historical name-collision observations (2026-09-25)
Historical SERP observation from 2026-09-25 (not a current ranking check): the query `"Arnav Khandelwal"` returned other people with the same name: ZoomInfo pages (a Nike retail associate, a software developer at Currency in Irvine, a BITS Pilani NSS member), LinkedIn profiles (Medtronic IT analyst, TCU, UC Davis / Davis Consulting Group), a LinkedIn directory with "40+ profiles", and a FIDE chess profile. `Arnav Khandelwal MNIT Jaipur` returns nothing about this Arnav. The SERP is unowned and crowded. Winning it depends on **consistent disambiguators everywhere**, not only on this site:
- **Canonical descriptor:** "Arnav Khandelwal, backend and AI engineer, MNIT Jaipur". Use it in the home title, the Person `description`, the llms.txt summary, the OG image, and (owner actions, off-site) the GitHub bio and the LinkedIn headline.
- **Owner actions, off-site, $0, high impact** (not our files; listed in the handoff):
  1. The GitHub profile name is already "Arnav Khandelwal". Consider filling its `bio` and `blog` with owner-approved site details; do not publish a location without confirmation. The 2026-09-28 API check found those fields empty.
  2. Consider a profile README repo `Arrnnnaav/Arrnnnaav`; the GitHub API returned 404 on 2026-09-28. Recheck before creating it.
  3. Put the site URL in the LinkedIn "Website" field and the Contact info.
  4. Reciprocal profile links and `rel="me"` can help connect identities, but do not guarantee recognition by Google or answer engines.

## Intent map
The shipped routes are listed below; these query groups are historical hypotheses, not a current ranking report.

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
| `/resume` | Arnav Khandelwal resume | Arnav Khandelwal CV | Navigational; the supplied PDF is available |
| `/styleguide` | Design System / Arnav Khandelwal portfolio | Portfolio design-system reference | Indexable by owner decision; included in sitemap and `llms.txt` |
| `/e2e-error` | none | none | `noindex,nofollow`; excluded from sitemap and `llms.txt` |

### Title seeds for S4 (primary keyword first, brand last, 10–70 chars)
- `/`: "Arnav Khandelwal · Backend & AI Engineer, MNIT Jaipur" (on the home page the name is the primary keyword)
- `/work`: "Projects: Local-LLM Backends & AI Systems · Arnav Khandelwal"
- `/work/edge-node`: "Edge Node: Offline LLM Telemetry Classifier · Arnav Khandelwal"
- `/work/ledgerbridge`: "LedgerBridge: Auditable Razorpay Reconciliation · Arnav Khandelwal"
- `/work/ghostcursor`: "GhostCursor: Local AI Desktop Guide · Arnav Khandelwal"
- Descriptions lead with the outcome and one sourced number (for example "5.36s → 0.97s mean latency over 50 requests").

## Answer-engine questions (the questions buyers ask; each gets an answer-first block)
Where a question helps readers, render it as a heading followed by a direct answer from the same content file used for FAQPage JSON-LD. UIBuilder's local editorial rule asks for at least 40 words so each answer stands alone; this is not a Google requirement or Search eligibility rule, and answers should not be padded. The shipped Q&A is in `content/faq/*.json` and browser tests check visible/schema parity.

### Home (`content/faq/home.json`)
1. **What does Arnav Khandelwal do?** Seed (≈50 words): "Arnav Khandelwal is a software engineer and Electrical Engineering student at MNIT Jaipur. He builds backends and AI systems, mostly local-first LLM services in Python and FastAPI, and benchmarks them. During a 2026 backend internship he cut an offline telemetry service's mean latency from 5.36s to 0.97s." [R][GH:Project-Edge-Node]
2. **What has Arnav Khandelwal built?** Six flagships: LedgerBridge (103,049 records at 5.114s median, n=5); GhostCursor (361 documented tests and 27/30 raw intent accuracy); NeuroUX (reported video inference 50 min to ~80 s); Cited Researcher; StudyOS (documented AWS delivery pipeline; no live demo availability is claimed); and Edge Node. [GH]
3. **Is Arnav Khandelwal available for internships or full-time roles?** **TODO(owner):** PRODUCT names recruiters hiring for internships and then new-grad roles as the audience, but the owner has not stated availability, start dates or remote/relocation preferences. The answer stays blocked until he does. Never invent dates.
4. **What tech stack does Arnav Khandelwal use?** Python, Java, SQL; FastAPI, Spring Boot; PyTorch, Transformers; LLMs, RAG, LangChain, Ollama; Docker. [R] Add examples from repos: Pydantic, asyncio/SSE, Next.js, AWS (DynamoDB, ECS). [GH]
5. **How does Arnav verify the numbers on this site?** Each visible result links to public evidence and states its sample or evidence limits. This is useful provenance for readers; there is no claim that it is a special ranking or GEO signal.

### About (`content/faq/about.json`)
6. **Where does Arnav Khandelwal study?** B.Tech Electrical Engineering, MNIT Jaipur, since Aug 2023. [R]
7. **What was Arnav's backend internship?** Backend Engineering Intern at Dehurdle, Jun–Aug 2026: an offline FastAPI telemetry service with Pydantic validation, retry/backoff and Docker Compose. The public benchmark reports mean latency decreasing from 5.356s to 0.973s over 50 requests after an IPv6-first localhost DNS issue was fixed. [R, public repository benchmark]
8. **What recognition has Arnav received?** Amazon ML Summer School '25; JEE Main 98.6 percentile; Asian Championship skating bronze (2018). [R]

### Contact (`content/faq/contact.json`)
9. **How do I contact Arnav Khandelwal?** Email `arnavkhandelwal446@gmail.com` or use the contact form when delivery is configured. GitHub is the only verified public profile. **No response-time promise** is made.

### Case studies (`content/faq/work-<slug>.json`, 1–2 each, optional but recommended for long-tail AEO)
- Edge Node: "Why was the local Ollama API slow on localhost?" (IPv6-first resolution of `localhost`; switching to `127.0.0.1` took mean latency from 5.356s to 0.973s). [GH benchmark_report.md]
- LedgerBridge: "Does an AI decide the matches?" (No. A deterministic 3-pass matcher decides; an optional local model only narrates, read-only.) [GH]
- GhostCursor: "Does GhostCursor control the mouse?" (No. It highlights one control, waits for the human and verifies the result.) [GH]
- NeuroUX: "Can TRIBE v2 run on a 4 GB laptop GPU?" (Yes, with 4-bit NF4 LLaMA for text and fp16 V-JEPA2 for video.) [GH]

## Shipped schema inventory (checked 2026-09-28)
All nodes use `@context: "https://schema.org"` and stable `@id`s rooted at `{SITE_URL}`. The Person node is defined once (`content/schema/person.json`, which replaces the starter's `organization.json`) and referenced by `@id` everywhere else.

| Route | JSON-LD types | Notes |
|---|---|---|
| every page (layout) | `Person` (`#person`), `WebSite` (`#website`, `publisher`/`author` → `#person`, `inLanguage: en`) | Satisfies `missing-org-schema` on `/`. `sameAs` must hold at least GitHub, or `missing-sameas-entities` fires |
| `/` | `WebPage` (`about` → `#person`), `FAQPage` (from `faq/home.json`) | No SearchAction; the site has no search |
| `/about` | `ProfilePage` (`mainEntity` → `#person`, `dateModified`), `BreadcrumbList`, `FAQPage` (from `faq/about.json`) | ProfilePage is Google's supported type for a person's profile page |
| `/work` | `CollectionPage` + `ItemList` of the six case-study URLs, `BreadcrumbList`, FAQPage | ItemList entries identify the case-study pages; SoftwareSourceCode entities are scoped to their own detail pages |
| `/work/[slug]` | `WebPage` with `Article` as `mainEntity`; separate `SoftwareSourceCode` and `BreadcrumbList`; visible FAQPage | Article citations point to commit-pinned source files. `dateModified` is this portfolio revision; `datePublished` is omitted because no verified original publication date is available. No image or VideoObject is added without a suitable published asset. |
| `/contact` | `ContactPage` (`about` → `#person`), `BreadcrumbList`, optional `FAQPage` | the visible email is confirmed; omit a `ContactPoint` unless its details are verified |
| `/resume` | `WebPage` + `BreadcrumbList` + visible supplied resume |
| `/styleguide` | `WebPage` | Public and indexable by owner decision |
| `/e2e-error`, 404 | none | noindex / excluded from sitemap |

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
- [StudyOS]({SITE_URL}/work/studyos): learning workflow with a Chrome "Point & Ask" extension and a documented AWS delivery pipeline; no current demo uptime is claimed

## More work
- [All projects]({SITE_URL}/work): agents & evaluation, retrieval & NLP, hyperspectral classification, computer vision

## Optional
- [Résumé]({SITE_URL}/resume): supplied owner resume; resume-only performance metrics are not independently verified
```
Current file: `public/llms.txt`. Keep project facts in sync with case studies and verified sources. The supplied resume authorizes Dehurdle attribution. Cited Researcher's 152s-to-26s result stays out while it is resume-only and unconfirmed. Google Search says it does not use `llms.txt`; UIBuilder keeps this file for its contract and other systems that choose to consume it, not as a Google SEO tactic.

## AI crawler policy (allow/deny: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot)
- **Allow (current owner policy):** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended. Allowing a crawler does not guarantee training, citation, answer visibility or ranking. Google-Extended governs Gemini/Vertex AI uses and does not affect Google Search inclusion or ranking.
- **Deny:** CCBot (the pipeline default).
- **Disallow paths:** `/e2e-error` for allowed crawlers; denied crawlers such as CCBot are blocked at `/` by their specific rules. The styleguide is indexable. Add `/api/` only if a crawlable API route exists and policy requires it.
- This is the current project policy in `content/seo/crawlers.json`; it is owner-editable via BusinessOS (`crawler_policy`). The robots policy is tested against configured per-agent allow/deny choices and disallow paths.

## Internal linking plan
- **Home** → all six case studies (work grid), `/about`, `/contact`; the FAQ answers link to their proof page (for example the stack answer links to `/about`, the "what has he built" answer to `/work`).
- **/work** → every case study, plus outbound links to "more work" repos.
- **Each case study** → previous/next case study, one or two related ones (Edge Node ↔ GhostCursor, which share local Ollama + Qwen3 4B; Cited Researcher ↔ LedgerBridge, which share evidence/audit discipline), its GitHub repo, `/contact` as the closing CTA, and a visible breadcrumb matching BreadcrumbList.
- **/about** → the case studies it mentions (the internship → Edge Node), GitHub and LinkedIn with `rel="me"`.
- **Footer (all pages)** → GitHub (and LinkedIn once verified) with `rel="me"`, `/llms.txt` need not be linked.
- Anchor text is descriptive ("LedgerBridge reconciliation case study"), never "click here" or a bare "View".

## Competitors / SERP + AI-answer notes
Historical search observation dated 2026-09-25 (WebSearch, US index); results can vary by location, index and time and are not a current ranking check.

| Query | Who ranks | This entity? | Takeaway |
|---|---|---|---|
| `"Arnav Khandelwal"` | ZoomInfo ×3 (Nike, Currency, BITS Pilani), LinkedIn ×5 incl. 40+ profile directory, FIDE chess profile | No | Namesake-dominated. Needs the disambiguators and off-site links above |
| `Arnav Khandelwal MNIT Jaipur` | MNIT reports, unrelated Khandelwal Wikipedia pages | No | The sampled results appeared less crowded than the generic name query; no ranking outcome is predicted. The About page and MNIT affiliation provide relevant identity context. |
| `Arnav Khandelwal software engineer backend AI FastAPI` | Aditya Khandelwal (adityakhandelwal.dev), Arnav Deepaware (arnavd.co), Arnav Kulkarni | No | Near-namesake portfolios exist. Our title must contain the full name + "backend & AI" |
| `Arrnnnaav github` | GitHub repos smb-safeops, BuisnessHQ, StudyOS-Hackathon, LearningHQ; awesomeclaudeplugins.com lists learning-hq-plugin | Yes (repos only) | The handle is indexed but points to no site. **Note:** smb-safeops and BuisnessHQ appear as indexed GitHub pages although CONTENT_SOURCE lists them as private; owner should check their visibility |
| `backend AI engineer portfolio FastAPI local LLM` | GitHub portfolio repos (sasideep0053-ui, code-shubhambhatt, mike-elio), dev.to/hashnode tutorials, job boards | No | Generic head term dominated by GitHub + tutorials. Win long-tails via case studies instead |
| LedgerBridge query | 9+ Razorpay Buildathon Track 04 repos (ledgerlens, ledgerloop, LedgerProof, razorpay-ledgerguard, parity, recon-ai-finance-controller…) | No | Crowded peer field. Differentiate on the published scale benchmark and honesty about evidence limits |
| GhostCursor query | `ghost-cursor` npm/Puppeteer library (Bright Data, Scrapeless, DeepWiki), a Chrome extension, Ghosthand MCP | No | **Hard name collision.** Always pair the name with "local AI desktop guide"; the slug stays `ghostcursor` but titles lead with the descriptor |
| Cited Researcher query | adityamhaske/Multi-Agent-Research-Assistant and other LangGraph research-agent repos | No | Crowded. Lean on the "query type decides how many agents run" angle |
| NeuroUX query | ndpvt-web/neuroscore, CortexLab, TRIBE v2 explainer blogs, arXiv | No | Emerging topic; "run TRIBE v2 on a 4 GB GPU" is a real, underserved long-tail |
| StudyOS query | In the 2026-09-25 sample, **Arrnnnaav/StudyOS-Hackathon appeared first**; snipt, StudyO (studystudio.us) | Yes (repo) | Historical result only; no durable ranking claim. The case study and repository link to each other. |
| Edge Node query | Ollama/Qwen3 tutorials | No | Generic name. The IPv6/localhost latency story is the unique hook |

### AI-answer check
Historical answer-engine check from 2026-09-25 (not a current visibility measurement): a search synthesis listed other people for the name query and cited the StudyOS GitHub README for its project query. At that time, the queried assistant did not surface this portfolio. This is a dated observation, not a current answer-engine result or a general rule about citations; repeat with the deployed URL after launch.


## Current implementation reconciliation, 2026-09-28
The supplied résumé confirms `arnavkhandelwal446@gmail.com` and authorizes Dehurdle attribution. `Person.sameAs` contains only the verified GitHub profile; unconfirmed identity, location and availability details remain unpublished. The styleguide is public, indexable and included in the sitemap and `llms.txt`; `/e2e-error` remains a noindex test route excluded from public SEO files. SEO data is route-scoped and generated from content files. Canonical and entity URLs still use the provisional hosting target and must be reconciled after deployment.

Route and schema `lastModified` values currently use **2026-09-28** to indicate the portfolio content review; these are not upstream project release dates. Project test counts are README-reported; NeuroUX is an experimental proxy, LedgerBridge sealed scores are specification consistency, GhostCursor intent scores describe a small frozen set, and StudyOS has no measured learning-outcome claim. Cited Researcher résumé-only speedup remains hidden. Technical controls do not promise rankings or generative-engine citations.
