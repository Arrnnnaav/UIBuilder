#!/usr/bin/env node
// node scripts/new-project.mjs <pipeline> <slug> [--standalone]
// Copies templates/marketing-starter → projects/<slug>, seeds docs/ from templates/docs,
// Projects belong to the monorepo by default; --standalone initializes a site repo.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [pipeline, slug, ...options] = process.argv.slice(2);
const pipelines = readdirSync(join(root, "pipelines"));

if (!pipeline || !slug || options.some((option) => option !== "--standalone") || options.length > 1) {
  console.error(`usage: node scripts/new-project.mjs <${pipelines.join("|")}> <slug> [--standalone]`);
  process.exit(2);
}
if (!pipelines.includes(pipeline)) {
  console.error(`unknown pipeline "${pipeline}" (have: ${pipelines.join(", ")})`);
  process.exit(2);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error("slug must be kebab-case");
  process.exit(2);
}

const src = join(root, "templates/marketing-starter");
const dest = join(root, "projects", slug);
if (existsSync(dest)) {
  console.error(`projects/${slug} already exists — refusing to overwrite`);
  process.exit(1);
}

// Build output, installed deps and per-machine test artefacts never travel with the template.
const SKIP = new Set([".git", "node_modules", ".next", "test-results", "playwright-report", ".lighthouse", ".lighthouseci", "generated", "__snapshots__", "next-env.d.ts", "tsconfig.tsbuildinfo"]);
cpSync(src, dest, {
  recursive: true,
  filter: (p) => !relative(src, p).split(sep).some((part) => SKIP.has(part) || (part.startsWith(".env") && part !== ".env.example")),
});

// docs/ from templates, with the slug filled in
const docsSrc = join(root, "templates/docs");
const docs = join(dest, "docs");
mkdirSync(join(docs, "handoff"), { recursive: true });
mkdirSync(join(docs, "directions"), { recursive: true });
for (const f of readdirSync(docsSrc)) {
  if (!f.endsWith(".md")) continue;
  writeFileSync(join(docs, f), readFileSync(join(docsSrc, f), "utf8").replaceAll("{{slug}}", slug));
}
const stack = JSON.parse(readFileSync(join(root, "pipelines", pipeline, "stack.json"), "utf8"));
writeFileSync(
  join(docs, "BUILD_SPEC.json"),
  JSON.stringify({ slug, pipeline, created: new Date().toISOString().slice(0, 10), stack, stitch: false }, null, 2) + "\n",
);

// package name
const pkgPath = join(dest, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = slug;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

if (options.includes("--standalone")) execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dest });
console.log(`✓ projects/${slug} created from marketing-starter (${pipeline})`);
console.log(`  next: cd projects/${slug} && pnpm install   ·   then /build ${pipeline} ${slug}`);
