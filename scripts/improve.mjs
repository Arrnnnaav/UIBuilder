#!/usr/bin/env node
// Local, file-backed learning loop. Never invokes an agent, edits policy, or deploys.
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, statSync } from 'node:fs';
import { createProposal, diagnose, evaluateCandidate, monitor, promote, recordFeedback,
  recordRun, rollback, outcomes } from './lib/improvement.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...args] = process.argv.slice(2);
const input = (path) => {
  const file = resolve(path);
  if (statSync(file).size > 100_000) throw new Error('input JSON exceeds 100 KB');
  return JSON.parse(readFileSync(file, 'utf8'));
};
const usage = 'usage: node scripts/improve.mjs <record FILE|feedback RUN_ID FILE|diagnose|propose CATEGORY CANDIDATE SPEC|evaluate CANDIDATE EVAL_SET|promote PROPOSAL_ID EVALUATION_ID APPROVAL|rollback VERSION APPROVAL|monitor|outcomes [PROJECT]>';

try {
  let result;
  if (command === 'record' && args.length === 1) result = recordRun(root, input(args[0]));
  else if (command === 'feedback' && args.length === 2) result = recordFeedback(root, args[0], input(args[1]));
  else if (command === 'diagnose' && args.length === 0) result = diagnose(root);
  else if (command === 'propose' && args.length === 3) result = createProposal(root, args[0], args[1], args[2]);
  else if (command === 'evaluate' && args.length === 2) result = evaluateCandidate(root, args[0], args[1]);
  else if (command === 'promote' && args.length === 3) result = promote(root, args[0], args[1], args[2]);
  else if (command === 'rollback' && args.length === 2) result = rollback(root, args[0], args[1]);
  else if (command === 'monitor' && args.length === 0) result = monitor(root);
  else if (command === 'outcomes' && args.length <= 1) result = outcomes(root, args[0] ?? null);
  else throw new Error(usage);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`improve: ${error.message}`);
  process.exitCode = 1;
}
