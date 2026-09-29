#!/usr/bin/env node
// Source-backed backlink planning and verification. This CLI never publishes or sends outreach.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const [command, slug] = process.argv.slice(2);
const projectsRoot = process.env.UIBUILDER_PROJECTS_ROOT || (process.platform === "win32" ? "D:\\UiBuildProj" : join(root, "..", "UiBuildProj"));
const project = slug && resolve(projectsRoot, slug);
const file = project && join(project, "docs", "BACKLINKS.json");
const fail = (message) => { console.error(`backlinks: ${message}`); process.exit(1); };
const load = () => { if (!file || !existsSync(file)) fail(`missing ${file ?? "project"}; run init first`); return JSON.parse(readFileSync(file, "utf8")); };
const iso = () => new Date().toISOString().slice(0, 10);
const validUrl = (value) => typeof value === "string" && /^https:\/\/[^\s]+$/i.test(value);
const statuses = new Set(["candidate", "researched", "pitched", "accepted", "published", "verified", "rejected", "blocked"]);

if (!command || !slug || !["init", "validate", "report"].includes(command)) fail("usage: node scripts/backlinks.mjs <init|validate|report> <slug>");
if (!existsSync(project)) fail(`project does not exist: ${project}`);
const docs = join(project, "docs");

if (command === "init") {
  mkdirSync(join(docs, "backlinks"), { recursive: true });
  if (!existsSync(file)) writeFileSync(file, JSON.stringify({ schema_version: 1, site: slug, updated: null, owner_approval: { outreach: false, publishing: false, launch_submissions: false }, targets: [], search_console: { property: null, exported_at: null, evidence_path: null, referring_domains: null, top_pages: [] } }, null, 2) + "\n");
  const plan = join(docs, "BACKLINK_PLAN.md");
  if (!existsSync(plan)) writeFileSync(plan, readFileSync(join(root, "templates/docs/BACKLINK_PLAN.md"), "utf8").replaceAll("{{slug}}", slug));
  console.log(`initialized backlink records for ${slug}`);
  process.exit(0);
}

const data = load();
const errors = [];
if (data.schema_version !== 1 || data.site !== slug) errors.push("schema_version/site mismatch");
for (const key of ["outreach", "publishing", "launch_submissions"]) if (typeof data.owner_approval?.[key] !== "boolean") errors.push(`owner_approval.${key} must be boolean`);
const ids = new Set();
for (const [index, target] of (data.targets ?? []).entries()) {
  const at = `targets[${index}]`;
  if (!target.id || ids.has(target.id)) errors.push(`${at}.id missing or duplicate`); ids.add(target.id);
  if (!target.category) errors.push(`${at}.category missing`);
  if (!statuses.has(target.status)) errors.push(`${at}.status invalid`);
  for (const key of ["source_url", "target_url"]) if (target[key] && !validUrl(target[key])) errors.push(`${at}.${key} must be https`);
  if (["published", "verified"].includes(target.status) && !target.evidence_path) errors.push(`${at}.evidence_path required for ${target.status}`);
  if (target.status === "verified" && !target.last_checked) errors.push(`${at}.last_checked required for verified link`);
}
if (data.search_console?.evidence_path && !data.search_console.exported_at) errors.push("search_console.exported_at required with evidence_path");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
if (command === "validate") { console.log(`✓ backlinks valid — ${(data.targets ?? []).length} targets`); process.exit(0); }

const counts = Object.fromEntries([...statuses].map((status) => [status, (data.targets ?? []).filter((target) => target.status === status).length]));
const verified = (data.targets ?? []).filter((target) => target.status === "verified");
const stale = verified.filter((target) => !target.last_checked || (Date.now() - Date.parse(target.last_checked)) > 1000 * 60 * 60 * 24 * 90);
const lines = ["# Backlink report", "", `Generated: ${iso()}`, `Project: ${slug}`, "", "## Counts", "", ...Object.entries(counts).map(([key, value]) => `- ${key}: ${value}`), "", `- verified links: ${verified.length}`, `- stale verified links (>90 days): ${stale.length}`, `- Search Console evidence: ${data.search_console?.evidence_path ?? "not recorded"}`, "", "## Quality policy", "", "A verified link is counted only when its public referring page, destination, anchor, rel attribute and last-checked date are recorded. No ranking or traffic causality is inferred.", "", "## Open approvals", "", ...Object.entries(data.owner_approval).filter(([, value]) => !value).map(([key]) => `- ${key}: pending owner approval`)];
writeFileSync(join(docs, "BACKLINK_REPORT.md"), lines.join("\n") + "\n");
console.log(lines.join("\n"));
