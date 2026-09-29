#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseResourceNotes, patchResourceNotesJson, serializeResourceNotes } from './lib/resource-notes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [operation, fileArg] = process.argv.slice(2);
const csvPath = resolve(fileArg ?? join(root, 'brain/resource-my-takes.csv'));
const catalogPath = join(root, 'brain/resources.json');
if (!['export', 'import'].includes(operation)) {
  console.error('usage: node scripts/resource-notes.mjs <export|import> [csv-path]');
  process.exit(2);
}
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
if (operation === 'export') {
  writeFileSync(csvPath, serializeResourceNotes(catalog.resources), 'utf8');
  console.log(`Exported ${catalog.resources.length} resources to ${csvPath}`);
} else {
  const notes = parseResourceNotes(readFileSync(csvPath, 'utf8'));
  const source = readFileSync(catalogPath, 'utf8');
  const updatedSource = patchResourceNotesJson(source, notes);
  JSON.parse(updatedSource);
  writeFileSync(catalogPath, updatedSource, 'utf8');
  console.log(`Imported notes for ${notes.size} resources from ${csvPath}`);
}
