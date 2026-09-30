#!/usr/bin/env node
// Validates every Designer Brain file against brain/schema/*. Exit 1 on any error.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "./lib/mini-schema.mjs";
import { loadActiveRouterConfig, validateRouterConfig } from './lib/learning-config.mjs';
import { effectiveCategories } from './lib/resource-selector.mjs';

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

// Specialist domain packs share the resource registry; no shadow catalog.
const domains = load(join(brain, 'domains.json')).domains;
const domainIds = new Set();
for (const domain of domains) {
  if (!domain.id || domainIds.has(domain.id)) errors.push(`domains.json duplicate/missing id ${domain.id}`);
  domainIds.add(domain.id);
  for (const field of ['stages', 'agents', 'categories', 'outputs']) {
    if (!Array.isArray(domain[field]) || !domain[field].length) errors.push(`domains.json ${domain.id}: ${field} must be nonempty`);
  }
}

// Every resource must be reachable from at least one domain through its categories or taxonomy aliases.
const taxonomy = load(join(brain, 'taxonomy.json')).alias;
const domainCategories = new Set(domains.flatMap((domain) => domain.categories ?? []));
for (const [raw, targets] of Object.entries(taxonomy)) {
  if (!Array.isArray(targets) || !targets.length) errors.push(`taxonomy.json ${raw}: alias must be a nonempty array`);
  else if (!targets.some((target) => domainCategories.has(target))) errors.push(`taxonomy.json ${raw}: no alias reaches a domain (${targets.join(', ')})`);
}
let unreachable = 0;
for (const resource of resources) {
  if (!effectiveCategories(resource, taxonomy).some((category) => domainCategories.has(category))) {
    unreachable++;
    errors.push(`resources.json ${resource.id}: no domain reaches categories [${(resource.categories ?? []).join(', ')}]; add a taxonomy alias`);
  }
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
const ownerEnabled = load(join(brain, 'tool-enable.json')).enabled;
for (const id of Object.keys(ownerEnabled)) {
  const tool = load(join(brain, 'tools.json')).tools.find((item) => item.id === id);
  if (!tool) errors.push(`tool-enable.json: unknown tool ${id}`);
  else if (tool.enabled_if !== 'user:enable') errors.push(`tool-enable.json: ${id} is not a user:enable tool (enabled_if=${tool.enabled_if})`);
}
for (const resource of resources) {
  if (resource.tool_id && !toolIds.has(resource.tool_id)) errors.push(`resources.json ${resource.id}: unknown tool ${resource.tool_id}`);
}

// Learning candidates are data-only. Validate them before a proposal/evaluation can use them.
const learningDir = join(brain, 'learning');
let routerVersions = 0;
for (const directory of ['versions', 'candidates']) {
  for (const file of readdirSync(join(learningDir, directory)).filter((name) => name.endsWith('.json'))) {
    try {
      const config = validateRouterConfig(load(join(learningDir, directory, file)));
      if (file !== `${config.version}.json`) errors.push(`learning/${directory}/${file}: version/file mismatch`);
      routerVersions++;
    } catch (error) { errors.push(`learning/${directory}/${file}: ${error.message}`); }
  }
}
try { loadActiveRouterConfig(root, {}); } catch (error) { errors.push(`learning/active.json: ${error.message}`); }
for (const file of readdirSync(join(learningDir, 'evals')).filter((name) => name.endsWith('.json'))) {
  const suite = load(join(learningDir, 'evals', file));
  if (suite.schema_version !== 1 || !Array.isArray(suite.cases) || suite.cases.length < 6 ||
      !['target', 'regression', 'decline'].every((name) => suite.cases.some((item) => item.suite === name)))
    errors.push(`learning/evals/${file}: missing target/regression/decline coverage`);
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
console.log(`✓ brain valid — ${resourceIds.size} resources, ${patternIds.size} patterns, ${toolIds.size} tools, ${domainIds.size} domains, ${routerVersions} router configs, ${resourceIds.size - unreachable}/${resourceIds.size} resources reachable`);
