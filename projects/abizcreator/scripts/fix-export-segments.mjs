#!/usr/bin/env node
// Workaround for Next 16 static export on Windows: segment prefetch files are written as
// out/<route>/__next.<seg>/__PAGE__.txt (a directory), but the client requests
// out/<route>/__next.<seg>.__PAGE__.txt (dotted filename, see
// next/dist/shared/lib/segment-cache/segment-value-encoding.js). Flatten any __next.*
// directories into dotted filenames. No-op on Linux builds, where the names are correct.
import { readdirSync, statSync, renameSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
if (!existsSync(out)) process.exit(0);

let moved = 0;
const flatten = (dir, prefix, parent) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) flatten(p, `${prefix}.${name}`, parent);
    else {
      renameSync(p, join(parent, `${prefix}.${name}`));
      moved++;
    }
  }
};
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      flatten(p, name, dir);
      rmSync(p, { recursive: true, force: true });
    } else walk(p);
  }
};
walk(out);
if (moved) console.log(`fix-export-segments: flattened ${moved} segment file(s)`);
