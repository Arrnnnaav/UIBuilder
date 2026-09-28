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
    writeFileSync(artifact, 'first version');
    assert.ok(checkOwnerGate(project, 'G2.5').length);
    const approval = { gate: 'G2.5', decision: 'approved', owner: 'owner', approved_at: new Date().toISOString(),
      review_url: 'http://localhost:3000', artifacts: [{ path: 'docs/EXPERIENCE_REVIEW.md',
        sha256: createHash('sha256').update('first version').digest('hex') }] };
    writeFileSync(join(project, 'docs', 'approvals', 'G2.5.json'), JSON.stringify(approval));
    assert.deepEqual(checkOwnerGate(project, 'G2.5'), []);
    writeFileSync(artifact, 'changed version');
    assert.match(checkOwnerGate(project, 'G2.5').join(' '), /changed since approval/);
  } finally { rmSync(project, { recursive: true, force: true }); }
});
