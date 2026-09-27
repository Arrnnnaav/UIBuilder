# Mobile LCP investigation

Date: 2026-09-28. Scope: read-only audit plus temporary, reverted experiments; no deploy.

## Finding

The gate uses Lighthouse's **simulated** mobile metrics (`throttlingMethod: "simulate"`, 4× CPU slowdown, 562.5ms request latency, 1.47Mbps download). The LCP breakdown insight comes from the **observed, unthrottled trace**. Those are different measurements, which explains why the breakdown's small TTFB/render-delay figures do not sum to the gate's LCP.

Example from the fresh clean-source `.lighthouse/mobile-work-1.json` run (`2026-09-27T23:33Z`):

- Simulated FCP 755ms; simulated LCP 2555ms; simulated TTFB 453ms.
- Observed FCP and LCP both 177ms; observed TTFB in the LCP breakdown 6.1ms; text element render delay 171.1ms.

The fresh three-run, 24-profile matrix is in `docs/evidence/perf-final-summary.json`; full command output is in `docs/evidence/perf-run-final.txt`. Simulated mobile LCP medians: `/` 2709ms, `/work` 2558ms, `/work/edge-node` 2707ms, `/work/cited-researcher` 2707ms, `/work/ledgerbridge` 2706ms, `/work/ghostcursor` 2707ms, `/work/neuroux` 2707ms, `/work/studyos` 2706ms, `/about` 2559ms, `/contact` 2558ms, `/resume` 2558ms and `/styleguide` 2857ms. All miss the required strict `<2500ms` simulated LCP gate. Desktop passes on all 12 routes. The LCP candidates are above-the-fold text; exact selectors vary by page template.

This is not grounds to replace or weaken the gate: it is the repository's chosen simulated mobile contract. Observed local paint is useful diagnostic evidence, not a passing gate result.

## Controlled diagnostic probes

The default Lighthouse call used by `scripts/perf.mjs` was kept unchanged. URL blocking was only a causal diagnostic; it broke client runtime and raised console errors, so none of these results is a product fix.

- Blocking all `/_next/static/chunks/*.js` on `/work` moved simulated LCP from about 2557ms to 1808ms, with observed LCP 91ms. The page remains SSR-readable, but JavaScript is broken.
- Blocking only the shared `26-1rt-bpkfke.js` React/Next vendor chunk gave repeatable simulated LCPs: `/` 2406, 2408, 2408ms; `/work/edge-node` 2259, 2260, 2259ms; `/styleguide` 2408, 2408, 2407ms. Every run had a console error from the deliberately blocked chunk. This shows that the shared framework runtime materially affects UIBuilder's simulated LCP; it does not establish that shipping without hydration is acceptable.
- Blocking the shared CSS file on `/styleguide` changed simulated LCP from 2865ms to 2729ms (~136ms), while removing site styling. The raw Lighthouse render-blocking insight separately estimated ~153–154ms savings for the ~10.4KB transferred global stylesheet. This is a contributing opportunity, insufficient by itself for the worst routes.

## Rejected source experiments

Each source edit was temporary and has been reverted.

| Experiment | Exact command | Mobile LCP runs | Result |
|---|---|---|---|
| `.page-section { content-visibility:auto; contain-intrinsic-size:auto 900px }` | `pnpm build`; `pnpm start -- --port 3401`; direct Lighthouse default mobile calls to `/` (3 runs) | 2711, 2708, 2708ms; baseline median 2706ms | No gain; reverted without testing other routes. |
| Archivo `display: "swap"` → `display: "optional"` | `pnpm build`; `pnpm start -- --port 3401`; default Lighthouse mobile, 3 runs each on `/`, `/work`, `/styleguide` | Medians 2709, 2558, 2857ms; baseline 2706, 2556, 2857ms | No gain; all routes still fail; reverted. |

The font experiment does not justify changing approved typography. The prior measured font-subset and `font-display` probes in `PERF_REPORT.md` likewise showed no reliable gain. The `content-visibility` result rejects that below-fold hypothesis for home; no broader claim is made.

## Commands used

Baseline commands: `PERF_RUNS=3 pnpm perf -- http://localhost:3401` and `pnpm build` followed by `pnpm start -- --port 3401`.

Representative-route probe (same Lighthouse defaults as mobile `scripts/perf.mjs`; only the optional URL block differs in diagnostic calls):

```powershell
node -e "(async()=>{const {chromium}=require('@playwright/test'),{default:lighthouse}=await import('lighthouse');const b=await chromium.launch({args:['--remote-debugging-port=9338']});try{for(const route of ['/','/work/edge-node','/styleguide']){for(let n=1;n<=3;n++){const {lhr}=await lighthouse('http://localhost:3401'+route,{port:9338,output:'json',logLevel:'error',blockedUrlPatterns:['http://localhost:3401/_next/static/chunks/26-1rt-bpkfke.js']});const m=lhr.audits.metrics.details.items[0];console.log(JSON.stringify({route,run:n,simFcp:m.firstContentfulPaint,simLcp:m.largestContentfulPaint,obsLcp:m.observedLargestContentfulPaint,interactive:m.interactive,perf:lhr.categories.performance.score,consoleErrors:lhr.audits['errors-in-console'].score}));}}}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)})"
```

## Next step

No source change from this investigation is justified. To clear G3 without touching the threshold, pursue a design-preserving reduction of client runtime required during the first mobile load, or a static HTML architecture for the marketing routes with the contact action hosted separately. Measure the full mobile route matrix and retain all navigation, form, accessibility, and motion requirements before accepting either direction. Do not treat the URL-blocking probes as passing evidence.
