#!/usr/bin/env node
// node scripts/gate.mjs <slug> <G1|G2|G3>
// G1/G2 check that the stage artifacts exist and are filled in. G3 runs the Definition of
// Done (AGENTS.md §4) inside projects/<slug>. Exit 0 only when every check passes.
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { validate } from "./lib/mini-schema.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [slug, gate] = process.argv.slice(2);
if (!slug || !["G1", "G2", "G3"].includes(gate)) {
  console.error("usage: node scripts/gate.mjs <slug> <G1|G2|G3>");
  process.exit(2);
}
const proj = join(root, "projects", slug);
if (!existsSync(proj)) {
  console.error(`projects/${slug} not found`);
  process.exit(2);
}
const doc = (f) => join(proj, "docs", f);
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: Boolean(ok), detail });

const template = (f) => readFileSync(join(root, "templates/docs", f), "utf8").replaceAll("{{slug}}", slug);
const filled = (f) => {
  if (!existsSync(doc(f))) return [false, "missing"];
  const body = readFileSync(doc(f), "utf8");
  if (body.trim() === template(f).trim()) return [false, "still the template"];
  if (body.length < template(f).length + 200) return [false, "barely filled"];
  return [true, ""];
};
const handoff = (agent) => {
  const p = doc(`handoff/${agent}.json`);
  if (!existsSync(p)) return [false, "missing"];
  try {
    const errs = validate(JSON.parse(readFileSync(join(root, "templates/docs/HANDOFF.schema.json"), "utf8")), JSON.parse(readFileSync(p, "utf8")));
    return [errs.length === 0, errs.slice(0, 3).join("; ")];
  } catch (e) {
    return [false, e.message];
  }
};

if (gate === "G1") {
  for (const f of ["PRODUCT.md", "SEO_STRATEGY.md", "INSPIRATION.md", "USER_FLOW.md", "IA.md", "WIREFRAMES.md"]) check(`docs/${f}`, ...filled(f));
  for (const a of ["research", "ux", "growth"]) check(`handoff/${a}.json`, ...handoff(a));
  if (existsSync(doc("IA.md")) && existsSync(doc("WIREFRAMES.md"))) {
    const routes = [...readFileSync(doc("IA.md"), "utf8").matchAll(/^\|\s*`?(\/[^\s`|]*)`?\s*\|/gm)].map((m) => m[1]);
    const wf = readFileSync(doc("WIREFRAMES.md"), "utf8");
    const missing = routes.filter((r) => !wf.includes(`## ${r}`));
    check("every IA route has a wireframe", routes.length > 0 && missing.length === 0, missing.join(", ") || (routes.length ? "" : "no routes in IA.md"));
  }
}

if (gate === "G2") {
  for (const x of ["A", "B", "C"]) check(`docs/directions/${x}.md`, existsSync(doc(`directions/${x}.md`)));
  for (const f of ["DESIGN.md", "MOTION.md"]) check(`docs/${f}`, ...filled(f));
  const tokens = join(proj, "app/styles/tokens.css");
  check("tokens.css rewritten from DESIGN.md", existsSync(tokens) && !readFileSync(tokens, "utf8").includes("Neutral placeholder values"));
  if (existsSync(doc("DESIGN.md"))) {
    const empty = readFileSync(doc("DESIGN.md"), "utf8")
      .split(/^## /m)
      .slice(1)
      .filter((s) => s.split("\n").slice(1).join("").trim().length < 20)
      .map((s) => s.split("\n")[0]);
    check("DESIGN.md sections all filled", empty.length === 0, empty.join(", "));
  }
  check("handoff/design-director.json", ...handoff("design-director"));
}

const run = (label, cmd, env = {}) => {
  process.stdout.write(`… ${label}\n`);
  const r = spawnSync(cmd, { cwd: proj, shell: true, stdio: "inherit", env: { ...process.env, ...env } });
  check(label, r.status === 0, r.status === 0 ? "" : `exit ${r.status}`);
  return r.status === 0;
};

if (gate === "G3") {
  const cpus = { NEXT_BUILD_CPUS: process.env.NEXT_BUILD_CPUS ?? "2" };
  run("typecheck", "pnpm run typecheck");
  run("eslint", "pnpm run lint");
  run("lint:tokens", "pnpm run lint:tokens");
  run("validate:content", "pnpm run validate:content");
  run("unit tests", "pnpm run test");
  // Production dependencies must be clean. Dev tooling (lhci/lighthouse) advisories are
  // reported but don't block: they never ship to users.
  run("npm audit prod deps (high)", "pnpm audit --prod --audit-level high");
  spawnSync("pnpm audit --audit-level high", { cwd: proj, shell: true, stdio: "inherit" });
  if (run("production build", "pnpm run build", cpus)) {
    // seo:audit + perf against a real production server, before e2e rebuilds with test keys.
    const port = 3400;
    const server = spawn(`pnpm start --port ${port}`, { cwd: proj, shell: true, stdio: "ignore" });
    const url = `http://localhost:${port}`;
    let up = false;
    for (let i = 0; i < 90 && !up; i++) {
      up = await fetch(url).then((r) => r.ok, () => false);
      if (!up) await new Promise((r) => setTimeout(r, 1000));
    }
    check("server started", up);
    if (up) {
      run("seo:audit (0 high)", `pnpm run seo:audit ${url}`);
      run("perf (Lighthouse ≥ 0.9, LCP < 2.5s, CLS < 0.1)", `pnpm run perf ${url}`);
    }
    if (process.platform === "win32") spawnSync(`taskkill /pid ${server.pid} /T /F`, { shell: true, stdio: "ignore" });
    else server.kill("SIGTERM");
  }
  // A new project has no visual baselines yet: seed them on the first run and say so.
  const seeded = !existsSync(join(proj, "e2e/__snapshots__", process.platform));
  if (seeded) spawnSync("pnpm run test:e2e --workers=2 --update-snapshots=missing", { cwd: proj, shell: true, stdio: "inherit", env: { ...process.env, ...cpus } });
  run(
    `e2e + axe + visual (chromium, webkit × 390/1440)${seeded ? " — baselines seeded this run, review them" : ""}`,
    `pnpm run test:e2e --workers=2`,
    { ...cpus, ...(seeded ? { E2E_SKIP_BUILD: "1" } : {}) },
  );
  for (const f of ["QA_REPORT.md", "GROWTH_REPORT.md"]) check(`docs/${f}`, ...filled(f));
}

console.log(`\n${gate} — projects/${slug}`);
for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n✗ ${gate} FAILED (${failed}/${results.length})` : `\n✓ ${gate} PASSED (${results.length} checks)`);
process.exit(failed ? 1 : 0);
