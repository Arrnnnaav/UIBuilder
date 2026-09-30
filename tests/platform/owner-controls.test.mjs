import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyChange, emptyControls, loadControls, logPath, saveChange, validateControls, validateLog } from '../../scripts/lib/owner-controls.mjs';
import { recommend } from '../../scripts/lib/resource-selector.mjs';
import { loadPlan, mustUseErrors, planStatus, validatePlan } from '../../scripts/lib/resource-plan.mjs';

const resources = [
  { id: 'motion-lib', name: 'Motion library', categories: ['motion'], best_for: ['hero'], usage_mode: 'dependency', license: { spdx: 'MIT' }, trust: 'APPROVED', url: 'm' },
  { id: 'menu-study', name: 'Menu study', categories: ['inspiration'], best_for: ['restaurant menu'], usage_mode: 'inspiration_only', trust: 'REVIEWED', url: 'x' },
  { id: 'gallery', name: 'Gallery gem', categories: ['ui'], best_for: ['gallery'], usage_mode: 'inspiration_only', trust: 'NEW', license: { restriction: 'no use in site builders' }, url: 'g' },
  { id: 'unlicensed-code', name: 'Code ref', categories: ['motion'], best_for: ['hero'], usage_mode: 'code_reference', trust: 'APPROVED', url: 'c' },
  { id: 'cautious', name: 'Cautious gem', categories: ['motion'], best_for: ['hero'], usage_mode: 'inspiration_only', trust: 'NEW', use_caution: 'unverified terms', url: 'z' },
];
const domain = { id: 'taste', agents: [], outputs: [], categories: ['motion'] };
const change = (over) => ({ resource: 'motion-lib', ...over });
const apply = (controls, over) => applyChange(controls, change(over), { resources, now: '2026-09-30T00:00:00.000Z' });

test('boost, tags and clearing follow the rules and stay immutable', () => {
  const base = emptyControls();
  const { controls, entry } = apply(base, { field: 'boost', value: '3' });
  assert.equal(controls.resources['motion-lib'].boost, 3);
  assert.deepEqual(base, emptyControls());
  assert.deepEqual({ field: entry.field, old: entry.old, new: entry.new, by: entry.by }, { field: 'boost', old: null, new: 3, by: 'owner' });
  assert.throws(() => apply(base, { field: 'boost', value: 9 }), /-3 to 5/);
  assert.deepEqual(apply(base, { field: 'tags', value: 'Restaurant, booking ,restaurant' }).controls.resources['motion-lib'].tags, ['restaurant', 'booking']);
  assert.throws(() => apply(base, { field: 'tags', value: 'bad tag!' }), /not a valid tag/);
  const cleared = apply(controls, { field: 'boost', value: 0 });
  assert.deepEqual(cleared.controls.resources, {});
  assert.throws(() => apply(base, { field: 'nonsense', value: 1 }), /field must be one of/);
  assert.throws(() => apply(base, { resource: 'nope', field: 'boost', value: 1 }), /unknown resource/);
});

test('trust, rights and bans need a reason, and rights cautions must be acknowledged', () => {
  const base = emptyControls();
  assert.throws(() => apply(base, { field: 'trust', value: 'APPROVED' }), /reason of at least 8/);
  assert.equal(apply(base, { field: 'trust', value: 'approved', reason: 'owner reviewed the license' }).controls.resources['motion-lib'].trust, 'APPROVED');
  assert.throws(() => apply(base, { resource: 'cautious', field: 'trust', value: 'APPROVED', reason: 'owner reviewed it' }), /rights caution/);
  assert.equal(apply(base, { resource: 'cautious', field: 'trust', value: 'APPROVED', reason: 'owner reviewed it', acknowledge_caution: true }).controls.resources.cautious.trust, 'APPROVED');
  assert.throws(() => apply(base, { resource: 'gallery', field: 'rights', value: { cleared: true, override_restriction: true }, reason: 'owner has a licence' }), /acknowledge_caution/);
  assert.throws(() => apply(base, { field: 'rights', value: { cleared: true, override_restriction: true }, reason: 'owner has a licence', acknowledge_caution: true }), /no license restriction/);
  assert.throws(() => apply(base, { field: 'banned', value: true }), /reason/);
});

test('selector: boost, pin, avoid, ban and trust overrides change the shortlist', () => {
  const opts = (controls, context = {}, extra = {}) => ({ controls, context, taxonomy: {}, ...extra });
  const ids = (r) => r.ready.map((x) => x.id);
  const plain = recommend(resources, domain, 'hero', opts({}));
  assert.deepEqual(ids(plain), ['motion-lib']);
  // pin surfaces an unrelated resource first, but only for the matching tag
  const pin = { 'menu-study': { pin_for: ['restaurant'] } };
  assert.equal(recommend(resources, domain, 'hero', opts(pin, { tags: ['restaurant'] })).ready[0].id, 'menu-study');
  assert.equal(recommend(resources, domain, 'hero', opts(pin, { tags: ['salon'] })).ready.some((x) => x.id === 'menu-study'), false);
  assert.equal(recommend(resources, domain, 'hero', opts(pin, { tags: ['restaurant'] })).ready[0].pinned, true);
  // avoid, ban and a REJECTED trust override move it to review with a reason
  const avoid = recommend(resources, domain, 'hero', opts({ 'motion-lib': { avoid_for: ['salon'] } }, { tags: ['salon'] }));
  assert.match(avoid.review.find((x) => x.id === 'motion-lib').reasons.join(' '), /owner avoids this for salon/);
  const reasonsFor = (controls) => recommend(resources, domain, 'hero', opts(controls)).review.find((x) => x.id === 'motion-lib').reasons.join(' ');
  assert.match(reasonsFor({ 'motion-lib': { banned: true } }), /banned by the owner/);
  assert.match(reasonsFor({ 'motion-lib': { trust: 'REJECTED' } }), /trust=REJECTED/);
  // boost reorders two ready items
  const two = [...resources, { id: 'second', name: 'Second motion', categories: ['motion'], best_for: ['hero'], usage_mode: 'dependency', license: { spdx: 'MIT' }, trust: 'APPROVED', url: 's' }];
  assert.equal(recommend(two, domain, 'hero', opts({ second: { boost: 5 } })).ready[0].id, 'second');
});

test('selector: owner rights clear an unlicensed code resource and lift a license restriction', () => {
  const ready = (controls, id) => recommend(resources, domain, 'hero', { controls, taxonomy: {} }).ready.some((x) => x.id === id);
  const tasteDomain = { id: 'taste', agents: [], outputs: [], categories: ['motion', 'ui'] };
  assert.equal(ready({}, 'unlicensed-code'), false);
  assert.equal(ready({ 'unlicensed-code': { rights: { cleared: true, note: 'owner holds a licence' } } }, 'unlicensed-code'), true);
  assert.equal(ready({}, 'cautious'), false);
  assert.equal(ready({ cautious: { rights: { cleared: true, note: 'owner confirmed the terms' } } }, 'cautious'), true);
  const gallery = (controls) => recommend(resources, tasteDomain, 'gallery', { controls, taxonomy: {} }).ready.some((x) => x.id === 'gallery');
  assert.equal(gallery({}), false);
  assert.equal(gallery({ gallery: { rights: { cleared: true, override_restriction: true, note: 'owner bought a licence' } } }), true);
});

test('project plan: must-use is pinned, prefer boosts, avoid blocks, and G3 status needs use plus explanation', () => {
  const plan = { version: 1, tags: ['restaurant'], must_use: [{ id: 'menu-study', why: 'client wants a menu-first layout' }], prefer: [], avoid: ['motion-lib'] };
  assert.deepEqual(validatePlan(plan, resources.map((r) => r.id)), []);
  assert.match(validatePlan({ ...plan, must_use: [{ id: 'menu-study', why: 'x' }] }, resources.map((r) => r.id)).join(), /say why/);
  assert.match(validatePlan({ ...plan, prefer: ['menu-study'] }, resources.map((r) => r.id)).join(), /both must_use and prefer/);
  assert.match(validatePlan({ ...plan, avoid: ['ghost'] }, resources.map((r) => r.id)).join(), /unknown resource/);
  const result = recommend(resources, domain, 'hero', { controls: {}, taxonomy: {}, plan });
  assert.equal(result.ready[0].id, 'menu-study');
  assert.equal(result.ready[0].must_use, true);
  assert.match(result.review.find((x) => x.id === 'motion-lib').reasons.join(' '), /this project avoids/);
  assert.deepEqual(mustUseErrors(planStatus(plan, [])), ['must-use resource "menu-study" is not in any handoff\'s resources_used']);
  const used = [{ agent: 'ux', resources_used: ['menu-study'], decisions: ['layout follows something else'] }];
  assert.match(mustUseErrors(planStatus(plan, used))[0], /no handoff decision explains how/);
  const explained = [{ agent: 'ux', resources_used: ['menu-study'], decisions: ['menu-study: menu-first section order, as requested'] }];
  assert.deepEqual(mustUseErrors(planStatus(plan, explained)), []);
});

test('saveChange persists the overlay and appends an audit line; validators catch bad data', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'uib-owner-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'brain'), { recursive: true });
  writeFileSync(join(root, 'brain', 'resources.json'), JSON.stringify({ resources }));
  const entry = saveChange(root, change({ field: 'trust', value: 'TRUSTED', reason: 'used successfully on three sites' }), { by: 'dashboard' });
  saveChange(root, change({ field: 'boost', value: 2 }));
  assert.equal(loadControls(root).resources['motion-lib'].trust, 'TRUSTED');
  assert.equal(loadControls(root).resources['motion-lib'].boost, 2);
  const log = readFileSync(logPath(root), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
  assert.equal(log.length, 2);
  assert.deepEqual({ by: log[0].by, reason: log[0].reason, old: log[0].old, new: log[0].new }, { by: 'dashboard', reason: 'used successfully on three sites', old: null, new: 'TRUSTED' });
  assert.equal(entry.resource, 'motion-lib');
  assert.deepEqual(validateControls(loadControls(root), resources.map((r) => r.id)), []);
  assert.match(validateControls({ version: 1, resources: { ghost: { boost: 1 } } }, ['a']).join(), /unknown resource "ghost"/);
  assert.match(validateControls({ version: 1, resources: { a: { boost: 99 } } }, ['a']).join(), /boost must be/);
  assert.match(validateLog('{"at":"x"}\nnot json').join(), /missing by[\s\S]*not JSON/);
  assert.equal(loadPlan(root), null);
});
