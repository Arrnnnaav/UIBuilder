#!/usr/bin/env node
// Check a clean production build's public response headers and generated client assets.
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const checks = [];
const check = (ok, label) => checks.push({ ok, label });

for (const path of ["/", "/contact"]) {
  const response = await fetch(`${base}${path}`);
  check(response.ok, `${path} returns ${response.status}`);
  for (const [header, expected] of [
    ["content-security-policy", "default-src 'self'"],
    ["strict-transport-security", "max-age=63072000"],
    ["x-content-type-options", "nosniff"],
    ["x-frame-options", "DENY"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
  ]) check(response.headers.get(header)?.includes(expected), `${path} ${header}`);
  if (path === "/contact") {
    const html = await response.text();
    check(!html.includes("challenges.cloudflare.com") && !html.includes("cf-turnstile"), "production contact has no test Turnstile widget");
  }
}

const hiddenRoute = await fetch(`${base}/e2e-error`);
check(hiddenRoute.status === 404, "E2E-only error route is hidden");
const form = new FormData();
form.set("name", "Runtime audit");
form.set("email", "audit@example.invalid");
form.set("message", "Security boundary check");
const noOrigin = await fetch(`${base}/api/contact`, { method: "POST", body: form });
check(noOrigin.status === 403, "contact API rejects requests without Origin");

const textExtensions = new Set([".js", ".mjs", ".css", ".json", ".html", ".txt", ".svg", ".xml"]);
const secretPattern = /(?:sk-[A-Za-z0-9]{20,}|re_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|(?:TURNSTILE_SECRET_KEY|RESEND_API_KEY|SENTRY_AUTH_TOKEN)\s*[:=]\s*["'][^"']{10,}["'])/;
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (textExtensions.has(path.slice(path.lastIndexOf(".")))) files.push(path);
  }
  return files;
}
const files = [...await walk(".next/static"), ...await walk("public")];
const matches = [];
for (const path of files) if (secretPattern.test(await readFile(path, "utf8"))) matches.push(relative(process.cwd(), path));
check(matches.length === 0, `generated client/public scan: ${files.length} text assets, ${matches.length} credential-pattern matches`);

for (const item of checks) console.log(`${item.ok ? "PASS" : "FAIL"} ${item.label}`);
if (matches.length) console.log(`Files with credential-shaped values: ${matches.join(", ")}`);
if (checks.some(item => !item.ok)) process.exitCode = 1;
