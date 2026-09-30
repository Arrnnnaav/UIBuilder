// Owner-set controls for Brain resources: boost, pin/avoid per task tag, ban, custom tags, trust and rights.
// Stored as an overlay (brain/owner-controls.json) so resources.json is never rewritten, with every change
// appended to brain/owner-decisions.jsonl. Only the owner (dashboard or scripts/owner.mjs run on the owner's
// instruction) writes these; agents read them through the selector and never approve anything themselves.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const TRUST_LEVELS = ['NEW', 'REVIEWED', 'TESTED', 'APPROVED', 'TRUSTED', 'REJECTED', 'DEPRECATED'];
const TAG = /^[a-z0-9][a-z0-9:_-]{0,39}$/;
const FIELDS = ['boost', 'pin_for', 'avoid_for', 'tags', 'banned', 'trust', 'rights'];
const NEEDS_REASON = new Set(['trust', 'rights', 'banned']);

export const controlsPath = (root) => join(root, 'brain', 'owner-controls.json');
export const logPath = (root) => join(root, 'brain', 'owner-decisions.jsonl');
export const emptyControls = () => ({ version: 1, resources: {} });

export function loadControls(root) {
  const path = controlsPath(root);
  if (!existsSync(path)) return emptyControls();
  return JSON.parse(readFileSync(path, 'utf8'));
}

const fail = (message) => { throw new Error(message); };
const list = (value, what) => {
  const items = Array.isArray(value) ? value : String(value ?? '').split(',');
  const clean = items.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
  if (clean.length > 20) fail(`${what}: at most 20 tags`);
  for (const tag of clean) if (!TAG.test(tag)) fail(`${what}: "${tag}" is not a valid tag (lowercase letters, digits, : _ -)`);
  return [...new Set(clean)];
};

export function validateControls(controls, resourceIds) {
  const errors = [];
  if (controls?.version !== 1 || typeof controls.resources !== 'object') return ['owner-controls.json: expected { version: 1, resources: {} }'];
  const known = new Set(resourceIds);
  for (const [id, control] of Object.entries(controls.resources)) {
    if (!known.has(id)) { errors.push(`owner-controls.json: unknown resource "${id}"`); continue; }
    for (const key of Object.keys(control)) if (![...FIELDS, 'updated_at'].includes(key)) errors.push(`owner-controls.json ${id}: unknown field "${key}"`);
    if (control.boost !== undefined && (!Number.isInteger(control.boost) || control.boost < -3 || control.boost > 5)) errors.push(`owner-controls.json ${id}: boost must be an integer from -3 to 5`);
    if (control.trust !== undefined && !TRUST_LEVELS.includes(control.trust)) errors.push(`owner-controls.json ${id}: invalid trust`);
    for (const key of ['pin_for', 'avoid_for', 'tags']) {
      if (control[key] !== undefined && (!Array.isArray(control[key]) || control[key].some((tag) => !TAG.test(tag)))) errors.push(`owner-controls.json ${id}: ${key} must be an array of valid tags`);
    }
    if (control.rights !== undefined && (typeof control.rights !== 'object' || !control.rights.note || String(control.rights.note).length < 8)) errors.push(`owner-controls.json ${id}: rights needs a note of at least 8 characters`);
  }
  return errors;
}

export function validateLog(text) {
  const errors = [];
  text.split(/\r?\n/).filter(Boolean).forEach((line, index) => {
    try {
      const entry = JSON.parse(line);
      for (const key of ['at', 'by', 'resource', 'field']) if (!entry[key]) errors.push(`owner-decisions.jsonl line ${index + 1}: missing ${key}`);
    } catch { errors.push(`owner-decisions.jsonl line ${index + 1}: not JSON`); }
  });
  return errors;
}

const hasCaution = (resource) => Boolean(resource.use_caution || resource.license?.restriction);

// Pure: returns { controls, entry } without touching disk.
export function applyChange(controls, change, { resources, now = new Date().toISOString(), by = 'owner' }) {
  const resource = resources.find((item) => item.id === change.resource) ?? fail(`unknown resource "${change.resource}"`);
  const field = change.field;
  if (!FIELDS.includes(field)) fail(`field must be one of ${FIELDS.join(', ')}`);
  const reason = String(change.reason ?? '').trim();
  if (NEEDS_REASON.has(field) && reason.length < 8) fail(`${field} changes need a reason of at least 8 characters`);
  const current = { ...(controls.resources[resource.id] ?? {}) };
  const before = current[field] ?? null;
  let value;
  if (field === 'boost') {
    value = Number(change.value);
    if (!Number.isInteger(value) || value < -3 || value > 5) fail('boost must be an integer from -3 to 5');
  } else if (['pin_for', 'avoid_for', 'tags'].includes(field)) {
    value = list(change.value, field);
  } else if (field === 'banned') {
    value = change.value === true || change.value === 'true';
  } else if (field === 'trust') {
    value = String(change.value).toUpperCase();
    if (!TRUST_LEVELS.includes(value)) fail(`trust must be one of ${TRUST_LEVELS.join(', ')}`);
    if (['APPROVED', 'TRUSTED'].includes(value) && hasCaution(resource) && !change.acknowledge_caution) {
      fail(`${resource.id} has a rights caution (${resource.use_caution ?? resource.license.restriction}); pass acknowledge_caution to raise its trust`);
    }
  } else {
    const rights = change.value && typeof change.value === 'object' ? change.value : { cleared: Boolean(change.value) };
    const note = String(rights.note ?? reason);
    if (rights.override_restriction) {
      if (!resource.license?.restriction) fail(`${resource.id} has no license restriction to override`);
      if (!change.acknowledge_caution) fail(`overriding the license restriction on ${resource.id} ("${resource.license.restriction}") needs acknowledge_caution`);
    }
    if (!rights.cleared && !rights.override_restriction) value = null;
    else value = { cleared: Boolean(rights.cleared), override_restriction: Boolean(rights.override_restriction), note, at: now };
  }
  const cleared = value === null || value === false || value === 0 || (Array.isArray(value) && value.length === 0);
  if (cleared) delete current[field]; else current[field] = value;
  const next = { ...controls, resources: { ...controls.resources } };
  if (Object.keys(current).filter((key) => key !== 'updated_at').length === 0) delete next.resources[resource.id];
  else next.resources[resource.id] = { ...current, updated_at: now };
  return { controls: next, entry: { at: now, by, resource: resource.id, field, old: before, new: cleared ? null : value, reason } };
}

export function saveChange(root, change, options = {}) {
  const resources = JSON.parse(readFileSync(join(root, 'brain', 'resources.json'), 'utf8')).resources;
  const { controls, entry } = applyChange(loadControls(root), change, { resources, ...options });
  mkdirSync(dirname(controlsPath(root)), { recursive: true });
  writeFileSync(controlsPath(root), JSON.stringify(controls, null, 2) + '\n');
  appendFileSync(logPath(root), JSON.stringify(entry) + '\n');
  return entry;
}
