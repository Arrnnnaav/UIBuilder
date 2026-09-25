#!/usr/bin/env node
// Fails when raw colour values appear outside the token file. Keeps every colour
// decision in app/styles/tokens.css (DESIGN.md is the law).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ALLOW = new Set(["app/styles/tokens.css", "app/opengraph-image.tsx", "app/global-error.tsx"]);
const SCAN = ["app", "components", "lib"];
const EXT = /\.(tsx?|css|mdx?)$/;
const RAW = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\s*\(/g;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== "generated") walk(p);
    } else if (EXT.test(name)) files.push(p);
  }
};
SCAN.forEach((d) => walk(join(root, d)));

const hits = [];
for (const file of files) {
  const rel = relative(root, file).split(sep).join("/");
  if (ALLOW.has(rel)) continue;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      // Ignore anchors like href="#main" and JSON-LD @id fragments.
      const cleaned = line.replace(/["'`][^"'`]*#[a-z][\w-]*["'`]/gi, "");
      for (const m of cleaned.matchAll(RAW)) hits.push(`${rel}:${i + 1}: raw colour "${m[0]}"`);
    });
}

if (hits.length) {
  console.error(hits.join("\n"));
  console.error(`✗ ${hits.length} raw colour(s) outside tokens.css`);
  process.exit(1);
}
console.log(`✓ tokens lint clean (${files.length} files)`);
