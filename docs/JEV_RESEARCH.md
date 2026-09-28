# Jev in UIBuilder — research and bounded pilot (2026-09-28)

## What it is

[TypeSafe's introduction](https://typesafe.ai/blog/introducing-system-one-models-and-jev) and [official docs](https://docs.typesafe.ai/introduction) describe Jev as a model that receives text/structured state and returns typed Choice, Score or Noul judgments with probabilities. It does not generate a design, page, code, image or explanation. The official [quick start](https://docs.typesafe.ai/introduction/quickstart) documents `POST /v1/systemone` and `TYPESAFE_API_KEY`; the current response to our probe identified `jev-1.13.0`. The [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) exists, but the pilot uses a small direct HTTP adapter to avoid a root dependency.

The official launch post quotes $0.042 per million input tokens with free output tokens and 70–500 ms latency. Those are provider claims and can change; check current pricing before expanding use. The root ignored `.env` is now a standard `TYPESAFE_API_KEY=...` assignment. The key is read server-side only, never logged, shipped to a site or committed.

## Best fit by priority

| Priority | Possible UIBuilder use | Code's hard boundary | Next evaluation |
|---|---|---|---|
| 1 | Suggest specialist/skill for a messy natural-language task | Stage contracts and orchestrator still decide dispatch | Compare with 50 labeled real task requests, including no-match and ambiguous cases. Official [skill suggestion cookbook](https://docs.typesafe.ai/cookbooks/skill_suggestion) uses a rank/recheck pattern. |
| 1 | Score candidate internal links for topical usefulness | Crawl actual routes, resolve URLs, validate anchors/canonicals and avoid duplicate/looping links deterministically; Jev only scores surviving candidate pairs | Label at least 50 relevant/irrelevant source-anchor-target triples. Measure precision at review threshold. |
| 2 | Rank research snippets or reference descriptions | Provenance, trust, rights and owner preferences remain hard filters | Compare with deterministic `recommend-resources.mjs` on labeled queries. |
| 2 | Check whether a proposed claim/FAQ answer is supported by a cited source | Source retrieval and exact quotation/URL checks stay deterministic; human verifies publication | Follow official [citation cookbook](https://docs.typesafe.ai/cookbooks/citation_check), measure false approvals. |
| 3 | Classify build/test failures and detect repetitive agent loops | No automatic retry budget, gate waiver or permission decisions | Collect real traces and labeled failure categories first. |
| 3 | Tag timecoded visual observations | A human/vision tool describes video frames first; Jev only classifies the text | Evaluate against taste agent labels. |

The official [reranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe) and [skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) cookbooks are closer to UIBuilder's needs than a general-purpose model router. Jev can help choose between known options; it cannot make a missing option appear. The [model jaggedness page](https://docs.typesafe.ai/model-jaggedness/jev-1.13) and our low-confidence probe are reasons to retain abstention and fallback behavior. A typed answer is not proof that the judgment is true.

## Existing projects and community signals

- [Jev Search](https://github.com/superagents-lab/jev-search) uses typed query/source choices and result ranking; search engines still retrieve results and code deduplicates URLs. This is a useful analogue for internal-link candidates.
- [Jev Voice Browser](https://github.com/moritzkremb/jev-voice-browser) keeps browser memory in explicit state and uses Jev for bounded action choices. UIBuilder should similarly keep stage state in files.
- A [Reddit Pi Coding Agent discussion](https://www.reddit.com/r/PiCodingAgent/comments/1whsav6/anyone_else_testing_out_typesafe_ais_new_system/) discusses router ideas and doubts about judgment quality. These are user anecdotes, not benchmark evidence.
- An [X search of the official account](https://x.com/typesafeai) did not yield verifiable implementation detail beyond the official site. Do not treat social posts or third-party “Jev” domains in screenshot reels as API documentation.

## Implemented pilot

- `scripts/jev.mjs probe` sends synthetic text. `classify route|link <file> --public` sends only the explicitly marked public text file to TypeSafe. All results are `mode: shadow`; no agent dispatch, link edit or gate change occurs.
- `scripts/recommend-resources.mjs` is the deterministic first pass. It hard-filters trust, rights and tool availability; Jev is not wired into its ready list.
- `scripts/eval-jev.mjs` uses six synthetic labeled cases. [Result](evidence/jev-shadow-eval-2026-09-28.json): 6/6 correct, 0 abstained, 0 errors in this tiny sample. An earlier separate visitor request produced a low-confidence UX classification and abstained. Neither result establishes production accuracy.

Next: build a labeled corpus from UIBuilder's real public tasks and link pairs, compare precision/recall, latency and cost with the deterministic baseline, then decide whether Jev should suggest candidates in review mode. It must never pass G1/G2/G2.5/G3/G3.5, validate a license, suppress a security finding or authorize a deployment.
