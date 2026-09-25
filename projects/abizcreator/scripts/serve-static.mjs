#!/usr/bin/env node
// Local production server for the static export in out/. Mirrors Cloudflare Workers static
// assets closely enough for e2e, seo:audit and perf: clean URLs (/about → about.html),
// 404.html with status 404, and headers from public/_headers.
//   node scripts/serve-static.mjs [--port 3000]
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const portArg = process.argv.indexOf("--port");
const port = Number(portArg > -1 ? process.argv[portArg + 1] : (process.env.PORT ?? 3000));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

// Parse Cloudflare-style _headers: a path pattern line, then indented "Name: value" lines.
function parseHeaders() {
  const file = join(root, "public/_headers");
  if (!existsSync(file)) return [];
  const rules = [];
  let cur = null;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) rules.push((cur = { pattern: line.trim(), headers: {} }));
    else if (cur) {
      const i = line.indexOf(":");
      cur.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return rules.map((r) => ({ ...r, re: new RegExp(`^${r.pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`) }));
}
const headerRules = parseHeaders();

function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  if (clean.startsWith("..")) return null;
  const base = join(out, clean);
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const extra = {};
  for (const rule of headerRules) if (rule.re.test(pathname)) Object.assign(extra, rule.headers);
  let file = resolve(pathname);
  let status = 200;
  if (!file) {
    file = join(out, "404.html");
    status = 404;
  }
  const type = extra["Content-Type"] ?? TYPES[extname(file)] ?? "application/octet-stream";
  let body = readFileSync(file);
  const headers = { "Content-Type": type, ...extra, Vary: "Accept-Encoding" };
  // Compress text like Cloudflare does at the edge, so local perf numbers are realistic.
  if (/text|javascript|json|xml|svg/.test(type) && body.length > 1024) {
    const accept = String(req.headers["accept-encoding"] ?? "");
    if (accept.includes("br")) {
      body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } });
      headers["Content-Encoding"] = "br";
    } else if (accept.includes("gzip")) {
      body = gzipSync(body);
      headers["Content-Encoding"] = "gzip";
    }
  }
  res.writeHead(status, headers);
  res.end(body);
}).listen(port, () => console.log(`Ready: serving out/ on http://localhost:${port}`));
