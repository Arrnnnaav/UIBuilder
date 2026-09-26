# Model routing review for UIBuilder

Reviewed 2026-09-26. Recommendation: native model selection by agent role first; JEV as an optional measured experiment. No router has been enabled in UIBuilder or in the user's CLI configuration.

## What was checked

Cloned `gargpratyush/jev-router` into the ignored `.tool-cache/jev-router` directory at commit `38da6b84ea01241bfc41fbddc0928d0f40a703f0`. Read routing policy, classifier request construction, Claude and Codex proxies, settings restoration, status storage, tests, dependency lock and CI. Installed its one locked dependency only inside that research checkout, with lifecycle scripts disabled. No API keys or real prompts were supplied. Mock tests: 64 passed, 1 skipped on Windows, 0 failed. Dependency audit: 0 known vulnerabilities. Retained outputs are in `docs/evidence/jev-router-tests.txt` and `jev-router-audit.txt`.

This is a source review and local mock verification, not an independent security audit or a live savings benchmark. Alternatives were reviewed through their official documentation, not tested locally.

## JEV: strengths and limits

The [project](https://github.com/gargpratyush/jev-router) wraps native Claude Code and Codex with a loopback proxy. It classifies a fresh user turn using TypeSafe, selects from account models, then forwards requests using the existing CLI authentication. It is particularly relevant to someone already paying for native subscriptions. Subscription allowances still apply; a router does not create more quota.

Source findings at the pinned commit:

- [Routing policy](https://github.com/gargpratyush/jev-router/blob/38da6b84ea01241bfc41fbddc0928d0f40a703f0/src/policy.mjs): explicit overrides, low-confidence protection and a guard against downgrading after approximately 20,000 context tokens. This guard is a heuristic; it is not an exact cache-cost calculation.
- [Classifier](https://github.com/gargpratyush/jev-router/blob/38da6b84ea01241bfc41fbddc0928d0f40a703f0/src/router.mjs): 1.5-second attempt timeout, one retry, 3-second outer deadline, and fallback on errors. Sends extracted prompt text, current model, approximate context size, available models and classification questions. It does not send the complete conversation through this classifier request.
- [Claude proxy](https://github.com/gargpratyush/jev-router/blob/38da6b84ea01241bfc41fbddc0928d0f40a703f0/src/proxy.mjs): binds to `127.0.0.1`; keeps routing state per conversation, including subagents; forwards authorization headers upstream. Its comments explicitly acknowledge undocumented CLI request shapes. Local proxy code is consequently inside the credential trust boundary.
- [Codex proxy](https://github.com/gargpratyush/jev-router/blob/38da6b84ea01241bfc41fbddc0928d0f40a703f0/src/codex-proxy.mjs): changes request models and injects commentary into response streams; cold-start defaults include GPT-5.6 models, while discovered account catalogs can supply newer models. Tier assignment partly uses model-name heuristics. Compatibility needs checking after CLI/model updates.
- [Status storage](https://github.com/gargpratyush/jev-router/blob/38da6b84ea01241bfc41fbddc0928d0f40a703f0/src/status.mjs): saves prompt text and classifier exchanges for the last 20 decisions, prunes files older than seven days when another write triggers cleanup. It is not a guaranteed deletion timer. POSIX permissions are set, but Windows ignores those modes; the Windows permission test is skipped. Windows ACL protection remains unverified.
- Both proxies buffer incoming bodies without an explicit size limit. The inspected forwarding paths lack an explicit upstream deadline. Their loopback binding reduces network exposure but does not isolate them from other local processes.
- `JEV_DEBUG` can log prompt excerpts; `JEV_DUMP` writes complete request bodies. Leave these disabled for client work.
- Defensive policy gap reproduced: `decide({prompt:'fix this', jev:{choice:'haiku'}, current:'opus', available:['haiku','sonnet','opus'], contextTokens:1000})` returns a Haiku downgrade despite missing confidence. This demonstrates missing validation in that function; it does not establish that normal TypeSafe responses omit confidence.
- The dependency lock pins SDK 0.6.0. Package metadata says 0.3.0 while the lock root says 0.2.0. CI shown at this commit runs mock tests on Ubuntu for pull requests. None of these findings proves malicious behavior; none establishes reliable production savings either.

The largest UIBuilder limitation is contextual: the classifier gets the new prompt, not the repository's full design contract, gate evidence or conversation. A short instruction such as “resume” can mean difficult integration work. Cheap classifications can produce expensive retries unless the orchestrator pins a suitable model for that stage.

## Privacy and price

TypeSafe's [privacy policy](https://typesafe.ai/legal/privacy-policy) says inputs are not used to train or fine-tune models and are disclosed only to service providers. It nevertheless collects inputs and describes retention according to business/service needs; it does not publish a fixed zero-retention guarantee there. Confidential prompts therefore introduce another processor. A prompt can contain pasted code, client facts or credentials even when the full conversation is excluded.

The official [TypeSafe site](https://typesafe.ai/) advertises **$42 per billion input tokens**, equivalent to **$0.042 per million**. Illustratively, 10 million billable classifier input tokens would cost $0.42 at that advertised rate. State, rubrics and model descriptions add input beyond the visible prompt. This is not a complete account quote: free credits, minimum spend, output treatment and actual metering were not verified in an authenticated billing console. Native model usage and any optional extra credits remain separate.

## Alternatives

| Option | Cost structure | Useful for | Main tradeoff | UIBuilder recommendation |
| --- | --- | --- | --- | --- |
| Native Claude/Codex model selection | Existing plan/API usage; no extra routing service | Roles and stages with known complexity | Orchestrator must choose deliberately | Start here |
| JEV Router | MIT wrapper; TypeSafe classification plus native usage | Per-turn selection inside existing native CLI accounts | Prompt processor, private CLI formats, heuristic choices | Isolated trial only |
| Claude Code Router | MIT local software; selected providers bill separately | Cross-provider routing, fallback chains and logs | Larger local control plane and credential/configuration surface | First local gateway candidate when multiple providers are needed |
| OpenRouter Auto | Selected model API rate plus applicable platform fees; no additional Auto fee | Managed model routing without operating a gateway | Separate API budget and external processing | First managed API candidate |
| LiteLLM | Self-hosted core plus hosting/inference; some features are add-ons | Shared gateway, budgets, routing and observability across applications | Operational work and release provenance checks | Later, when UIBuilder needs a shared service |
| RouteLLM | Apache 2.0 framework plus compute, inference and possible embeddings | Training/calibrating a router on your own workload | Older model-pair training; evaluation required | Research option, excess setup for now |

Evidence and qualifications:

- Claude's official [`opusplan`](https://code.claude.com/docs/en/model-config) uses Opus for planning and Sonnet for execution. [Cost guidance](https://code.claude.com/docs/en/costs) also covers model selection and context management. These are supported controls and avoid a new classifier service.
- Official [Codex model guidance](https://developers.openai.com/codex/models) recommends Sol for complex work and Luna for focused, repeatable tasks, subject to account/client availability. [Plan usage](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) still applies. Do not confuse native subscriptions with API credits.
- [Claude Code Router](https://github.com/musistudio/claude-code-router) documents a local gateway, provider adapters, routing rules and ordered fallbacks. It is broader than JEV. MIT licensing does not make provider inference free or guarantee every subscription integration is supported by its provider.
- [OpenRouter pricing](https://openrouter.ai/pricing) currently lists a 5.5% Standard platform fee and a 50-request/day Free plan; Auto is listed on Standard, not Free. [Auto documentation](https://openrouter.ai/docs/guides/routing/routers/auto-router) provides cost tiers, model restrictions and `provider.max_price`, and says no additional Auto fee. Use the stable router's matching plugin ID: wrong IDs silently ignore routing settings. Auto is not a guarantee of choosing the absolute cheapest model.
- [LiteLLM core routing](https://docs.litellm.ai/docs/routing) offers cost/latency/load strategies. Its difficulty-based [Auto Router](https://docs.litellm.ai/docs/auto_router/) is labeled an add-on; its price/license entitlement needs confirmation before a free deployment assumption. The vendor disclosed compromised PyPI versions 1.82.7/1.82.8 in its [March 2026 incident](https://docs.litellm.ai/blog/security-update-march-2026), then documented [release signing and verification](https://docs.litellm.ai/blog/security-townhall-updates). This history makes artifact verification important, not proof that every subsequent release is compromised.
- [RouteLLM](https://github.com/lm-sys/RouteLLM) includes calibration and evaluation tools. Its default trained routers originate from GPT-4/Mixtral comparisons; benchmark savings do not establish savings on UIBuilder's coding/design workload. Some routers also need OpenAI embeddings, so local hosting alone does not guarantee prompts remain local.
- Checked the required [free-for-dev catalog](https://github.com/ripienaar/free-for-dev); its listings are discovery aids. Provider pricing above takes precedence over catalog claims.

## Recommended UIBuilder approach

1. Keep strong models for the orchestrator, design direction/critic, security and unknown-cause debugging. Use balanced models for bounded frontend/backend implementation. Use cheaper models for extraction, formatting and structured summaries with deterministic validation.
2. Pin the model through each tool loop/stage. Keep G1/G2 approvals, G3 thresholds, independent reviews and handoff files unchanged.
3. If trialing JEV, use a separate CLI session, a reviewed pinned version, synthetic/public prompts, debug dumping off and a capped classifier account. Verify actual selected models, settings restoration after interrupted sessions and Windows file ACLs before confidential work.
4. Compare 20–30 representative tasks against role-based selection. Record successful acceptance, retries, wall-clock duration, billable usage/cache rebuilds and classifier overhead. Evaluate **cost per accepted task**, not cheaper calls alone. Approve adoption only with measured savings and no acceptance regression; do not invent a savings percentage now.

Setup effort is small for a CLI experiment and materially larger for trustworthy pipeline integration. JEV is worth experimenting with; it is not yet justified as UIBuilder's default dependency.
