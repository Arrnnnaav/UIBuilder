# CONTENT_SOURCE.md — Arnav Khandelwal portfolio

Gathered 2026-09-25 with the `gh` CLI (read-only) from github.com/Arrnnnaav. Two sources:
- **[R]** = the 2026 resume summary the owner supplied. It is the source of truth for work history.
- **[GH:<repo>]** = that repo's README, languages API, top-level contents or commit metadata.

Numbers are quoted as written in the source. If a number appears only on the resume, it is marked **[R only]**.

---

## 1. Profile facts

| Field | Value | Source / status |
|---|---|---|
| Name | Arnav Khandelwal | [R], GitHub profile `name` |
| Role | Software Engineer | [R] |
| Education | B.Tech Electrical Engineering, MNIT Jaipur, Aug 2023–present | [R] |
| Location | Jaipur, India | Inferred from MNIT Jaipur. The GitHub profile has no location set. **Confirm with owner.** |
| Experience | Backend Engineering Intern, Dehurdle (Jun–Aug 2026) | [R] |
| GitHub | https://github.com/Arrnnnaav | verified (gh API) |
| LinkedIn | https://linkedin.com/in/arnav-khandelwal (handle `arnav-khandelwal`) | **UNVERIFIED.** Handle comes from the brief. Owner must confirm the URL. |
| Email | `arnavkhandelwal446@email.com` as printed on the resume | **NEEDS CONFIRMATION.** `@email.com` looks like a typo for a real provider such as gmail.com. The GitHub profile email is not public. Do not publish it until the owner confirms. |
| GitHub bio / blog / company | all empty | GitHub profile. There is no profile README repo (`Arrnnnaav/Arrnnnaav` returns 404). |
| Skills | Python, Java, SQL, FastAPI, Spring Boot, PyTorch, Transformers, LLMs, RAG, LangChain, Ollama, Docker | [R] |
| Achievements | Amazon ML Summer School '25; JEE Main 98.6 percentile; Asian Championship Skating bronze (2018) | [R] |

### Resume work history (verbatim facts)
- **Dehurdle, Backend Engineering Intern (Jun–Aug 2026). Project Edge Node:** an offline FastAPI telemetry service with Pydantic validation, retry/backoff and Docker Compose. Latency went from 5.3s to 1.0s after fixing IPv6-first localhost DNS. A 50-request benchmark (TTFT, latency, RAM, VRAM) chose Qwen3-4B Q4_K_M. [R]
  - The public repo corroborates this. The benchmark report gives "cut mean latency from 5.356s to 0.973s" over 50 latency requests with 0 failed and 10 TTFT requests. [GH:Project-Edge-Node/benchmark_report.md]
  - The README rounds the before figure differently ("~5.4s to ~1.0s"). Use 5.36s → 0.97s, or the resume's rounding.
  - The README names the model `qwen3:4b-instruct` and never mentions the "Q4_K_M" quant. That detail is resume-only.
- **Cited Multi-Agent Researcher (Jun 2026):** FastAPI, Gemini, asyncio. Runtime went from 152s to 26s via `asyncio.to_thread`, with up to 5 concurrent workers. It has dedup, citation, credibility scoring and tests, plus backoff and rate-limit failover. [R]
  - The 152s→26s figure is **[R only]**. The README describes `asyncio.gather` and gives no timing.
  - The "Jun 2026" date conflicts with the repo, which was created and pushed 2026-07-26 in 1 commit.
- **BusinessHQ — Enterprise Operations & Integration Platform (Aug 2026):** Spring Boot, JPA, MySQL, REST, SOAP, JUnit, Docker. It covers vendor onboarding workflows. Queries went from 180ms to 35ms over 10k records via indexes, and it has 35+ JUnit/Mockito scenarios. [R only] The public repo is **empty**; the code is in the private `BuisnessHQ` repo.

---

## 2. Public repo inventory

Last push dates come from the GitHub API. Scores run from 1 to 5 and rate portfolio value: substance, evidence and presentability.

### Agentic / LLM systems

**Project-Edge-Node** — [GH:Project-Edge-Node]
- **What:** A fully local, privacy-first classifier. It labels one day of workplace telemetry as FOCUS, NEUTRAL or BURNOUT using Qwen3 4B via Ollama.
- **Problem:** Classifying behavioural telemetry without any data leaving the machine.
- **Stack:** Python 20,488 B, Dockerfile 214 B. FastAPI, Pydantic, Ollama, Faker, Docker Compose, pynvml.
- **Notable details:**
  - JSON-schema-constrained output with temperature 0.0.
  - Retries "up to 3 attempts, feeding the model its own bad output plus a correction", then returns 502.
  - The benchmark over 50 requests: mean latency 0.973s, median 0.952s, P95 1.080s. TTFT mean 0.351s. Avg RAM 13422 MB. Avg VRAM 2478 MB.
  - The localhost fix took latency from 5.356s to 0.973s.
  - It converts telemetry to prose because "small language models are instruction-tuned overwhelmingly on natural language".
- **Demo/images:** None. `benchmark_report.md` holds tables only.
- **README quality:** Good.
- **Last push:** 2026-07-25. 8 commits.
- **Score: 5.** It is resume/internship work, and it has a real debugging story with committed numbers.

**Cited-Multi-Agent-Researcher** — [GH:Cited-Multi-Agent-Researcher]
- **What:** A multi-agent research system that returns cited answers. The flow is Orchestrator → Search ×N → Citation → Synthesis, with a Judge for evaluation.
- **Problem:** Grounded, cited research answers, where query type decides how many subagents run.
- **Stack:** Python 33,924, TypeScript 19,642, HTML 3,462, CSS 1,511, JS 591. FastAPI, Gemini Flash grounding, asyncio, SSE, and a Vite frontend on :5173.
- **Notable details:**
  - `SUBAGENT_CAP = 5`. A "fact" query uses 1 agent. A "comparison" query uses `min(subtopics, 5)` in parallel.
  - The CitationAgent dedups sources, assigns `[N]` IDs and scores credibility.
  - An LLM-as-judge scores factuality (0–1) and citation coverage (0–1) "on 10 test queries (5 fact + 5 comparison)".
  - It has "all 33 unit tests".
  - It is "Inspired by Anthropic's multi-agent research system".
- **Demo/images:** None.
- **README quality:** Good, but concise.
- **Last push:** 2026-07-26. 1 commit.
- **Score: 5.** It is a resume project with a clear architecture. The 152s→26s result is [R only].

**LedgerBridge-AI-** — [GH:LedgerBridge-AI-] (README title: "AI Finance Controller")
- **What:** A deterministic 3-pass matcher that reconciles bank, ledger and Razorpay settlements. Every decision is auditable and every unresolved record is evidenced. It was built for the Razorpay Buildathon Track 04.
- **Problem:** Reconciliation that reports which rule and which evidence produced each match. No LLM makes decisions; an optional local model only narrates, read-only.
- **Stack:** Python 165,008, HTML 59,159. Decimal arithmetic, Ollama narration with a template fallback, and an HTML dashboard.
- **Notable details, quoted from the README:**
  - "77 records · 62 matched · 15 evidenced exceptions".
  - "94.9% INR record-value coverage".
  - "103,049 records · 5.114s median engine time (n=5) · ~20.1k rec/s".
  - Sealed benchmark: "234 records … strict accuracy / pair F1 / macro-F1 all 1.0 (specification consistency, not real-world accuracy)".
  - Tests: "45/45".
  - An 8-code exception taxonomy.
  - The many:1 payout-batch matching sums values in Decimal.
  - Every audit row carries hashes of the input, config and engine.
- **Demo/images:** No README images. The repo commits `demo_dashboard.html` and `heldout_dashboard.html`, which can be rendered and screenshotted. `demo-output.txt` holds terminal output.
- **README quality:** Excellent. It is honest about the limits of its evidence.
- **Last push:** 2026-08-28. 4 commits.
- **Score: 5.** It has the strongest evidence discipline and scale numbers, and a fintech domain.

**AIOS (README title: "GhostCursor")** — [GH:AIOS]
- **What:** A local Windows AI guide for unfamiliar software. It points at the next trusted UI control, waits for the human to act, and then verifies the result. It never moves the mouse or types.
- **Problem:** Guiding new users, such as a new developer in VS Code, without an AI agent taking uncontrolled actions.
- **Stack:** Python 1,395,332. Windows UI Automation, OCR fallback, Ollama `qwen3:4b-instruct`, SQLite, pytest.
- **Notable details:**
  - It has three validated real VS Code workflows, "each passed three successful human-driven desktop runs".
  - "90% (27/30) raw intent accuracy, 100% on exact supported goals, and zero unauthorized plans".
  - "zero of 60 runs changed which recipe executes". The deterministic grounding decides the outcome, not the model.
  - "all 361 hermetic tests" and "all twelve successful schema-v2 acceptance runs".
- **Demo/images:** No README images. `docs/submission/demo-video-script.md` exists (a 4:45 demo script), but no video file is referenced.
- **README quality:** Very good, though dense.
- **Last push:** 2026-08-29. 282 commits.
- **Score: 5.** It shows bounded-AI safety engineering with rigorous gates. It needs a video or GIF.

**Pricing-Agent** — [GH:Pricing-Agent]
- **What:** A daily multi-agent pricing pipeline with four stages: Researcher → Analyst → Decision (Gemini or a PuLP LP optimizer) → a human approval gate over Slack or CLI. It keeps a JSONL audit trail.
- **Problem:** Recommending competitor-aware price changes within margin guardrails, with human-in-the-loop approval.
- **Stack:** Python 107,030. Gemini, SQLite, Pydantic, PuLP, rapidfuzz, Slack SDK, FastAPI, APScheduler, pytest.
- **Notable details:**
  - A documented reversal: the team removed LLM-generated SQL in favour of a parameterized query.
  - Eval metrics come from the audit trail: schema-success rate, a hallucination heuristic and tool-call success.
  - The README gives no numeric results.
- **Demo/images:** None.
- **README quality:** Good, with honest "Known limitations".
- **Last push:** 2026-08-23. 28 commits.
- **Score: 4.**

**agent-benchmark** — [GH:agent-benchmark]
- **What:** A FastAPI service that runs one research task through 4 agent architectures (ReAct, reflection, memory, team) built with LangChain, LangGraph and Groq. It times and prices each run, scores the report with an LLM judge, and writes a comparison blog post.
- **Stack:** Python 50,341. LangChain, LangGraph, Groq `llama-3.1-8b-instant`, Tavily, Chroma.
- **Notable details:**
  - "~40 saved runs".
  - Typical latency: react "~5–8s", reflection "~7–27s", memory "~16–41s", team "~8–35s".
  - Three bugs are documented and fixed, including a judge parser that "silently fell back to the default 5.0".
- **Demo/images:** None.
- **README quality:** Good.
- **Last push:** 2026-08-02. 6 commits.
- **Score: 3.**

**neuroux** — [GH:neuroux]
- **What:** Predicts brain activation from video, audio or text with Meta's TRIBE v2 fMRI model. It maps the prediction to 12 regions using the Destrieux atlas and outputs UX scores, a virality predictor and A/B comparison.
- **Stack:** Python 124,626, TypeScript 51,342. FastAPI, SQLAlchemy async, SSE, PyTorch, transformers, bitsandbytes and nilearn on the backend. Next.js 16, React 19, React Three Fiber, Recharts, Zustand and Tailwind 4 on the frontend.
- **Notable details:**
  - Text inference: "36 hours → 1 minute" via 4-bit NF4 LLaMA 3.2-3B (~2 GB VRAM). The body text says "~70 seconds" and "~50× faster than CPU".
  - Video inference: "50 minutes → ~80 seconds". "A 3-second clip now encodes in ~10 seconds".
  - Fixed an "everything ties" scoring bug by moving z-scoring from 20,484 vertices to the 12 ROIs.
  - Runs "on a 4 GB laptop GPU".
- **Demo/images:** Demo video `https://github.com/Arrnnnaav/neuroux/raw/main/docs/demo.mp4` (`docs/demo.mp4`).
- **README quality:** Excellent.
- **Last push:** 2026-05-08. 1 commit. Topics are set.
- **Score: 5.** It has a strong story, real speedups, a 3D UI and a demo video.

**DocCluster** — [GH:DocCluster] (README title "DocuCluster")
- **What:** Local semantic document clustering. Uploads are embedded with gte-small, reduced with UMAP, clustered with HDBSCAN and labelled with BERTopic. The results show on an interactive scatter or graph map, with hybrid BM25 + semantic search.
- **Stack:** Python 65,181, TypeScript 44,037. FastAPI with WebSockets, sentence-transformers, Flan-T5 or Ollama labelling, React, Plotly and D3.
- **Notable details:**
  - It has no numbers.
  - It is described as a "personal learning project" built from *Hands-On Large Language Models*.
  - The repo root holds a copy of a book-chapter PDF. Consider flagging this to the owner as a possible copyright concern.
- **Demo/images:** `docs/screenshot.png`, available at https://github.com/Arrnnnaav/DocCluster/raw/main/docs/screenshot.png.
- **README quality:** Good. The "Pipeline" section is empty.
- **Last push:** 2026-04-26. 5 commits. Topics are set.
- **Score: 4.** It is visual and has a screenshot, but it has no metrics.

### Learning tools

**StudyOS-Hackathon** — [GH:StudyOS-Hackathon]
- **What:** A learning workflow for engineering students (AWS First Commit Hackathon). The loop is Today → Point & Ask (a Chrome MV3 extension) → Save to Review, with spaced repetition.
- **Stack:** TypeScript 427,620, JS 86,194. Next.js 16, DynamoDB, S3, ECS Express, ECR, Secrets Manager, GitHub Actions OIDC, Gemini with NVIDIA NIM fallback, CloudFormation/SAM.
- **Notable details:**
  - Per-user quotas, idempotency keys and single-use pairing codes.
  - A CI gate runs tests, the type check and the build before deploy.
  - The README gives no metrics.
- **Demo/images:**
  - **LIVE DEMO:** https://le-eee1a14046a44cd1b2f9d6fe82789fda.ecs.us-east-1.on.aws/. It was not checked for uptime.
  - A 3-minute demo storyboard exists, but no video link.
  - `public/` holds only default Next.js SVGs, so there are no screenshots.
- **README quality:** Very good.
- **Last push:** 2026-09-20. 53 commits.
- **Score: 5.** It is the only public project with a live demo, and it has a full AWS delivery pipeline.

**LearningHQ** — [GH:LearningHQ] (README title "StudyOS — Unified Learning Platform")
- **What:** A unified learning platform: API, worker, student shell and operator console. It merges ideas from Learning HQ, DocCluster and Point & Ask.
- **Stack:** Python 211,487. FastAPI, SQLite in dev. The Compose stack adds PostgreSQL/pgvector, Redis and MinIO. Ollama, OpenAI or Anthropic tutor routes.
- **Notable details:** A long feature list and p50/p95 model telemetry. No numbers are reported. The repo root contains many committed `*.db` test files, which is a cleanliness issue.
- **Demo/images:** None.
- **README quality:** Good as a feature list, thin on outcomes.
- **Last push:** 2026-09-15. 1 commit.
- **Score: 3.** It overlaps with StudyOS-Hackathon.

**learning-hq-plugin** — [GH:learning-hq-plugin]
- **What:** A Claude Code / Codex plugin with `/lhq:sort` and `/lhq:doc` commands for the (private) Learning HQ tracker.
- **Stack:** JavaScript 1,065.
- **Demo/images:** None.
- **README quality:** Thin but clear.
- **Last push:** 2026-05-29.
- **Score: 2.** It links to the private `learning-hq`.

### ML / applied

**Sentiment-Analysis-API-DistilBERT** — [GH:Sentiment-Analysis-API-DistilBERT]
- **What:** DistilBERT fine-tuned on SST-2 and served with FastAPI, with single and batch endpoints.
- **Stack:** Python 16,695. transformers, datasets, PyTorch, FastAPI, scikit-learn.
- **Notable details:**
  - "Validation Accuracy 90.71%", "Weighted F1 90.70%".
  - Training took "~15 min (RTX 3050 Laptop 4GB)". Inference is "<10ms on GPU".
  - Published DistilBERT scores "91.3% (within 0.6%)".
  - Dynamic padding "reduces memory usage by over 4×".
- **Demo/images:** `assets/confusion_matrix.png`.
- **README quality:** Good. There is stray scaffold text at the end, and the clone URL is a placeholder.
- **Last push:** 2026-03-21.
- **Score: 3.**

**Image_Alignment** — [GH:Image_Alignment]
- **What:** A document-alignment microservice: ORB keypoints, Hamming brute-force matching, RANSAC homography. It runs on FastAPI and Docker.
- **Stack:** Python 14,133. OpenCV (headless), FastAPI, NumPy, Docker.
- **Notable details:** "500 ORB keypoints detected | Top 50 matches used". It has 3 endpoints. It enforces `max(4, int(len * 0.10))` minimum matches.
- **Demo/images:** `assets/aligned_output.png`, `assets/match_visualization.png`, `assets/test_images/` (form.jpg, scanned-form.jpg).
- **README quality:** Good. The clone URL is a placeholder.
- **Last push:** 2026-03-21.
- **Score: 3.**

**PaviaU-Hyperspectral-image-classification** — [GH:PaviaU-…]
- **What:** Benchmarks SVM, RF, MLP and a 3D CNN (HybridSN) on Pavia University, a dataset with 103 bands and 42,776 labelled pixels.
- **Stack:** Jupyter 1,565,134. PyTorch, scikit-learn.
- **Notable details:** The README calls these "Typical results", indicative and seed-dependent:

  | Model | OA | AA | Kappa |
  |---|---|---|---|
  | SVM | 94.52% | — | — |
  | RF | 91.61% | — | — |
  | MLP | 95.77% | — | — |
  | HybridSN | 99.9% | 99.89% | 0.9999 |

  PCA is fit on train only (no leakage). Reflect padding is used, and inference is batched to fit a 4 GB GPU.
- **Demo/images:** Plots are rendered inline in the notebook, and none are saved as files.
- **README quality:** Excellent.
- **Last push:** 2026-03-20.
- **Score: 3.**

**Indian-Pines-Hyperspectral-Image-** — [GH:Indian-Pines-…]
- **What:** 2D CNN, 3D CNN and a D2BERT Transformer on Indian Pines, in PyTorch, with a shared utility library.
- **Stack:** Jupyter 4,004,414, Python 13,636.
- **Notable details:** Indicative OA: 2D CNN "~99.34%", 3D CNN "~99.77%", D2BERT "~97.78%". It ports the Keras utilities to PyTorch, including `ZeroPad3DIfNeeded`.
- **Demo/images:** Notebook outputs only.
- **README quality:** Good.
- **Last push:** 2026-03-20.
- **Score: 3.**

### Computer-vision experiments (mid-2025)

| Repo | What | Stack (languages API) | Images/media | README | Last push | Score |
|---|---|---|---|---|---|---|
| AI_Personal_Trainer | MediaPipe Pose bicep-curl rep counter. Counts a rep when the angle goes >160° then <40°. | HTML 7,774 · Python 5,261 | The README image points to a local `file:///C:/…` path, so it is broken. The repo has `AIfitness.html`. | Thin | 2025-07-29 | 2 |
| Object_Tracking | Compares 8 OpenCV trackers (KCF, CSRT, MOSSE…) with FPS overlay | Python 2,942 | `race_car.mp4` (input video) | Thin, truncated | 2025-07-29 | 2 |
| Pose_Estimation | OpenPose (Caffe) via OpenCV DNN, 15 keypoints | Python 2,076 | `Milton_Golf_Swing.png` | Thin | 2025-07-29 | 2 |
| Virtual-Mouse-Hand-Tracking | Hand-gesture mouse control (MediaPipe + Autopy) | Python 6,298 | none | Thin, placeholder clone URL | 2025-07-05 | 2 |
| Vitrual_Painter (sic) | Virtual painting with hand tracking | Python 7,346 | `1.jpg`…`6.jpg` in root | None | 2025-07-04 | 1 |
| Finger_Counter | Finger counting with hand tracking | Python 4,206 | `f0.jpeg`…`f5.jpeg`, `Screen Recording 2025-07-04 034356.mp4` | None | 2025-07-03 | 2 |
| Gesture_Volume_Control | Thumb–index distance mapped to system volume (MediaPipe + Pycaw) | Python 5,342 | `Screen Recording 2025-07-03 042834.mp4` | Thin | 2025-07-03 | 2 |
| opencv | Shape detection and cropping scripts | Python 3,285 | none | None | 2025-05-20 | 1 |
| object_detection | Raspberry Pi object detection with the Google Vision API | Python 845 | none | One line | 2025-05-16 | 1 |

### Other
- **BuisnessHQ---Enterprise-Operations-Integration-Platform:** a public repo that is **empty** (no commits, no languages). Last push 2026-09-21. **Score: n/a.** The case study depends on the private repo or owner-supplied material.
- **hive:** a fork, skipped.

### Private repos (not read — ask owner)
BuisnessHQ, smb-safeops, UNIfied, PointAI, trading-bot, learning-hq — **private, ask owner.**

---

## 3. Recommended selection

### Flagship case studies (6)
1. **Project Edge Node.** Resume internship work with committed benchmark evidence.
2. **Cited Multi-Agent Researcher.** Resume project; agentic LLM work.
3. **LedgerBridge (AI Finance Controller).** The strongest evidence and scale numbers; fintech.
4. **GhostCursor (AIOS).** Bounded-AI safety engineering: 282 commits, 361 tests.
5. **NeuroUX.** Big performance wins, a 3D UI and a demo video.
6. **StudyOS.** A live AWS deploy and a Chrome extension.

**Seventh slot, pending:** **BusinessHQ** (resume, Java/Spring backend). It only becomes usable once the owner shares repo access or supplies material. It adds the Java/Spring side, which nothing else public shows.

**Alternates:** Pricing-Agent (4), DocCluster (4; has a screenshot).

### "More work" groups
- **Agents & evaluation:** Pricing-Agent, agent-benchmark.
- **Retrieval & NLP:** DocCluster, Sentiment-Analysis-API-DistilBERT.
- **Learning tools:** LearningHQ, learning-hq-plugin.
- **Hyperspectral classification (Mar 2026):** PaviaU, Indian Pines.
- **Classical CV services:** Image_Alignment.
- **Computer-vision experiments (mid-2025):** AI_Personal_Trainer, Object_Tracking, Pose_Estimation, Virtual-Mouse-Hand-Tracking, Vitrual_Painter, Finger_Counter, Gesture_Volume_Control, opencv, object_detection. Show these as one grouped tile, not one each.

---

## 4. Flagship case-study drafts

### 4.1 Project Edge Node
- **Title:** Project Edge Node — offline telemetry classifier
- **Problem:** Classify a day of workplace telemetry as FOCUS, NEUTRAL or BURNOUT without data ever leaving the machine.
- **Role:** Backend Engineering Intern, Dehurdle (Jun–Aug 2026) [R]
- **Stack:** Python, FastAPI, Pydantic, Ollama (Qwen3 4B), Docker Compose, Faker, pynvml
- **Approach:**
  1. Validate telemetry with Pydantic and translate it into plain prose, because small models handle natural language better than raw JSON.
  2. Classify locally with a JSON-schema-constrained, temperature-0 model. On bad output, retry up to 3 times with self-correction, then return a 502.
  3. Benchmark 50 real requests plus 10 TTFT requests for latency, RAM and VRAM. Trace a ~2s gap to IPv6-first `localhost` resolution and switch to `127.0.0.1`.
- **Result:** Mean latency went from 5.356s to 0.973s. P95 is 1.080s and TTFT mean is 0.351s, all over 50 requests with 0 failures. [GH benchmark_report.md] The resume also says the benchmark chose Qwen3-4B Q4_K_M. [R]
- **Links:** https://github.com/Arrnnnaav/Project-Edge-Node
- **Images:** none. Needs a screenshot of the Swagger `/docs` page or a benchmark chart built from the report tables.
- **Owner check:** can this internship project be public and named with Dehurdle?

### 4.2 Cited Multi-Agent Researcher
- **Title:** Cited Multi-Agent Researcher
- **Problem:** Answer research questions with grounded, cited responses, scaling the search effort to the question.
- **Role:** Solo builder [R]
- **Stack:** Python, FastAPI, Gemini Flash (grounding), asyncio, SSE, TypeScript/Vite frontend, pytest
- **Approach:**
  1. The orchestrator classifies each query as fact or comparison and decomposes it. A fact query gets 1 search agent; a comparison gets up to 5 parallel agents.
  2. The CitationAgent dedups sources across agents, assigns `[N]` IDs and scores credibility. The SynthesisAgent writes an answer with inline citations, streamed over SSE.
  3. An LLM-as-judge scores factuality and citation coverage on 10 test queries. The repo has 33 unit tests.
- **Result:** End-to-end time went from 152s to 26s via `asyncio.to_thread`. [R only; not in README]
- **Links:** https://github.com/Arrnnnaav/Cited-Multi-Agent-Researcher
- **Images:** none. Needs a UI screenshot or a screen recording of the streamed answer with its sources sidebar.

### 4.3 LedgerBridge — AI Finance Controller
- **Title:** LedgerBridge — auditable bank, ledger and Razorpay reconciliation
- **Problem:** Match bank, ledger and payment-processor records so that every decision, and every unresolved record, carries its rule and evidence. An AI must never decide.
- **Role:** Solo builder, Razorpay Buildathon Track 04 [GH]
- **Stack:** Python (Decimal arithmetic), indexed matcher, Ollama narration with a template fallback, HTML dashboard, pytest
- **Approach:**
  1. Run a deterministic 3-pass matcher (exact → amount/date → fuzzy) with indexed lookups. Ties resolve to `AMBIGUOUS_MATCH` instead of an arbitrary pick.
  2. Classify exceptions into 8 codes, each with a severity, action, approval requirement and stop condition. Keep a full audit hash chain. Match Razorpay many:1 payout batches separately.
  3. Keep the evidence honest: a sealed benchmark frozen before its first evaluation, a multi-seed robustness run and a committed scale benchmark.
- **Result:**
  - Demo: "77 records · 62 matched · 15 evidenced exceptions". "94.9% INR record-value coverage".
  - Scale: "103,049 records · 5.114s median engine time (n=5) · ~20.1k rec/s".
  - Tests: 45/45.
- **Links:** https://github.com/Arrnnnaav/LedgerBridge-AI-
- **Images:** none in the README. Render the committed `demo_dashboard.html` or `heldout_dashboard.html` for screenshots.

### 4.4 GhostCursor (repo: AIOS)
- **Title:** GhostCursor — a local AI guide that points but never clicks
- **Problem:** Help people learn unfamiliar desktop software without handing an AI control of the mouse and keyboard.
- **Role:** Solo builder [GH]
- **Stack:** Python 3.12, Windows UI Automation, OCR fallback, Ollama `qwen3:4b-instruct`, SQLite, pytest
- **Approach:**
  1. The local model classifies a goal only into registered intent IDs. Actions may come only from a digest-bound, reviewed recipe catalog. Model-generated paths, coordinates and code are rejected.
  2. It highlights one observed control, waits for the human, then verifies the resulting app state. It gives wrong-action feedback and has an always-available stop.
  3. A frozen 30-case model gate measures raw model quality separately from execution authority.
- **Result:**
  - "90% (27/30) raw intent accuracy, 100% on exact supported goals, and zero unauthorized plans".
  - "zero of 60 runs changed which recipe executes".
  - "all 361 hermetic tests" passed.
  - 3 real VS Code workflows each passed 3/3 human-driven runs.
- **Links:** https://github.com/Arrnnnaav/AIOS
- **Images:** none. A 4:45 demo script exists at `docs/submission/demo-video-script.md`. The owner should record the video.

### 4.5 NeuroUX
- **Title:** NeuroUX — brain-response UX scoring
- **Problem:** Score how media might engage attention and emotion, using an actual fMRI-trained model instead of a sentiment classifier.
- **Role:** Solo builder [GH]
- **Stack:** Python, FastAPI, PyTorch, bitsandbytes, nilearn, SSE; Next.js 16, React 19, React Three Fiber, Recharts, Tailwind 4
- **Approach:**
  1. Run Meta's TRIBE v2 to predict activation over 20,484 cortical vertices. Map it to 12 Destrieux-atlas regions.
  2. Make it run on a 4 GB laptop GPU: 4-bit NF4 LLaMA for text, and fp16 V-JEPA2 on the GPU for video.
  3. Fix the "everything ties" scoring bug by moving z-scoring from vertices to the 12 ROIs and reweighting the formulas.
- **Result:** Text inference went from "36 hours → 1 minute" (~70 s for 350 words). Video inference went from "50 minutes → ~80 seconds". [GH]
- **Links:** https://github.com/Arrnnnaav/neuroux
- **Images:** demo video https://github.com/Arrnnnaav/neuroux/raw/main/docs/demo.mp4. Needs stills of the 3D brain and radar views.

### 4.6 StudyOS
- **Title:** StudyOS — learn next, ask in context, remember
- **Problem:** Students lose momentum. They don't know what to learn next, they get confused away from their dashboard, and helpful answers disappear.
- **Role:** Builder, AWS First Commit Hackathon. **Team or solo? Owner to confirm.**
- **Stack:** TypeScript, Next.js 16, Chrome MV3 extension, DynamoDB, S3, ECS Express, ECR, Secrets Manager, GitHub Actions OIDC, Gemini/NVIDIA NIM
- **Approach:**
  1. "Today" gives the student one next topic that respects prerequisites.
  2. With Point & Ask, the student selects text or boxes a region in Chrome and asks about it. The answer is grounded in the exact context, and no full page is sent by default.
  3. Helpful answers become spaced reviews. The app deploys through OIDC and CI, and a failed test, type check or build blocks the deploy.
- **Result:** The live public demo is deployed on AWS ECS. The README reports no quantitative metrics.
- **Links:**
  - https://github.com/Arrnnnaav/StudyOS-Hackathon
  - live: https://le-eee1a14046a44cd1b2f9d6fe82789fda.ecs.us-east-1.on.aws/ (uptime unverified)
- **Images:** none. Take screenshots from the live demo.

### 4.7 (Pending) BusinessHQ
- **Title:** BusinessHQ — Enterprise Operations & Integration Platform (Aug 2026)
- **Stack:** Spring Boot, JPA, MySQL, REST, SOAP, JUnit, Docker [R]
- **Result:** "180ms→35ms over 10k records via indexes"; "35+ JUnit/Mockito scenarios" [R only]
- **Blocked:** the public repo is empty and the private repo was not read. The owner must provide access, a README or screenshots.

---

## 5. Positioning and bio

### Positioning line options
1. "Backend and AI engineer. I build local-first LLM systems and measure them."
2. "I build backends and AI pipelines that are fast, auditable and honest about their numbers."
3. "Electrical engineering student at MNIT Jaipur building FastAPI, Spring Boot and local-LLM systems."

### Bio draft (first person)
> I'm Arnav Khandelwal, a software engineer studying Electrical Engineering at MNIT Jaipur. This summer I was a backend engineering intern at Dehurdle. There I built an offline FastAPI telemetry service and cut its latency from 5.3s to 1.0s by tracing a localhost DNS issue. Most of my projects are backends and AI systems that run locally: multi-agent research with citations, deterministic finance reconciliation, and a desktop guide that points at controls but never clicks them. I benchmark what I build and write down where the numbers come from. I was part of Amazon ML Summer School '25.

(Every claim traces to [R] or [GH]. Optional line: "JEE Main 98.6 percentile; Asian Championship skating bronze (2018).")

---

## 6. Gaps — owner must supply or confirm
1. **Email:** `arnavkhandelwal446@email.com` looks like a typo. Confirm the real address and provider.
2. **LinkedIn:** confirm https://linkedin.com/in/arnav-khandelwal.
3. **Location:** confirm "Jaipur, India" for display. The GitHub profile has none.
4. **Headshot or photo:** none available.
5. **Screenshots and GIFs** for Edge Node, Cited Researcher, LedgerBridge (dashboard HTML can be rendered), GhostCursor (demo video), StudyOS (from the live demo) and NeuroUX stills.
6. **Live demos:** only StudyOS has one, and its uptime is unverified. Does the owner want hosted demos elsewhere?
7. **Private repos:** get permission or material for BuisnessHQ (a resume project; its public repo is empty), smb-safeops, UNIfied, PointAI, trading-bot and learning-hq.
8. **Unsourced resume numbers:**
   - Cited Researcher: 152s→26s.
   - BusinessHQ: 180ms→35ms and 35+ tests.
   - Edge Node: Q4_K_M quant choice.

   Provide a source, or accept them as resume-attested.
9. **Date mismatch:** the resume dates Cited Researcher to Jun 2026, but the repo was created 2026-07-26. Confirm the date.
10. **Dehurdle disclosure:** confirm that Project Edge Node may be shown publicly and attributed to Dehurdle.
11. **StudyOS:** solo or team? Were there any hackathon results?
12. **Repo hygiene (optional before linking):**
    - Placeholder `yourusername` clone URLs in Image_Alignment, Sentiment and Virtual-Mouse.
    - A broken `file:///` image in AI_Personal_Trainer.
    - The book PDF committed in DocCluster.
    - `*.db` files committed in LearningHQ.
    - Missing READMEs in Vitrual_Painter, Finger_Counter and opencv.
    - Typos in repo names: "BuisnessHQ", "Vitrual_Painter".
    - Sparse history: Cited Researcher, neuroux and LearningHQ each have 1 commit.
13. **Resume PDF** for download: not provided.
