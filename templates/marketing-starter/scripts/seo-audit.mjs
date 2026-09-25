#!/usr/bin/env node
// SEO / AEO / GEO audit of a running site. Uses the same rule codes as the BusinessOS
// auditor (scripts/seo-rules.json is a copy of business-os/core/seo/rules/aeo-geo.json),
// so the gate at build time matches what the owner sees in the dashboard after launch.
//
//   node scripts/seo-audit.mjs [baseUrl]      default http://localhost:3000
// Exit 1 when any "high" finding exists.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const json = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const rules = Object.fromEntries(json("scripts/seo-rules.json").rules.map((r) => [r.code, r]));
const BASE_RULES = {
  "missing-title": "high",
  "title-length": "low",
  "missing-description": "high",
  "description-length": "low",
  "h1-count": "medium",
  "missing-canonical": "medium",
  "missing-image-alt": "medium",
};
const base = (process.argv[2] ?? process.env.SEO_AUDIT_URL ?? "http://localhost:3000").replace(/\/$/, "");
const routes = json("content/seo/routes.json");
const policy = json("content/seo/crawlers.json");

const findings = [];
const add = (code, where, detail = "") => {
  const severity = rules[code]?.severity ?? BASE_RULES[code] ?? "low";
  findings.push({ code, severity, where, detail });
};

const get = async (path) => {
  const res = await fetch(base + path, { redirect: "follow" });
  return { status: res.status, text: res.ok ? await res.text() : "" };
};
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1];

function jsonLdBlocks(html, route) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      for (const d of Array.isArray(data) ? data : [data]) {
        if (!d["@context"] || !d["@type"]) add("invalid-jsonld", route, "missing @context/@type");
        out.push(d);
      }
    } catch {
      add("invalid-jsonld", route, "does not parse");
    }
  }
  return out;
}
const types = (blocks) => new Set(blocks.flatMap((b) => [b["@type"]].flat()));

function auditPage(route, html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) add("missing-title", route);
  else if (title.length < 10 || title.length > 70) add("title-length", route, `${title.length} chars`);

  const desc = [...html.matchAll(/<meta[^>]+>/gi)].map((m) => m[0]).find((t) => attr(t, "name") === "description");
  const d = desc && attr(desc, "content");
  if (!d) add("missing-description", route);
  else if (d.length < 50 || d.length > 160) add("description-length", route, `${d.length} chars`);

  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1 !== 1) add("h1-count", route, `${h1} h1`);
  if (!/<link[^>]+rel="canonical"/i.test(html)) add("missing-canonical", route);
  for (const img of html.match(/<img[^>]*>/gi) ?? []) if (attr(img, "alt") === undefined) add("missing-image-alt", route, img.slice(0, 80));

  const blocks = jsonLdBlocks(html, route);
  const t = types(blocks);
  if (route === "/" && !["Organization", "Person", "LocalBusiness", "ProfessionalService"].some((x) => t.has(x)))
    add("missing-org-schema", route);
  const entity = blocks.find((b) => ["Organization", "Person", "LocalBusiness"].includes(b["@type"]));
  if (entity && (!Array.isArray(entity.sameAs) || entity.sameAs.length === 0)) add("missing-sameas-entities", route);

  const questions = [...html.matchAll(/<h[23][^>]*>([^<]*\?)\s*<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
  if (questions.length && !t.has("FAQPage")) add("missing-faq-schema", route);
  for (const [, q, answer] of questions) {
    const n = words(strip(answer));
    if (n < 40) add("no-answer-first-block", route, `"${q.trim()}" answer has ${n} words`);
  }

  const isArticle = /\/(blog|posts?|articles?|news)\/.+/.test(route);
  if (isArticle && !t.has("Article") && !t.has("BlogPosting")) add("missing-article-schema", route);
  if (isArticle) {
    const art = blocks.find((b) => ["Article", "BlogPosting"].includes(b["@type"]));
    if (art && !art.author) add("missing-author-eeat", route);
  }
}

function robotsGroups(text) {
  const groups = [];
  let cur = null;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/#.*/, "").trim();
    const [k, ...rest] = line.split(":");
    const v = rest.join(":").trim();
    if (/^user-agent$/i.test(k)) {
      if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(v);
    } else if (cur && /^(dis)?allow$/i.test(k)) cur.rules.push({ allow: /^allow$/i.test(k), path: v });
  }
  return groups;
}
const blocksRoot = (groups, bot) => {
  const g = groups.find((x) => x.agents.some((a) => a.toLowerCase() === bot.toLowerCase())) ?? groups.find((x) => x.agents.includes("*"));
  if (!g) return false;
  return g.rules.some((r) => !r.allow && r.path === "/") && !g.rules.some((r) => r.allow && r.path === "/");
};

const main = async () => {
  for (const route of Object.keys(routes)) {
    const { status, text } = await get(route);
    if (status !== 200) {
      add("missing-title", route, `HTTP ${status}`);
      continue;
    }
    if (!routes[route].robots.startsWith("noindex")) auditPage(route, text);
  }

  const llms = await get("/llms.txt");
  if (llms.status !== 200 || !llms.text.startsWith("# ")) add("missing-llms-txt", "/llms.txt");

  const robots = await get("/robots.txt");
  const groups = robotsGroups(robots.text);
  for (const bot of json("scripts/seo-rules.json").aiCrawlers) {
    const allowedByPolicy = policy.bots[bot] ?? policy.default;
    if (allowedByPolicy && blocksRoot(groups, bot)) add("ai-crawlers-blocked", "/robots.txt", bot);
  }

  const sitemap = await get("/sitemap.xml");
  const mods = [...sitemap.text.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => Date.parse(m[1]));
  if (!mods.length || Math.max(...mods) < Date.now() - 180 * 864e5) add("stale-sitemap-lastmod", "/sitemap.xml");

  const order = { high: 0, medium: 1, low: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);
  for (const f of findings) console.log(`${f.severity.padEnd(6)} ${f.code.padEnd(24)} ${f.where} ${f.detail}`);
  const high = findings.filter((f) => f.severity === "high").length;
  console.log(`\nseo:audit ${base} — ${findings.length} findings (${high} high)`);
  // exitCode (not process.exit) avoids a libuv assertion on Windows after fetch.
  process.exitCode = high ? 1 : 0;
};

main().catch((e) => {
  console.error(`seo:audit failed to reach ${base}: ${e.message}`);
  process.exitCode = 2;
});
