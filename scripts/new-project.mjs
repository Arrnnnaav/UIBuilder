#!/usr/bin/env node
// node scripts/new-project.mjs <pipeline> <slug> [--root <directory>]
// Copies the starter to an external project root and initializes an independent Git repo.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname, relative, sep, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const [pipeline, slug, ...options] = args;
const pipelines = readdirSync(join(root, "pipelines"));

let projectRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === "win32" ? "D:\\UiBuildProj" : join(dirname(root), "UiBuildProj"));
if (options.length) {
  if (options.length !== 2 || options[0] !== "--root" || !options[1]) {
    console.error(`usage: node scripts/new-project.mjs <${pipelines.join("|")}> <slug> [--root <directory>]`);
    process.exit(2);
  }
  projectRoot = options[1];
}
if (!pipeline || !slug) {
  console.error(`usage: node scripts/new-project.mjs <${pipelines.join("|")}> <slug> [--root <directory>]`);
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
const dest = resolve(projectRoot, slug);
if (existsSync(dest)) {
  console.error(`${dest} already exists - refusing to overwrite`);
  process.exit(1);
}

// Build output, installed deps and per-machine test artefacts never travel with the template.
const SKIP = new Set([".git", "node_modules", ".next", "test-results", "playwright-report", ".lighthouse", ".lighthouseci", "generated", "__snapshots__", "next-env.d.ts", "tsconfig.tsbuildinfo"]);
cpSync(src, dest, {
  recursive: true,
  filter: (p) => !relative(src, p).split(sep).some((part) => SKIP.has(part) || (part.startsWith(".env") && part !== ".env.example")),
});
// Keep the task-aware environment check available inside every standalone site repository.
cpSync(join(root, "scripts/agent-bootstrap.mjs"), join(dest, "scripts/agent-bootstrap.mjs"));

// docs/ from templates, with the slug filled in
const docsSrc = join(root, "templates/docs");
const docs = join(dest, "docs");
mkdirSync(join(docs, "handoff"), { recursive: true });
mkdirSync(join(docs, "directions"), { recursive: true });
for (const f of readdirSync(docsSrc)) {
  if (!f.endsWith(".md") && !f.endsWith(".html") && !["AGENT_BOOTSTRAP.json", "BACKLINKS.json", "BACKLINKS.schema.json", "HANDOFF.schema.json", "RESOURCE_PLAN.json", "VISUAL_OUTCOME.json"].includes(f)) continue;
  writeFileSync(join(docs, f), readFileSync(join(docsSrc, f), "utf8").replaceAll("{{slug}}", slug));
}
const promptSrc = join(root, "templates/prompts");
const promptDest = join(docs, "prompts");
mkdirSync(promptDest, { recursive: true });
for (const f of readdirSync(promptSrc)) {
  if (f.endsWith(".md")) writeFileSync(join(promptDest, f), readFileSync(join(promptSrc, f), "utf8").replaceAll("{{slug}}", slug));
}
const stack = JSON.parse(readFileSync(join(root, "pipelines", pipeline, "stack.json"), "utf8"));
writeFileSync(
  join(docs, "BUILD_SPEC.json"),
  JSON.stringify({ slug, pipeline, created: new Date().toISOString().slice(0, 10), contract_version: 2, stack, stitch: false }, null, 2) + "\n",
);

// package name
const pkgPath = join(dest, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = slug;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dest });
execFileSync("git", ["add", "-A"], { cwd: dest });
execFileSync("git", ["commit", "-q", "-m", "chore: initialize UIBuilder site"], { cwd: dest });
if (process.env.UIBUILDER_SKIP_GITHUB !== "1") {
  const owner = process.env.UIBUILDER_GITHUB_OWNER || "Arrnnnaav";
  execFileSync("gh", ["repo", "create", `${owner}/${slug}`, "--private", "--source", dest, "--remote", "origin", "--push"], { cwd: dest, stdio: "inherit" });
}
console.log(`Created ${dest} from marketing-starter (${pipeline}) as an independent Git repository`);
console.log(`  next: cd "${dest}" && pnpm install; then /build ${pipeline} ${slug}`);
