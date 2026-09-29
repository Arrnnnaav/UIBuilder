#!/usr/bin/env node
// Exercise every original Semgrep rule with positive and safe-negative probes.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const image = 'semgrep/semgrep@sha256:32e459968daabe7ab86968184a29109b9564aa00392401156f9788452b42786b';
const ids = new Set(['uibuilder.javascript.dynamic-code-evaluation', 'uibuilder.javascript.dom-raw-html-assignment',
  'uibuilder.javascript.dom-outer-html-assignment', 'uibuilder.javascript.dom-insert-adjacent-html',
  'uibuilder.javascript.dom-document-write']);
const fixture = mkdtempSync(join(tmpdir(), 'uib-semgrep-'));
try {
  writeFileSync(join(fixture, 'ui-builder.yml'), readFileSync(join(root, 'security/semgrep/ui-builder.yml')));
  writeFileSync(join(fixture, 'unsafe.ts'), `eval(input); new Function(input); el.innerHTML = input; el.outerHTML = input; el.insertAdjacentHTML('beforeend', input); document.write(input);`);
  writeFileSync(join(fixture, 'safe.ts'), `const parsed = JSON.parse(input); el.textContent = parsed.label;`);
  const scan = (file) => {
    const result = spawnSync('docker', ['run', '--rm', '--mount', `type=bind,source=${fixture},target=/probe,readonly`, image,
      'semgrep', 'scan', '--json', '--config', '/probe/ui-builder.yml', '--metrics=off', `/probe/${file}`], { encoding: 'utf8' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr || `Semgrep exited ${result.status}`);
    return JSON.parse(result.stdout).results.map((finding) => finding.check_id);
  };
  const found = new Set(scan('unsafe.ts'));
  const missing = [...ids].filter((id) => !found.has(id));
  if (missing.length) throw new Error(`unsafe probe missed rules: ${missing.join(', ')}`);
  const safe = scan('safe.ts');
  if (safe.length) throw new Error(`safe probe produced findings: ${safe.join(', ')}`);
  console.log(JSON.stringify({ positive_rule_ids: [...found].sort(), positive_probe_passed: true, negative_findings: safe.length,
    negative_probe_passed: true }, null, 2));
} finally { rmSync(fixture, { recursive: true, force: true }); }
