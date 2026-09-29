import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { checkOwnerGate } from '../../scripts/lib/owner-gates.mjs';

test('owner gate rejects missing, forged, and stale visual approval', () => {
  const project = mkdtempSync(join(tmpdir(), 'uib-gate-'));
  try {
    mkdirSync(join(project, 'docs', 'approvals'), { recursive: true });
    const artifact = join(project, 'docs', 'EXPERIENCE_REVIEW.md');
    const visual = join(project, 'docs', 'EXPERIENCE_REVIEW.html');
    writeFileSync(artifact, 'first version');
    writeFileSync(visual, '<!doctype html><title>Experience</title>');
    assert.ok(checkOwnerGate(project, 'G2.5').length);
    const approval = { gate: 'G2.5', decision: 'approved', owner: 'owner', approved_at: new Date().toISOString(),
      review_url: 'http://localhost:3000', artifacts: [
        { path: 'docs/EXPERIENCE_REVIEW.md', sha256: createHash('sha256').update('first version').digest('hex') },
        { path: 'docs/EXPERIENCE_REVIEW.html', sha256: createHash('sha256').update('<!doctype html><title>Experience</title>').digest('hex') },
      ] };
    writeFileSync(join(project, 'docs', 'approvals', 'G2.5.json'), JSON.stringify(approval));
    assert.deepEqual(checkOwnerGate(project, 'G2.5'), []);
    writeFileSync(artifact, 'changed version');
    assert.match(checkOwnerGate(project, 'G2.5').join(' '), /changed since approval/);
  } finally { rmSync(project, { recursive: true, force: true }); }
});

test('G2 requires the exact written and visual design reviews in owner approval', () => {
  const project = mkdtempSync(join(tmpdir(), 'uib-g2-'));
  try {
    mkdirSync(join(project, 'docs', 'approvals'), { recursive: true });
    const paths = ['DESIGN.md', 'MOTION.md', 'DESIGN_REVIEW.md', 'DESIGN_REVIEW.html'];
    const artifacts = paths.map((name) => {
      const content = `reviewed ${name}`;
      writeFileSync(join(project, 'docs', name), content);
      return { path: `docs/${name}`, sha256: createHash('sha256').update(content).digest('hex') };
    });
    const approval = { gate: 'G2', decision: 'approved', owner: 'owner', approved_at: new Date().toISOString(), artifacts };
    const file = join(project, 'docs', 'approvals', 'G2.json');
    writeFileSync(file, JSON.stringify({ ...approval, artifacts: artifacts.slice(0, 3) }));
    assert.match(checkOwnerGate(project, 'G2').join(' '), /DESIGN_REVIEW.html/);
    writeFileSync(file, JSON.stringify(approval));
    assert.deepEqual(checkOwnerGate(project, 'G2'), []);
    writeFileSync(join(project, 'docs', 'DESIGN_REVIEW.html'), 'changed after approval');
    assert.match(checkOwnerGate(project, 'G2').join(' '), /changed since approval/);
  } finally { rmSync(project, { recursive: true, force: true }); }
});
