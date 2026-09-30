import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { lintProject } from '../../scripts/lib/premium-lint.mjs';

const site = (t, files) => {
  const root = mkdtempSync(join(tmpdir(), 'uibuilder-premium-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [name, text] of Object.entries(files)) { mkdirSync(dirname(join(root, name)), { recursive: true }); writeFileSync(join(root, name), text); }
  return root;
};
const ids = (report) => report.findings.map((f) => f.id);

test('a clean site has no findings', (t) => {
  const root = site(t, {
    'app/page.tsx': "export default function Page() { return <main className=\"min-h-[100dvh]\"><h1>Ceramics for slow mornings</h1></main>; }",
    'content/faq/a.json': '{ "q": "Where do you ship?", "a": "Anywhere in the EU." }',
  });
  const report = lintProject(root);
  assert.deepEqual(report.findings, []);
  assert.equal(report.failed, 0);
});

test('dashes, placeholders, scroll listeners and missing reduced-motion are failures', (t) => {
  const root = site(t, {
    'content/copy.json': '{ "headline": "Built for makers — by makers", "quote": "Acme changed everything" }',
    'components/Hero.tsx': "import { motion } from 'motion/react';\nuseEffect(() => { window.addEventListener('scroll', onScroll); }, []);\nexport const Hero = () => <motion.h1 className=\"h-screen\">Hi</motion.h1>;",
  });
  const report = lintProject(root);
  assert.deepEqual(ids(report).sort(), ['dash-in-copy', 'h-screen', 'placeholder-copy', 'reduced-motion-missing', 'scroll-listener'].sort());
  assert.equal(report.failed, 4);
});

test('comments do not count, reduced motion handling clears the failure, warnings do not fail', (t) => {
  const root = site(t, {
    'components/Hero.tsx': "// a comment — with a dash and window.addEventListener('scroll')\nimport { motion, useReducedMotion } from 'motion/react';\nimport { Sun } from 'lucide-react';\nexport const Hero = () => { useReducedMotion(); return <motion.h1>Hi</motion.h1>; };",
  });
  const report = lintProject(root);
  assert.deepEqual(ids(report), ['lucide']);
  assert.equal(report.failed, 0);
  assert.equal(report.warned, 1);
});

test('eyebrow overuse is flagged relative to section count', (t) => {
  const block = (withLabel) => `<section>\n${withLabel ? '<p className="text-xs uppercase tracking-widest">Label</p>\n' : ''}<h2>Heading</h2>\n</section>\n`;
  const page = (labels) => `export default () => (<>\n${labels.map(block).join('')}</>);\n`;
  const ok = site(t, { 'app/page.tsx': page([true, false, false]) });
  assert.deepEqual(ids(lintProject(ok)), []);
  const over = site(t, { 'app/page.tsx': page([true, true, true]) });
  assert.deepEqual(ids(lintProject(over)), ['eyebrow-overuse']);
});
