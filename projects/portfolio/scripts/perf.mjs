#!/usr/bin/env node
// Lighthouse gate that works on Windows: Playwright launches Chromium (no chrome-launcher
// temp-dir cleanup), Lighthouse attaches over the debugging port.
//
//   node scripts/perf.mjs [baseUrl]    default http://localhost:3000
// Checks every published page, including the indexable styleguide (desktop + mobile), median of
// PERF_RUNS (default 3) runs per page.
// Exit 1 if any category < 0.9, LCP >= 2500ms or CLS >= 0.1. Writes .lighthouse/summary.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] ?? process.env.PERF_URL ?? "http://localhost:3000").replace(/\/$/, "");
const routes = JSON.parse(readFileSync(join(root, "content/seo/routes.json"), "utf8"));
const targets = Object.entries(routes)
  .filter(([route]) => route !== "/e2e-error")
  // Optional profiling subset; G3 independently rejects incomplete summaries.
  .filter(([route]) => !process.env.PERF_ROUTES || process.env.PERF_ROUTES.split(",").includes(route))
  .map(([r]) => r);
const PORT = 9333;
const MIN = 0.9;
// Lighthouse's simulated throttling is noisy on a busy machine; take the median run.
const RUNS = Number(process.env.PERF_RUNS ?? 3);
if (!Number.isInteger(RUNS) || RUNS < 1) throw new Error("PERF_RUNS must be a positive integer");
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
mkdirSync(join(root, ".lighthouse"), { recursive: true });

const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
const rows = [];
let failed = false;
try {
  for (const formFactor of ["desktop", "mobile"].filter(factor => !process.env.PERF_FACTORS || process.env.PERF_FACTORS.split(",").includes(factor))) {
    for (const route of targets) {
      const config = formFactor === "desktop" ? desktopConfig : undefined;
      const runs = [];
      for (let i = 0; i < RUNS; i++) {
        console.log(`Lighthouse ${formFactor} ${route}, run ${i + 1}/${RUNS}`);
        const { lhr } = await lighthouse(`${base}${route}`, { port: PORT, output: "json", logLevel: "error" }, config);
        writeFileSync(join(root, ".lighthouse", `${formFactor}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "_")}-${i + 1}.json`), JSON.stringify(lhr));
        runs.push(lhr);
      }
      const cats = Object.keys(runs[0].categories);
      const scores = Object.fromEntries(cats.map((k) => [k, median(runs.map((r) => r.categories[k].score))]));
      const lcp = median(runs.map((r) => r.audits["largest-contentful-paint"].numericValue));
      const cls = median(runs.map((r) => r.audits["cumulative-layout-shift"].numericValue));
      const bad = Object.values(scores).some((s) => s < MIN) || lcp >= 2500 || cls >= 0.1;
      failed ||= bad;
      rows.push({ route, formFactor, ...scores, lcp: Math.round(lcp), cls: Number(cls.toFixed(3)), pass: !bad });
    }
  }
} finally {
  await browser.close();
}

console.table(rows);
mkdirSync(join(root, ".lighthouse"), { recursive: true });
writeFileSync(join(root, ".lighthouse/summary.json"), JSON.stringify({ base, at: new Date().toISOString(), rows }, null, 2));
console.log(failed ? "✗ perf gate failed" : "✓ perf gate passed (all ≥ 0.9, LCP < 2.5s, CLS < 0.1)");
process.exit(failed ? 1 : 0);
