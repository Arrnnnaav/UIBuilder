#!/usr/bin/env node
// Build the experimental static pages and package their HTML/CSS behind Next rewrites.
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";

const pnpmCli = process.env.npm_execpath;
if (!pnpmCli) throw new Error("Run this script through pnpm so it can locate the project package manager.");
const isJavaScriptCli = /\.(?:c|m)?js$/i.test(pnpmCli);
const command = isJavaScriptCli ? process.execPath : pnpmCli;
const args = isJavaScriptCli
  ? [pnpmCli, "exec", "astro", "build", "--root", "astro-pilot"]
  : ["exec", "astro", "build", "--root", "astro-pilot"];
const run = spawnSync(command, args, {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});
if (run.error) throw run.error;
if (run.status !== 0) process.exit(run.status ?? 1);

const dist = join(process.cwd(), "astro-pilot", "dist");
const packaged = join(process.cwd(), "public", "_astro-pilot");
const pages = [
  ["index.html", "home.html"],
  ["about/index.html", "about.html"],
  ["contact/index.html", "contact.html"],
  ["resume/index.html", "resume.html"],
  ["styleguide/index.html", "styleguide.html"],
  ["work/index.html", "work.html"],
  ...["edge-node", "cited-researcher", "ledgerbridge", "ghostcursor", "neuroux", "studyos"]
    .map(slug => [`work/${slug}/index.html`, `work/${slug}.html`]),
];

await mkdir(join(packaged, "work"), { recursive: true });
const cssAssets = new Set();
for (const [source, target] of pages) {
  const sourcePath = join(dist, source);
  await copyFile(sourcePath, join(packaged, target));
  const html = await readFile(sourcePath, "utf8");
  for (const match of html.matchAll(/href="\/portfolio-static-assets\/([^"#?]+\.css)"/g)) cssAssets.add(match[1]);
}

const assetDirectory = join(dist, "portfolio-static-assets");
await mkdir(join(process.cwd(), "public", "portfolio-static-assets"), { recursive: true });
const emittedAssets = new Set(await readdir(assetDirectory));
const publicAssets = join(process.cwd(), "public", "portfolio-static-assets");
for (const existing of await readdir(publicAssets)) {
  if (existing.startsWith("PortfolioLayout.") && existing.endsWith(".css") && !cssAssets.has(existing)) {
    await unlink(join(publicAssets, existing));
  }
}
for (const asset of cssAssets) {
  if (!emittedAssets.has(asset)) throw new Error(`Referenced Astro CSS asset was not emitted: ${asset}`);
  await copyFile(join(assetDirectory, asset), join(publicAssets, asset));
}

console.log(`Packaged ${pages.length} static route pages and ${cssAssets.size} referenced CSS assets for Next.`);
