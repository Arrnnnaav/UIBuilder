#!/usr/bin/env node
// Validate a human-authored, evidence-linked visual outcome record.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
const projectsRoot = resolve(process.env.UIBUILDER_PROJECTS_ROOT || 'D:\\UiBuildProj');
const path = resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('usage: node scripts/visual-eval.mjs <project>/docs/VISUAL_OUTCOME.json');
const rel = relative(projectsRoot, path);
if (!rel || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error('record must be under UIBUILDER_PROJECTS_ROOT');
const record = JSON.parse(readFileSync(path, 'utf8'));
const keys = ['distinctiveness', 'story_clarity', 'motion_with_purpose', 'visual_craft', 'coherence', 'usability_without_motion'];
if (record.schema_version !== 1 || record.reviewer !== 'owner' || !record.project || !record.build_id ||
    !Number.isFinite(Date.parse(record.reviewed_at)) || !Array.isArray(record.artifact_refs) || record.artifact_refs.length < 1 ||
    !Array.isArray(record.evidence_refs) || record.evidence_refs.length < 1 || !record.ratings ||
    keys.some((key) => !Number.isInteger(record.ratings[key]) || record.ratings[key] < 1 || record.ratings[key] > 5) ||
    !['approve', 'revise', 'reject'].includes(record.owner_verdict)) throw new Error('incomplete visual outcome review');
const checkRef = (ref) => {
  if (typeof ref !== 'string' || ref.length > 240) return false;
  if (/^sha256:[a-f0-9]{64}$/.test(ref)) return true;
  if (ref.startsWith('/') || ref.includes('..') || /(?:\.env|secret|token)/i.test(ref)) return false;
  return existsSync(resolve(dirname(path), ref));
};
if (![...record.artifact_refs, ...record.evidence_refs].every(checkRef)) throw new Error('an artifact/evidence reference is missing or unsafe');
const average = keys.reduce((sum, key) => sum + record.ratings[key], 0) / keys.length;
const report = { project: record.project, build_id: record.build_id, average: Number(average.toFixed(2)),
  owner_verdict: record.owner_verdict, diagnostic_threshold_passed: average >= 4,
  gate_authority: false, note: 'Human visual assessment; this result never passes a pipeline gate.' };
console.log(JSON.stringify(report, null, 2));
