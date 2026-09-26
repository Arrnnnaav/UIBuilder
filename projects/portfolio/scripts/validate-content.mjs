#!/usr/bin/env node
// Validates the SEO contract files (the ones BusinessOS may edit) without a build.
// Mirrors lib/content-schemas.ts; runs before `next build` so bad content never ships.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const json = (p) => JSON.parse(read(p));
const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const ROBOTS = ["index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"];

// seo.manifest.json
const manifest = json("seo.manifest.json");
if (manifest.version !== 1) err("seo.manifest.json", "version must be 1");
const TYPES = ["meta", "jsonld", "faq", "llms_txt", "crawler_policy"];
for (const e of manifest.editable ?? []) {
  if (!TYPES.includes(e.type)) err("seo.manifest.json", `unknown type ${e.type}`);
  if (e.path.includes("..") || e.path.startsWith("/")) err("seo.manifest.json", `unsafe path ${e.path}`);
}

// routes.json
const routes = json("content/seo/routes.json");
for (const [route, m] of Object.entries(routes)) {
  const f = `content/seo/routes.json ${route}`;
  if (!route.startsWith("/")) err(f, "route must start with /");
  if (typeof m.title !== "string" || m.title.length < 10 || m.title.length > 70) err(f, `title length ${m.title?.length} not in 10..70`);
  if (typeof m.description !== "string" || m.description.length < 50 || m.description.length > 160)
    err(f, `description length ${m.description?.length} not in 50..160`);
  if (!m.canonical?.startsWith("/")) err(f, "canonical must start with /");
  if (!ROBOTS.includes(m.robots)) err(f, `robots must be one of ${ROBOTS.join(" | ")}`);
  if (m.lastModified !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(m.lastModified) ||
      Number.isNaN(Date.parse(m.lastModified)) || new Date(m.lastModified).toISOString().slice(0, 10) !== m.lastModified))
    err(f, "lastModified must be a real ISO calendar date");
}

// crawlers.json
const c = json("content/seo/crawlers.json");
if (typeof c.default !== "boolean") err("content/seo/crawlers.json", "default must be boolean");
for (const [bot, v] of Object.entries(c.bots ?? {})) if (typeof v !== "boolean") err("content/seo/crawlers.json", `${bot} must be boolean`);

// schema/*.json
for (const f of readdirSync(join(root, "content/schema")).filter((f) => f.endsWith(".json"))) {
  const d = json(`content/schema/${f}`);
  if (d["@context"] !== "https://schema.org") err(`content/schema/${f}`, '@context must be "https://schema.org"');
  if (!d["@type"]) err(`content/schema/${f}`, "@type missing");
}

// faq/*.json
for (const f of readdirSync(join(root, "content/faq")).filter((f) => f.endsWith(".json"))) {
  const d = json(`content/faq/${f}`);
  if (!routes[d.route]) err(`content/faq/${f}`, `route ${d.route} not in routes.json`);
  if (!Array.isArray(d.items) || d.items.length === 0) err(`content/faq/${f}`, "items must be non-empty");
  for (const [i, it] of (d.items ?? []).entries()) {
    if (!it.q || it.q.length < 8 || it.q.length > 160) err(`content/faq/${f}[${i}]`, "q length not in 8..160");
    const words = (it.a ?? "").trim().split(/\s+/).length;
    if (!it.a || it.a.length < 80 || it.a.length > 1200) err(`content/faq/${f}[${i}]`, "a length not in 80..1200 chars");
    if (words < 40) err(`content/faq/${f}[${i}]`, `answer has ${words} words; answer-first blocks need ≥40`);
  }
}

// llms.txt
if (!existsSync(join(root, "public/llms.txt"))) err("public/llms.txt", "missing");
else {
  const t = read("public/llms.txt");
  if (!t.startsWith("# ")) err("public/llms.txt", "must start with an H1 (# Name)");
  if (Buffer.byteLength(t) > 50_000) err("public/llms.txt", "over 50 KB");
}

// Portfolio claims must have resolvable, immutable evidence. Pending résumé
// claims remain in the source file but cannot be promoted by changing a label.
if (existsSync(join(root, "content/portfolio.json"))) {
  const portfolio = json("content/portfolio.json");
  const slugs = new Set();
  for (const project of portfolio.projects ?? []) {
    const file = `content/evidence/${project.slug}.json`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug))
      err("content/portfolio.json", `invalid or duplicate project slug ${project.slug}`);
    slugs.add(project.slug);
    if (!routes[`/work/${project.slug}`]) err(file, "project route missing from SEO map");
    if (!existsSync(join(root, file))) { err(file, "missing"); continue; }
    const evidence = json(file);
    if (evidence.project !== project.slug) err(file, "project identifier mismatch");
    const ids = new Set();
    for (const source of evidence.sources ?? []) {
      if (!Number.isInteger(source.id) || ids.has(source.id)) err(file, "source IDs must be unique integers");
      ids.add(source.id);
      try { if (new URL(source.url).protocol !== "https:") err(file, "source URL must use HTTPS"); }
      catch { err(file, "invalid source URL"); }
    }
    for (const metric of evidence.metrics ?? []) {
      if (!["verified", "pending-source"].includes(metric.status)) err(file, "unknown metric evidence status");
      if (!["comparison", "value", "fact"].includes(metric.kind)) err(file, "unknown metric kind");
      const source = evidence.sources?.find((item) => item.id === metric.source);
      if (!source) err(file, `metric ${metric.label} has no matching source`);
      if (metric.status === "verified" && !/^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[a-f0-9]{40}\//.test(source?.url ?? ""))
        err(file, `verified metric ${metric.label} needs a commit-pinned source`);
      if (metric.kind === "comparison" && (![metric.before, metric.after].every((n) => Number.isFinite(n) && n > 0) || !metric.unit))
        err(file, `comparison ${metric.label} needs positive finite values and units`);
      if (metric.kind !== "comparison" && (typeof metric.value !== "string" || !metric.value.trim()))
        err(file, `metric ${metric.label} needs a text value`);
    }
  }
  if (!portfolio.projects?.length) err("content/portfolio.json", "projects are required");
  const resume = portfolio.resumePath;
  if (typeof resume !== "string" || !/^\/[a-z0-9-]+\.pdf$/.test(resume) || !existsSync(join(root, "public", resume.slice(1))))
    err("content/portfolio.json", "résumé download must resolve to a public PDF");
  for (const route of ["/", "/work", "/about", "/contact", "/resume", "/styleguide"])
    if (!routes[route]) err("content/seo/routes.json", `missing required portfolio route ${route}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`✗ content invalid (${errors.length})`);
  process.exit(1);
}
console.log("✓ content valid");
