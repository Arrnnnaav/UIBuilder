#!/usr/bin/env node
// Validates every Designer Brain file against brain/schema/*. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "./lib/mini-schema.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brain = join(root, "brain");
const load = (p) => JSON.parse(readFileSync(p, "utf8"));
const schema = (name) => load(join(brain, "schema", `${name}.schema.json`));

const errors = [];
const check = (file, sch, value) => errors.push(...validate(sch, value).map((e) => `${file} ${e}`));

// resources
const resources = load(join(brain, "resources.json")).resources;
const resourceIds = new Set();
for (const r of resources) {
  check("resources.json", schema("resource"), r);
  if (resourceIds.has(r.id)) errors.push(`resources.json duplicate id ${r.id}`);
  resourceIds.add(r.id);
}

// patterns (provenance must point at a known resource)
const patternIds = new Set();
for (const f of readdirSync(join(brain, "patterns")).filter((f) => f.endsWith(".json"))) {
  for (const p of load(join(brain, "patterns", f)).patterns) {
    check(`patterns/${f}`, schema("pattern"), p);
    if (patternIds.has(p.id)) errors.push(`patterns/${f} duplicate id ${p.id}`);
    patternIds.add(p.id);
    for (const s of p.sources ?? []) {
      if (!resourceIds.has(s.resource)) errors.push(`patterns/${f} ${p.id}: unknown source resource "${s.resource}"`);
    }
  }
}

// tools
const toolIds = new Set();
for (const t of load(join(brain, "tools.json")).tools) {
  for (const k of ["id", "capabilities", "agents", "cost", "enabled_if", "approval"]) {
    if (!(k in t)) errors.push(`tools.json ${t.id ?? "?"}: missing ${k}`);
  }
  if (!/^(always|env:|mcp:|cli:|user:enable)/.test(t.enabled_if ?? "")) errors.push(`tools.json ${t.id}: bad enabled_if`);
  toolIds.add(t.id);
}

// builds
const buildsDir = join(brain, "builds");
if (existsSync(buildsDir)) {
  for (const f of readdirSync(buildsDir).filter((f) => f.endsWith(".json"))) {
    const b = load(join(buildsDir, f));
    check(`builds/${f}`, schema("build"), b);
    for (const id of b.patterns_used ?? []) if (!patternIds.has(id)) errors.push(`builds/${f}: unknown pattern ${id}`);
    for (const id of b.resources_used ?? []) if (!resourceIds.has(id)) errors.push(`builds/${f}: unknown resource ${id}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n✗ brain invalid (${errors.length} errors)`);
  process.exit(1);
}
console.log(`✓ brain valid — ${resourceIds.size} resources, ${patternIds.size} patterns, ${toolIds.size} tools`);
