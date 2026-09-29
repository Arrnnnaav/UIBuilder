import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { applyResourceNotes, parseResourceNotes, patchResourceNotesJson, serializeResourceNotes } from '../../scripts/lib/resource-notes.mjs';

test('resource notes round-trip commas, quotes, newlines and Unicode', () => {
  const source = [{ id: 'motion', name: 'Motion, & “Design”', my_take: 'Use for story beats, not copied code.\nTest touch.' }];
  const parsed = parseResourceNotes(serializeResourceNotes(source));
  assert.deepEqual([...parsed], [['motion', source[0].my_take]]);
});

test('resource notes import updates only matching known entries', () => {
  const resources = [{ id: 'a', name: 'A', my_take: 'old' }, { id: 'b', name: 'B', my_take: '' }];
  const notes = parseResourceNotes('\uFEFFid,name,my_take\r\na,A,new note\r\n');
  assert.deepEqual(applyResourceNotes(resources, notes), [{ ...resources[0], my_take: 'new note' }, resources[1]]);
  assert.throws(() => applyResourceNotes(resources, new Map([['missing', 'nope']])), /Unknown resource id/);
  assert.throws(() => parseResourceNotes('id,name,my_take\na,A,first\na,A,second'), /Duplicate resource id/);
});

test('resource note patch preserves unrelated JSON formatting and escaped text', () => {
  const source = '{\r\n "resources": [\r\n  {\r\n   "id": "a",\r\n   "my_take": "old",\r\n   "notes": "leave me"\r\n  }\r\n ]\r\n}\r\n';
  const patched = patchResourceNotesJson(source, new Map([['a', 'line one\nquote "value"']]));
  assert.match(patched, /"my_take": "line one\\nquote \\\"value\\\""/);
  assert.match(patched, /"notes": "leave me"/);
  assert.equal(patched.includes('\r\n'), true);
  assert.throws(() => patchResourceNotesJson(source, new Map([['missing', 'x']])), /Unknown resource id/);
});
