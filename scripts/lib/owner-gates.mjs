import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export function checkOwnerGate(project, gate) {
  const file = resolve(project, 'docs', 'approvals', `${gate}.json`);
  if (!existsSync(file)) return [`docs/approvals/${gate}.json missing: owner review pending`];
  let approval;
  try { approval = JSON.parse(readFileSync(file, 'utf8')); }
  catch { return ['approval record is invalid JSON']; }
  const errors = [];
  if (approval.gate !== gate || approval.decision !== 'approved') errors.push('owner approval not recorded for this gate');
  if (!approval.owner || !approval.approved_at || !Number.isFinite(Date.parse(approval.approved_at))) errors.push('owner and approval timestamp required');
  if (!Array.isArray(approval.artifacts) || !approval.artifacts.length) errors.push('reviewed artifacts required');
  for (const artifact of approval.artifacts ?? []) {
    if (!artifact?.path || !/^[a-f0-9]{64}$/.test(artifact.sha256 ?? '')) {
      errors.push('artifact path and SHA-256 required'); continue;
    }
    const path = resolve(project, artifact.path);
    if (!path.startsWith(`${resolve(project)}${sep}`) || !artifact.path.startsWith('docs/')) {
      errors.push(`artifact outside project docs: ${artifact.path}`); continue;
    }
    if (!existsSync(path)) { errors.push(`artifact missing: ${artifact.path}`); continue; }
    const current = createHash('sha256').update(readFileSync(path)).digest('hex');
    if (current !== artifact.sha256) errors.push(`artifact changed since approval: ${artifact.path}`);
  }
  const paths = new Set((approval.artifacts ?? []).map((item) => item.path));
  if (gate === 'G2') {
    for (const required of ['docs/DESIGN.md', 'docs/MOTION.md', 'docs/DESIGN_REVIEW.md', 'docs/DESIGN_REVIEW.html']) {
      if (!paths.has(required)) errors.push(`${required} must be among reviewed artifacts`);
    }
  }
  if (gate === 'G2.5') {
    if (!paths.has('docs/EXPERIENCE_REVIEW.md')) errors.push('EXPERIENCE_REVIEW.md must be among reviewed artifacts');
    if (!paths.has('docs/EXPERIENCE_REVIEW.html')) errors.push('EXPERIENCE_REVIEW.html must be among reviewed artifacts');
    if (!approval.review_url && !approval.review_video) errors.push('local review URL or video required');
  }
  if (gate === 'G3.5') {
    if (!paths.has('docs/RELEASE_REVIEW.md') || !paths.has('docs/G3_EVIDENCE.json')) errors.push('release review and G3 evidence must be reviewed');
    if (!['vercel-preview', 'vercel-production', 'cloudflare-preview', 'cloudflare-production'].includes(approval.release_target)) errors.push('known release target required');
  }
  return errors;
}
