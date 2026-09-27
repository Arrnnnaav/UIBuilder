# Portfolio performance report

Status: pending. The strict G3 performance requirement has not passed.

## Latest completed measurement

The clean production build before the SVG hydration fix returned a three-run home/mobile median of performance 92, accessibility 100, best practices 96, SEO 100, LCP 2665ms and CLS 0. The command exited 1 because LCP must be strictly below 2500ms. Actual retained output is `docs/evidence/perf-home-median.txt`; raw runs are `.lighthouse/mobile-home-{1,2,3}.json`.

Server-side environment validation now passes only public analytics key/host values to Analytics, removing Zod from the shared browser bundle. Optional PostHog remains lazy and absent-key monitoring no-ops. A single earlier probe reached LCP 2307ms but performance 84; neither a single favorable metric nor incomplete route coverage proves the gate.

## Required next measurement

Fresh clean production measurement after hydration repair: performance 96,
accessibility/best practices/SEO 100, LCP 2708ms, CLS 0; exit 1.
Actual output: `docs/evidence/perf-home-after-hydration.txt`.
An isolated same-family content-font experiment reduced the font transfer from
about 91KB to 45KB but the median LCP was still 2703ms; output:
`docs/evidence/perf-home-font-probe.txt`. The experiment was reverted because it
did not resolve the measured bottleneck. The approved full Google Fonts Archivo
configuration and all existing baselines remain the intended implementation.
The experimental server was stopped. Its artifact is being replaced by the clean
approved-font build with batched observer startup; do not deploy experimental artifacts.

The approved-font build with batched observer startup passed compilation and
TypeScript. Its home/mobile median remained performance 96, other categories 100,
LCP 2710ms, CLS 0, exit 1 (`docs/evidence/perf-home-batched-observer.txt`). The
observer change removes interleaved synchronous geometry reads and corrects the
50% visibility boundary, but this measurement does not demonstrate an LCP gain.
Full route/profile performance and G3 remain incomplete.

Narrowing the footer's serialized project props to title/slug improves the
home/mobile median to performance 97, accessibility/best practices/SEO 100,
LCP 2557ms and CLS 0 (`docs/evidence/perf-home-footer-payload.txt`). This remains
above the strict limit. Disabling current-home wordmark prefetch and using a
native in-page work anchor measures LCP 2559ms; no LCP improvement is claimed
for that change (`docs/evidence/perf-home-prefetch.txt`).

The SVG title hydration correction removes a proven client rerender defect. After browser verification completes, rebuild without Turnstile test keys, dry-run delivery or the intentional error fixture. Measure home/mobile again, then all 12 published routes in desktop and mobile with three runs each. Inspect actual Lighthouse traces before any further optimization. Keep category scores at least 90, LCP strictly below 2500ms and CLS strictly below 0.1; do not change throttling or thresholds to manufacture success.

The latest clean build, including the Footer server/client split and server-rendered navigation icon, was measured on 2026-09-27: three-run mobile-home median performance 96, accessibility/best-practices/SEO/agentic-browsing 100, LCP 2708ms, CLS 0. The run exits 1 because LCP is 208ms above contract. Evidence: `.lighthouse/summary.json`; prior retained experiments remain for comparison. No performance win is claimed for this change. Full 12-route desktop/mobile coverage remains outstanding.

No deployed real-user measurements exist yet. Production field behavior and configured monitoring receipts require verification after deployment.
