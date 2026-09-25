# WIREFRAMES — portfolio

> ux agent, S2, 2026-09-25. One block per IA route (`## /route`), sections listed top to bottom. Each section names a brain **pattern id** or a `new:<name>`, followed by its content needs and its mobile behaviour. Structure and behaviour only: design-director owns every visual decision.
>
> **Perf budget rule:** at most one `perf_cost: medium` pattern per page, and none in the first mobile viewport. **This build uses no medium patterns at all.** `hero-interactive-object` was rejected: it's trust NEW, it costs LCP, and the evidence positioning doesn't need a gimmick.
> **Motion rule:** `motion-scroll-reveal-restrained` is used only on sections that can never sit in the first viewport at any breakpoint. Everything above the fold renders visible in the SSR HTML, with no `opacity: 0` start.

---

## New patterns introduced by this build

Each one is proposed for `brain/patterns/sections.json` via `/learn` once it's approved.

### `new:metric-ledger` — the evidence section (reusable; home + every case study + hero excerpt)
- **Mechanism:** a ledger of measured results, one row per claim. Columns:
  1. **metric**, e.g. "Mean latency"
  2. **before**
  3. **→ after**
  4. **delta**, computed at build time from before/after (e.g. "−82% · 5.5×") and never typed by hand
  5. **n / method**, e.g. "n=50 requests, 0 failed"
  6. **source**, a link to the exact file or section, e.g. "benchmark_report.md". It opens in a new tab.

  The same component renders a **single-value row** (no before, e.g. "103,049 records · 5.114 s median") and a **fact row** (qualitative, e.g. "Deploy blocked on failed test/typecheck/build"). A caveat line can sit under a row, quoted verbatim from the source (e.g. "specification consistency, not real-world accuracy").
- **Source-type tag** on every row. There are exactly three types: `committed benchmark`, `README`, `résumé-attested`. The ledger's footer carries a one-line legend explaining them. `résumé-attested` rows render only if the owner approves (PRODUCT OQ6), and they never reach JSON-LD or llms.txt.
- **Missing values are shown, not hidden:** if a source gives no n, the cell reads "n not reported". This is the honesty signal.
- **Data:** read from `content/evidence/<slug>.json`, the single source of truth that is also used by FAQs, OG images and llms.txt.
- **Semantics:** a real `<table>` with a `<caption>`, `scope`d headers and a visually hidden arrow text ("reduced from … to …").
- **Interaction:** none required. On home, each row has two separate targets: the metric/project name links to the case study, and the source cell links to GitHub. There are no nested links and no row-wide click handler.
- **Numbers never animate** (no count-up): the value in the HTML is the value.
- **Optional:** a proportional before/after bar per row, drawn in CSS from the data ratio (no JS) and `aria-hidden`.
- **Perf:** none (static, server-rendered).
- **Mobile:** each row reflows into a stacked record. Line 1: metric name. Line 2: before → after (large) with the delta. Line 3: n/method · source-type tag. Line 4: the source link as a full-width ≥44 px tap target. Headers become inline labels. No horizontal scroll.

### `new:evidence-figure` — designed media slot with a data-driven fallback
- **Mechanism:** a `<figure>` with three states, chosen by `media_status` in the case data:
  1. `supplied`: the owner's screenshot or video (AVIF/WebP, explicit dimensions; video is poster + `preload="none"` + click-to-play).
  2. `rendered`: a screenshot we capture from an asset committed in the owner's own repo, e.g. LedgerBridge's `demo_dashboard.html`.
  3. `diagram` (the default today): a **server-rendered inline SVG chart or diagram generated from the real numbers** in `content/evidence/<slug>.json`.

  Every state has a `<figcaption>` that names its data source and links it, e.g. "Drawn from benchmark_report.md, n=50".
- **Chart rules:**
  - Axes are labelled, and log scales are stated in the caption.
  - Nothing is decorative or invented: every mark maps to a sourced number.
  - The SVG has a `<title>`/`<desc>`, and an equivalent data table is available as "Show data" (`<details>`).
  - When an asset is swapped in later, the slot keeps its aspect ratio, so CLS stays at 0.
- **Perf:** low (inline SVG, no chart library at runtime; generated at build).
- **Mobile:** full-bleed within the content column. Charts switch to a vertical orientation where labels would collide. Diagrams with more than 4 nodes re-flow top-to-bottom. Minimum text size is kept, so the chart is never scaled down as an image.

### `new:work-group-tiles` — "More work" as grouped tiles
- **Mechanism:** one tile per group (6 groups in total, not one tile per repo). Each tile has:
  - the group name and date range
  - a one-line summary
  - a repo count
  - a list of repo names that link out to GitHub
  - at most **one** sourced headline number per group where one exists, carrying its source-type tag and the source's own qualifier (e.g. "indicative, seed-dependent")

  The 2025 CV experiments are one tile listing 9 repos.
- **Perf:** none.
- **Mobile:** a single column. Each tile is a `<details>`/`<summary>` disclosure: the summary shows name, dates, count and one line, and expanding it reveals the repo list. Tiles are collapsed by default except the first.

### `new:breadcrumb-trail`
- **Mechanism:** a visible `nav[aria-label="Breadcrumb"]` ordered list that mirrors the BreadcrumbList JSON-LD exactly. The last item is `aria-current="page"` and is not a link.
- **Perf:** none.
- **Mobile:** single line. If it overflows, middle items collapse to "…" and the full trail stays in the markup.

### `new:page-intro` — compact page header for non-home pages
- **Mechanism:** an H1 carrying the page's primary keyword, followed by an answer-first lede (≤60 words, ≤60ch) that states the page's point in plain words. It has no asset and no entrance animation. It's the LCP element on these pages.
- **Perf:** none.
- **Mobile:** same order. The H1 wraps; nothing is hidden.

### `new:bio-teaser` — short bio with fact list (home)
- **Mechanism:** two columns. On one side, 2–3 sentences from the bio draft. On the other, a definition list of facts:
  - Education: MNIT Jaipur, B.Tech EE, 2023–
  - Experience: backend internship 2026
  - Programme: Amazon ML Summer School '25
  - Based in: shown only once the owner confirms

  It ends with a descriptive link to `/about`.
- **Perf:** none.
- **Mobile:** stacked, prose first.

### `new:timeline-ledger` — dated rows (about)
- **Mechanism:** a reverse-chronological list. Each row has a date range, a role/event, one line of what happened, and a link where proof exists (e.g. internship → `/work/edge-node`; Razorpay Buildathon → `/work/ledgerbridge`; AWS First Commit Hackathon → `/work/studyos`). It uses the same row grammar as the metric-ledger so the site reads as one system.
- **Perf:** none.
- **Mobile:** the date sits above each row's text in a single column.

### `new:skills-evidence-map` — skills as proof links, never skill bars (about)
- **Mechanism:** skills are grouped (Languages · Backend · ML/LLM · Infra), using only the skill names in the résumé. Each skill lists the case studies that prove it, as links, e.g. "FastAPI → Edge Node, Cited Researcher, NeuroUX". A skill with no public proof is listed plain, with no link and no invented proof. There are no percentages, bars or ratings.
- **Perf:** none.
- **Mobile:** each group becomes a stacked list. The proof links wrap under their skill.

### `new:related-cases` — end-of-case navigation
- **Mechanism:** two related cases (per IA §Related-case pairs), each showing title, descriptor, the headline ledger value and a one-line reason ("Also runs local qwen3:4b-instruct"). Below them sits a prev/next pair that follows the case ring. All anchors are descriptive.
- **Perf:** none.
- **Mobile:** related cases stack. Prev/next becomes two full-width rows.

### `new:profile-links` — elsewhere (about, contact)
- **Mechanism:** a short list of verified profiles (GitHub now, LinkedIn once verified, email once confirmed). Each carries `rel="me"`, and external links show a visible marker. Unverified profiles are not rendered at all.
- **Perf:** none.
- **Mobile:** a vertical list with ≥44 px targets.

### `new:error-recovery` — 404 / error page body
- **Mechanism:** an H1 that plainly states the problem, one sentence, then the next steps: Home, Work, the six case links, Contact. The error boundary adds Retry.
- **Perf:** none.
- **Mobile:** stacked links, ≥44 px.

### `new:resume-html` — conditional résumé page
- **Mechanism:** the résumé as semantic HTML (Experience, Projects, Education, Skills, Recognition), with a sticky "Download PDF" action. Project entries link to their case studies.
- **Perf:** none.
- **Mobile:** single column. The download action sits in the page-intro rather than sticking.

---

## Global chrome (on every indexable page)
- **nav**, `nav-minimal-overlay`:
  - Content: wordmark "Arnav Khandelwal"; links Work, About, GitHub (external, `rel="me"`); CTA Contact.
  - Mobile: the wordmark and a menu button. The full-screen overlay uses large type, a focus trap and closes on Esc. The Contact CTA stays visible in the bar as well as in the overlay. Link stagger is ≤40 ms each, and instant under reduced motion.
- **footer**, `footer-big-cta`:
  - Content: an oversized "Let's talk" link → `/contact`; columns for sitemap, case studies (6 descriptive links) and profiles (`rel="me"`); the location stamp only once confirmed; a "Numbers on this site link to their sources" line → home FAQ Q5 anchor.
  - Mobile: columns stack, and the big CTA stays first.
  - On `/contact` the big CTA becomes "See the work" → `/work`.
- **skip link** to `#main`.

---

## /
Purpose: pass the 60-second test (USER_FLOW primary journey). Meets the recipe defaults from PAGES.md: hero-oversized-type-split, work-grid-hover-reveal, faq-answer-first, footer-big-cta.

1. **nav**, `nav-minimal-overlay` (see Global chrome).
2. **hero**, `hero-oversized-type-split`
   - **Content:**
     - H1: "Arnav Khandelwal", followed by the descriptor "Backend & AI engineer, MNIT Jaipur" as part of the H1, for disambiguation.
     - Subline (≤60ch): the positioning line the owner picks (default option 1).
     - Primary CTA: "Contact Arnav" → `/contact`. Quiet secondary: "See the measured work" → `#work`.
     - **Offset asset:** instead of a headshot, a **single `new:metric-ledger` row** from Edge Node: "Mean latency 5.36 s → 0.97 s · −82% · n=50, 0 failed · committed benchmark · source". Its label credits it to "backend internship, 2026" (plus Dehurdle only if the owner consents). The row links to `/work/edge-node` and to its source.
   - **Motion:** the headline line stagger uses transform/clip only. Text is visible in SSR and never starts from opacity 0, which protects LCP (the H1 is the LCP element).
   - **Mobile:** the order is H1 → subline → CTA → the ledger row as a stacked record. All of it fits in or just below the first viewport, with no reveal animation and no media.
3. **measured results**, `new:metric-ledger` (home variant, 6 rows)
   - **Content:**
     - Caption: "Measured results — each links to its source".
     - Rows, one headline per flagship, all from `content/evidence/*`:
       1. **Edge Node:** P95 latency 1.080 s, n=50 (committed benchmark). The hero already shows the mean.
       2. **Cited Researcher:**
          - 152 s → 26 s end-to-end (résumé-attested) **only if OQ6 is approved**
          - otherwise "33 unit tests; LLM-judge eval on 10 queries" (README)
       3. **LedgerBridge:** 103,049 records · 5.114 s median · n=5 · ~20.1k rec/s (README)
       4. **GhostCursor:** raw intent accuracy 27/30 (90%) · 0 unauthorized plans (README)
       5. **NeuroUX:** video inference 50 min → ~80 s · n not reported (README)
       6. **StudyOS:** fact row "Live on AWS ECS; deploy blocked by a CI gate on failed tests, type check or build" (README; the "live" wording appears only after the uptime check, otherwise "Deployed on AWS ECS via OIDC + CI")
     - Legend footer explaining the three source types.
   - **Mobile:** stacked records (see pattern). This section is below the fold on both breakpoints, so it may use `motion-scroll-reveal-restrained`.
4. **selected work**, `work-grid-hover-reveal` (`id="work"`)
   - **Content:** 6 full-width rows in ring order. Each row has:
     - title
     - descriptor (e.g. "Local AI desktop guide that never clicks")
     - discipline tags (≤3, from the stack)
     - year/month
     - the headline value

     The hover preview, which follows the cursor, is that case's `new:evidence-figure` thumbnail (the diagram state today; a screenshot once supplied). Previews are lazy and prefetched on hover intent only.
   - **Mobile / touch:** there is no cursor preview. Tapping a row's disclosure control expands it inline to show the one-line problem and a "Read the <name> case study" link. The row title is itself a link, so one tap navigates and there's no double-tap trap.
   - **Reduced motion:** the preview appears in a fixed position without spring follow.
5. **more work teaser**, `new:work-group-tiles` (compact variant)
   - **Content:** one line plus 6 group names as chips, e.g. "18 more public repos: agents & evaluation, retrieval & NLP, learning tools, hyperspectral classification, classical CV, 2025 CV experiments" → `/work#more-work`. No repo links here.
   - **Mobile:** the chips wrap, and the whole line is a single link target.
6. **bio teaser**, `new:bio-teaser`
   - **Content:** 2–3 sentences from the CONTENT_SOURCE §5 bio (with the Dehurdle clause dependent on consent); the fact list; a link "More about Arnav: timeline, skills and recognition" → `/about`.
   - **Mobile:** stacked. Reveal allowed.
7. **FAQ**, `faq-answer-first`
   - **Content:** `content/faq/home.json`. Each question is an H3 followed directly by a 40–60 word answer paragraph, then optional detail with internal links (Q2 → `/work`, Q4 → `/about`, Q5 explains the three source types).
     1. What does Arnav Khandelwal do?
     2. What has he built?
     3. Is he available? **Omitted until the owner states availability.**
     4. What tech stack does he use?
     5. How are the numbers on this site verified?

     The section has `id="faq"`; Q5 has `id="evidence"`, the target of the footer line. It emits FAQPage JSON-LD.
   - **Mobile:** all answers are expanded, with no accordion, so the answer-first text is visible and crawlable. Only the "details" beneath the first 40–60 words may sit in a `<details>`.
8. **footer**, `footer-big-cta` (see Global chrome).

---

## /work
Purpose: the full index, showing breadth without clutter.

1. **nav**, `nav-minimal-overlay`, with "Work" current.
2. **breadcrumb**, `new:breadcrumb-trail`: Home › Work.
3. **page intro**, `new:page-intro`
   - **Content:** H1 "Projects: local-LLM backends and AI systems". The lede (≤60 words) states that there are six case studies with sourced results, plus 18 more public repos grouped below.
   - **Mobile:** same.
4. **flagship index**, `work-grid-hover-reveal`
   - **Content:** the same 6 rows and data as home (one component, one data source), with the addition of a stack line and a 1-line problem statement visible on each row. It has no filters, since 6 items don't need them.
   - **Mobile:** inline expand, as on home.
5. **more work**, `new:work-group-tiles` (full variant, `id="more-work"`)
   - **Content:** 6 tiles, from CONTENT_SOURCE §3. Each headline number is shown with its source's own qualifier.

     | Group | Repos | Headline number |
     |---|---|---|
     | Agents & evaluation | Pricing-Agent, agent-benchmark | agent-benchmark: 4 architectures compared over ~40 saved runs (README). No other number |
     | Retrieval & NLP | DocCluster, Sentiment-Analysis-API-DistilBERT | DistilBERT validation accuracy 90.71% (README) |
     | Learning tools | LearningHQ, learning-hq-plugin | none |
     | Hyperspectral classification (Mar 2026) | PaviaU, Indian Pines | HybridSN OA 99.9% on Pavia University, "typical results, indicative and seed-dependent" (README) |
     | Classical CV services | Image_Alignment | "500 ORB keypoints · top 50 matches" (README) |
     | Computer-vision experiments (mid-2025) | 9 repos, listed by name only | none |

     DocCluster's committed `docs/screenshot.png` may be used as the one image on its tile (owner's own asset).
   - **Behaviour:** repo links open in a new tab. Repos flagged for hygiene in CONTENT_SOURCE §6.12 (placeholder clone URLs, a committed book PDF) are **not linked until the owner confirms**; they are listed as plain names.
   - **Mobile:** `<details>` tiles (see pattern). Reveal allowed (below the fold).
6. **footer**, `footer-big-cta`.

---

## Case study template (applies to each `/work/<slug>` below)
Pattern: `case-study-sticky-meta`. It is filled per slug in the next six sections.

1. **nav**, `nav-minimal-overlay`, with "Work" current.
2. **breadcrumb**, `new:breadcrumb-trail`: Home › Work › {Name}.
3. **case header**, the header slot of `case-study-sticky-meta`
   - H1: descriptor-led title (e.g. "GhostCursor: a local AI desktop guide that points but never clicks").
   - Lede (≤50 words): the outcome sentence with its headline number.
   - Link row: "Source on GitHub", plus the live demo or video where one exists.
   - The first viewport carries no media. The H1 is the LCP element.
4. **meta rail**, the rail of `case-study-sticky-meta`
   - Content, as a `<dl>`: Role; Dates; Stack (≤8 items); **Outcome** (the headline ledger row, compact); Repo link; an author line, "By Arnav Khandelwal, backend & AI engineer" → `/about`. The author line gives long-tail visitors their "who is this" path.
   - Desktop: sticky within the article.
   - **Mobile:** not sticky. It renders as a compact summary block directly after the header, with Outcome first.
5. **Problem**, `case-study-sticky-meta` body
   - H2 "Problem". 2–4 sentences from CONTENT_SOURCE §4.
6. **Approach — 3 beats**, `case-study-sticky-meta` body
   - H2 "Approach". Three numbered H3 beats (01/02/03), each ≤90 words and taken verbatim-faithful from CONTENT_SOURCE §4.
   - Each beat may carry one inline technical artefact: a code-term list, a config value (`SUBAGENT_CAP = 5`) or a small diagram fragment. These are rendered as text, not images.
   - Mobile: linear, with the beat numbers kept.
7. **Result**, `new:metric-ledger` (case variant) + `new:evidence-figure`
   - H2 "Result". The full ledger for the case (rows listed per slug), then the evidence figure (the per-slug fallback spec below).
   - Caveats are quoted verbatim under their rows.
   - Mobile: stacked records, then the figure. Reveal allowed.
8. **case FAQ**, `faq-answer-first`
   - Present only where SEO_STRATEGY seeds a question (edge-node, ledgerbridge, ghostcursor, neuroux). It uses an H3 question and a 40–60 word answer. Emits FAQPage JSON-LD from `content/faq/work-<slug>.json`.
   - Mobile: always expanded.
9. **Links**, `case-study-sticky-meta` body
   - H2 "Links". A list of descriptive outbound links: repo, specific source files behind the numbers, live demo/video.
   - Mobile: full-width rows ≥44 px.
10. **related + prev/next**, `new:related-cases`: 2 related cases per IA, then prev/next along the ring.
11. **closing CTA + footer**, `footer-big-cta`
   - The big CTA's copy is case-aware, e.g. "Talk to Arnav about backend or AI work like {Name}" → `/contact`.

---

## /work/edge-node
Template as above. Specifics:
- **Header:** H1 "Edge Node: an offline LLM telemetry classifier (FastAPI + Ollama)". Lede: mean latency 5.36 s → 0.97 s after tracing an IPv6-first `localhost` lookup.
- **Rail:**
  - Role: "Backend Engineering Intern, 2026" ("at Dehurdle" only with consent).
  - Dates: Jun–Aug 2026.
  - Stack: Python, FastAPI, Pydantic, Ollama (Qwen3 4B), Docker Compose, pynvml.
- **Approach beats:**
  1. Telemetry → prose, because small models are tuned on natural language.
  2. Schema-constrained output at temperature 0; 3 self-correcting retries, then a 502.
  3. Benchmarking traced the extra latency to IPv6-first `localhost`; the fix was `127.0.0.1`.
- **Ledger rows** (source: `benchmark_report.md`, committed benchmark unless noted):

  | Metric | Value | n / method |
  |---|---|---|
  | Mean latency | 5.356 s → 0.973 s (delta computed) | n=50, 0 failed |
  | Median latency | 0.952 s | n=50 |
  | P95 latency | 1.080 s | n=50 |
  | TTFT mean | 0.351 s | n=10 |
  | Avg VRAM | 2,478 MB | |
  | Avg RAM | 13,422 MB | |
  | Model choice | Qwen3-4B Q4_K_M | résumé-attested, OQ6-gated; the README names `qwen3:4b-instruct` only |

- **Evidence figure fallback (`diagram` state):**
  - **(a) Before/after latency bar pair:** 5.356 s vs 0.973 s on a linear axis in seconds. Below it, a distribution strip placing median 0.952, mean 0.973 and P95 1.080 on a tight 0.9–1.1 s sub-axis (labelled as a zoomed scale).
  - **(b) Request pipeline diagram:** telemetry JSON → Pydantic validation → prose → Ollama @ 127.0.0.1 → schema check → (retry ≤3 → 502).
  - Caption: "Drawn from benchmark_report.md (n=50)".
  - Upgrade path: a Swagger `/docs` screenshot once the owner supplies one.
- **Case FAQ:** "Why was the local Ollama API slow on localhost?"
- **Related:** GhostCursor (both run local qwen3:4b-instruct), NeuroUX (both fit a small local GPU budget).
- **Prev/next:** StudyOS ← → Cited Researcher.
- **Mobile:** as in the template. Figure (a) switches to vertical bars under 480 px.

## /work/cited-researcher
- **Header:** H1 "Cited Multi-Agent Researcher: parallel search agents that return cited answers". Lede: the query type decides how many agents run (1 for a fact question, up to 5 for a comparison), and every claim carries a `[N]` citation.
- **Rail:**
  - Role: solo builder.
  - Dates: **Jun or Jul 2026, pending the owner's answer to OQ7**; show "2026" until then.
  - Stack: Python, FastAPI, Gemini Flash grounding, asyncio, SSE, TypeScript/Vite, pytest.
- **Approach beats:**
  1. Classify and decompose (`SUBAGENT_CAP = 5`).
  2. The CitationAgent dedups, assigns `[N]` and scores credibility; synthesis streams over SSE.
  3. An LLM-as-judge on 10 test queries, plus 33 unit tests.
- **Ledger rows:**
  - "33 unit tests" (README).
  - "LLM-judge eval: factuality + citation coverage, 10 queries (5 fact + 5 comparison)". A fact row: the README reports no scores, so the ledger shows "scores not reported".
  - Parallelism: 1 agent (fact) / up to 5 (comparison) (README/code).
  - End-to-end 152 s → 26 s via `asyncio.to_thread` (**résumé-attested; rendered only if OQ6 is approved**).
- **Evidence figure fallback (`diagram` state):** an **agent-topology diagram**: Orchestrator → Search ×N → Citation → Synthesis, with the Judge off to the side.
  - A two-state toggle ("fact query" / "comparison query") redraws the diagram with 1 or 5 search nodes. It's a small client island, and it's keyboard operable (a radio group).
  - The default SSR state shows the comparison case, with the numbers in the text.
  - If the 152 s → 26 s row is approved, add a before/after bar pair captioned "résumé-attested; no public benchmark".
  - Upgrade path: a screen recording of a streamed answer with its sources sidebar.
- **Case FAQ:** none planned (none seeded; add later only from sourced facts).
- **Related:** LedgerBridge (evidence and auditability), StudyOS (grounded answers).
- **Prev/next:** Edge Node ← → LedgerBridge.
- **Mobile:** the topology diagram stacks top-to-bottom, and the toggle sits above it, full width.

## /work/ledgerbridge
- **Header:** H1 "LedgerBridge: deterministic, auditable bank, ledger and Razorpay reconciliation". Lede: 103,049 records in a 5.114 s median (n=5), and no AI decides a match.
- **Rail:**
  - Role: solo builder, Razorpay Buildathon Track 04.
  - Dates: 2026 (last push Aug 2026).
  - Stack: Python (Decimal), indexed 3-pass matcher, Ollama narration with template fallback, HTML dashboard, pytest.
- **Approach beats:**
  1. The 3-pass matcher: exact → amount/date → fuzzy, with ties going to `AMBIGUOUS_MATCH`.
  2. An 8-code exception taxonomy, an audit hash chain, and many:1 payout batches matched in Decimal.
  3. Honest evidence: a sealed benchmark, a multi-seed run and a committed scale benchmark.
- **Ledger rows** (all README):
  - Scale: 103,049 records · 5.114 s median engine time · n=5 · ~20.1k rec/s.
  - Demo: 77 records → 62 matched · 15 evidenced exceptions.
  - INR record-value coverage: 94.9%.
  - Sealed benchmark: 234 records, strict accuracy / pair F1 / macro-F1 all 1.0, with the verbatim caveat "specification consistency, not real-world accuracy".
  - Tests: 45/45.
- **Evidence figure:**
  - **Preferred (`rendered` state):** a screenshot of the committed `demo_dashboard.html`, rendered by us from the owner's repo, with the caption naming the file.
  - **Fallback (`diagram` state):**
    - **(a)** A 77-cell unit grid: 62 matched and 15 exceptions, the exceptions grouped by exception code where the demo output provides codes (otherwise just the 62/15 split).
    - **(b)** A 3-pass funnel diagram showing how records flow exact → amount/date → fuzzy → exceptions. It is labelled as a process diagram with no per-pass counts, unless the demo output supplies them.
- **Case FAQ:** "Does an AI decide the matches?"
- **Related:** Cited Researcher (evidence discipline), GhostCursor (deterministic logic decides).
- **Prev/next:** Cited Researcher ← → GhostCursor.
- **Mobile:** the unit grid re-flows to 7 columns and keeps its legend. The funnel runs vertically.

## /work/ghostcursor
- **Header:** H1 "GhostCursor: a local AI desktop guide that points but never clicks". Lede: 27/30 raw intent accuracy, zero unauthorized plans, 361 hermetic tests.
- **Rail:**
  - Role: solo builder.
  - Dates: 2026 (last push Aug 2026; 282 commits).
  - Stack: Python 3.12, Windows UI Automation, OCR fallback, Ollama `qwen3:4b-instruct`, SQLite, pytest.
- **Approach beats:**
  1. The model maps a goal only to registered intents; actions come only from a reviewed, digest-bound recipe catalog.
  2. Highlight → wait for the human → verify the result, with a stop that is always available.
  3. A frozen 30-case model gate keeps model quality separate from execution authority.
- **Ledger rows** (all README):
  - Raw intent accuracy: 27/30 (90%).
  - Exact supported goals: 100%.
  - Unauthorized plans: 0.
  - Runs where the model changed the executed recipe: 0 of 60.
  - Hermetic tests: 361 passing.
  - Real VS Code workflows: 3, each 3/3 human-driven runs.
  - Schema-v2 acceptance runs: 12 successful.
- **Evidence figure fallback (`diagram` state):**
  - **(a)** A 30-cell result grid: 27 correct, 3 incorrect.
  - **(b)** A 60-run strip: all "recipe unchanged".
  - **(c)** A guide-loop diagram: Goal → intent ID → recipe step → highlight control → human acts → verify → next/feedback, with the Stop control drawn as always available.
  - Upgrade path: the demo video, which the owner records from the committed 4:45 script. It uses poster + click-to-play, below the fold.
- **Case FAQ:** "Does GhostCursor control the mouse?"
- **Related:** Edge Node (same local model), LedgerBridge (the model never decides).
- **Prev/next:** LedgerBridge ← → NeuroUX.
- **Mobile:** grids re-flow to 10 columns. The loop diagram becomes a vertical list with a return arrow.

## /work/neuroux
- **Header:** H1 "NeuroUX: brain-response UX scoring with TRIBE v2 on a 4 GB GPU". Lede: video inference went from 50 minutes to ~80 seconds on a laptop GPU.
- **Rail:**
  - Role: solo builder.
  - Dates: 2026 (last push May 2026).
  - Stack: Python, FastAPI, PyTorch, bitsandbytes, nilearn, SSE; Next.js, React Three Fiber, Recharts.
- **Approach beats:**
  1. TRIBE v2 predicts 20,484 vertices, which are mapped to 12 Destrieux regions.
  2. Fitting a 4 GB GPU: 4-bit NF4 LLaMA for text, fp16 V-JEPA2 for video.
  3. The "everything ties" bug was fixed by z-scoring over the 12 ROIs instead of the vertices.
- **Ledger rows** (all README; n not reported on any of them, which is shown):
  - Video inference: 50 min → ~80 s.
  - Text inference: 36 h → ~1 min (the body text says ~70 s for 350 words; both are quoted, and the ledger shows ~70 s with the caveat).
  - 3-second clip encode: ~10 s.
  - Hardware: 4 GB laptop GPU; text model ~2 GB VRAM.
- **Evidence figure:**
  - **`supplied` state available now:** the owner's demo video `docs/demo.mp4`, self-hosted (copied from the owner's repo, not hot-linked to the raw GitHub URL), with poster + `preload="none"` + click-to-play. It sits below the Result ledger, never in the first viewport, and has a text description.
  - **Fallback and secondary figure (`diagram` state):** a **log-scale time comparison** with two pairs (video 3,000 s → ~80 s; text 129,600 s → ~70 s). "Log scale" is stated in the caption and on the axis, because on a linear axis the after-values would be invisible.
  - Owner stills of the 3D brain and radar views replace the video poster once supplied.
- **Case FAQ:** "Can TRIBE v2 run on a 4 GB laptop GPU?"
- **Related:** Edge Node (small local GPU budget), Cited Researcher (evaluation of model output). Per IA: NeuroUX ↔ Cited Researcher.
- **Prev/next:** GhostCursor ← → StudyOS.
- **Mobile:** the chart is vertical, and the video is full-width with a tap-to-play control ≥44 px. This is the only case with a video, and it is low cost (no autoplay, no preload).

## /work/studyos
- **Header:** H1 "StudyOS: learn next, ask in context with Point & Ask, remember". Lede: a learning loop for engineering students, deployed on AWS through an OIDC + CI pipeline.
- **Rail:**
  - Role: "Builder, AWS First Commit Hackathon". Solo or team is **pending the owner's answer to OQ8**, and no role claim is made until then.
  - Dates: 2026 (last push Sep 2026).
  - Stack: TypeScript, Next.js, Chrome MV3, DynamoDB, S3, ECS, ECR, Secrets Manager, GitHub Actions OIDC, Gemini/NVIDIA NIM.
- **Approach beats:**
  1. Today: one next topic that respects prerequisites.
  2. Point & Ask: a text or region selection, answered in the exact context; no full page is sent by default.
  3. Save to Review for spaced repetition; OIDC + a CI gate block the deploy on failure.
- **Ledger:** the **fact-row variant**, because the README reports no metrics and the site must not invent any. Rows:
  - Deploy target: AWS ECS Express via ECR + OIDC.
  - CI gate: tests, type check and build must pass before a deploy.
  - Abuse controls: per-user quotas, idempotency keys, single-use pairing codes.
  - Live demo status: "checked {date}". Rendered only after the uptime check.

  The ledger caption says "No quantitative metrics were published for this project".
- **Evidence figure fallback (`diagram` state):**
  - **(a)** A learning-loop diagram: Today → Point & Ask → Save to Review → back to Today.
  - **(b)** A delivery-pipeline diagram: push → GitHub Actions (test · typecheck · build gate) → OIDC → ECR → ECS.
  - Upgrade path: screenshots taken from the live demo (by the owner, or by us once uptime is verified and the owner approves).
- **Links:** the repo (always), and the live demo (only after the uptime check, labelled "live demo on AWS").
- **Case FAQ:** none planned.
- **Related:** Cited Researcher (grounded answers), NeuroUX (the IA pair's second slot).
- **Prev/next:** NeuroUX ← → Edge Node (the ring wraps).
- **Mobile:** both diagrams run vertically. The loop is drawn as a list with a return arrow.

---

## /about
Purpose: recruiter due diligence and the MNIT disambiguation query.

1. **nav**, `nav-minimal-overlay`, with "About" current.
2. **breadcrumb**, `new:breadcrumb-trail`: Home › About.
3. **page intro**, `new:page-intro`
   - H1 "About Arnav Khandelwal". An answer-first lede (≤60 words): software engineer, B.Tech Electrical Engineering at MNIT Jaipur (2023–), builds local-first backends and AI systems and publishes where his numbers come from.
   - No headshot. An optional slot for one exists only if the owner supplies it, below the lede, with explicit dimensions.
4. **bio**, prose (part of `new:bio-teaser`, long variant)
   - The full first-person bio from CONTENT_SOURCE §5, with the Dehurdle clause gated.
   - Mobile: single column, ≤70ch.
5. **timeline**, `new:timeline-ledger`
   - Rows, newest first:
     - Backend internship, Jun–Aug 2026 → `/work/edge-node`
     - Razorpay Buildathon Track 04 → `/work/ledgerbridge`
     - AWS First Commit Hackathon → `/work/studyos`
     - Amazon ML Summer School, 2025
     - B.Tech EE, MNIT Jaipur, Aug 2023–
     - Asian Championship skating bronze, 2018
   - Hackathon dates show only what the sources give. No results are claimed.
   - Mobile: date-above rows. Reveal allowed.
6. **skills**, `new:skills-evidence-map`
   - The résumé's skills only, grouped. Each skill links to its proving case studies. Java, Spring Boot and SQL show "no public project yet" (plain text) until BusinessHQ material exists. No skill bars.
   - Mobile: stacked groups.
7. **recognition**, a list inside `new:timeline-ledger` (compact variant)
   - Amazon ML Summer School '25 (programme); JEE Main 98.6 percentile; Asian Championship skating bronze (2018). Each is labelled as what it is: a programme, a score or an award.
8. **FAQ**, `faq-answer-first`
   - `content/faq/about.json`:
     1. Where does he study?
     2. What was the backend internship? (It links to `/work/edge-node`.)
     3. What recognition has he received?
   - Always expanded. Emits FAQPage JSON-LD.
9. **elsewhere**, `new:profile-links`
   - GitHub (`rel="me"`); LinkedIn once verified; résumé → `/resume` if shipped.
10. **footer**, `footer-big-cta`.

`motion-scroll-reveal-restrained` (the recipe default) applies to sections 5–9 only.

---

## /contact
Purpose: the primary conversion.

1. **nav**, `nav-minimal-overlay`, with the Contact CTA shown as current.
2. **breadcrumb**, `new:breadcrumb-trail`: Home › Contact.
3. **page intro**, `new:page-intro`
   - H1 "Contact Arnav Khandelwal". The lede says what to write about (backend and AI roles, internships, collaborations, freelance builds) in ≤40 words. It makes **no response-time promise**.
4. **form + direct channels**, `contact-inline-form`
   - **Fields:** Name, Email, Message. The message placeholder asks for what you're building or hiring for.
   - **Controls:** the Turnstile widget; submit.
   - **States:**
     - idle
     - submitting: the button is disabled with a busy label
     - **success:** inline confirmation that replaces the form, plus the next steps "See the work" → `/work` and GitHub
     - validation error: per field, from Zod, focus moves to the first invalid field, and values are kept
     - server/rate-limit error: an inline message, values kept, direct channels highlighted as the fallback
   - **Aside:** `new:profile-links`, with GitHub now, and email/LinkedIn only once confirmed or verified. There is no `mailto` for the unconfirmed address.
   - **Mobile:** the form comes first and the aside below it. Inputs are full width with correct `type`/`autocomplete`, labels are visible and not placeholder-only, and the submit button is full width. Turnstile is in the flow, never an overlay.
5. **FAQ**, `faq-answer-first`: `content/faq/contact.json`, one question, "How do I contact Arnav Khandelwal?". Always expanded.
6. **footer**, `footer-big-cta` variant: the big CTA becomes "See the work" → `/work`, so the page doesn't link to itself.

---

## /resume
**Conditional:** built only if the owner supplies the PDF. Otherwise the route, the footer link and the /about link are all removed.

1. **nav**, `nav-minimal-overlay`.
2. **breadcrumb**, `new:breadcrumb-trail`: Home › Résumé.
3. **page intro**, `new:page-intro`: H1 "Arnav Khandelwal, résumé", with a lede and a "Download PDF" action (tracked as `resume_download`, with the file size stated).
4. **résumé body**, `new:resume-html`
   - Experience, Projects (each → its case study), Education, Skills, Recognition. The text matches the PDF, and the numbers come from `content/evidence/*`, so the page and the case studies can't disagree.
   - Mobile: single column, with the download action in the intro.
5. **footer**, `footer-big-cta`.

---

## /styleguide
Internal, `noindex,nofollow`, and excluded from the sitemap and llms.txt (starter utility).

1. **nav**, `nav-minimal-overlay`.
2. **token and component gallery**, `new:styleguide-gallery`
   - Mechanism: each shared component rendered in every state, e.g. the metric-ledger in its before/after, single-value, fact, résumé-attested and "n not reported" rows; the evidence-figure in each of its 3 states; work-group tiles open and closed; form states; FAQ.
   - Used for visual snapshots.
   - Mobile: the same list, single column.
3. **back link** → Home.

## /e2e-error
Internal, `noindex,nofollow`, and excluded from the sitemap and llms.txt. It throws on render in order to exercise the error boundary.

1. **nav**, `nav-minimal-overlay` (kept by the root layout).
2. **error boundary body**, `new:error-recovery`
   - H1 "Something broke on this page". One sentence, then Retry (resets the boundary), Home and Contact.
   - Mobile: stacked ≥44 px actions.
3. **footer**, `footer-big-cta`.

## Not found (404), not an IA route
1. **nav**, `nav-minimal-overlay`.
2. **recovery**, `new:error-recovery`
   - H1 "This page doesn't exist". Links to Home, Work, the six case studies by name, and Contact. noindex.
   - Mobile: stacked links.
3. **footer**, `footer-big-cta`.

---

## Pattern usage summary
| Page | Patterns | medium perf patterns |
|---|---|---|
| home | nav-minimal-overlay, hero-oversized-type-split, new:metric-ledger, work-grid-hover-reveal, new:work-group-tiles (compact), new:bio-teaser, faq-answer-first, footer-big-cta, motion-scroll-reveal-restrained (below fold only) | 0 |
| work index | nav-minimal-overlay, new:breadcrumb-trail, new:page-intro, work-grid-hover-reveal, new:work-group-tiles, footer-big-cta, motion-scroll-reveal-restrained | 0 |
| each case study | nav-minimal-overlay, new:breadcrumb-trail, case-study-sticky-meta, new:metric-ledger, new:evidence-figure, faq-answer-first (4 of 6), new:related-cases, footer-big-cta, motion-scroll-reveal-restrained | 0 |
| about | nav-minimal-overlay, new:breadcrumb-trail, new:page-intro, new:bio-teaser, new:timeline-ledger, new:skills-evidence-map, faq-answer-first, new:profile-links, footer-big-cta, motion-scroll-reveal-restrained | 0 |
| contact | nav-minimal-overlay, new:breadcrumb-trail, new:page-intro, contact-inline-form, new:profile-links, faq-answer-first, footer-big-cta | 0 |
| resume (conditional) | nav-minimal-overlay, new:breadcrumb-trail, new:page-intro, new:resume-html, footer-big-cta | 0 |
| utility pages | nav-minimal-overlay, new:styleguide-gallery, new:error-recovery, footer-big-cta | 0 |
