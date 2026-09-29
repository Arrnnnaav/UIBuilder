import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { validateConceptHtml, validateDesignReviewMarkdown } from '../../scripts/lib/design-review.mjs';

test('G2 review accepts a complete offline visual comparison', () => {
  const html = `<!doctype html><html lang="en"><head><title>Review</title><meta name="viewport" content="width=device-width"></head><body><section data-concept-option="A">A</section><section data-concept-option="B">B</section><script>document.title='Review';</script></body></html>`;
  assert.deepEqual(validateConceptHtml(html), []);
});

test('visual review rejects missing options, placeholders and remote behavior', () => {
  const starter = `<!doctype html><html lang="en"><head><title>Review</title><meta name="viewport" content="width=device-width"></head><body><section data-concept-option="A">REPLACE THIS SCAFFOLD</section><section data-concept-option="A"></section></body></html>`;
  const issues = validateConceptHtml(starter);
  assert.ok(issues.some((issue) => issue.includes('two distinct data-concept-option')));
  assert.ok(issues.some((issue) => issue.includes('placeholders')));
  const unsafe = `<!doctype html><html><head><title>Review</title><meta name="viewport" content="width=device-width"></head><body><section data-concept-option="A"></section><section data-concept-option="B"><img src="https://example.com/x.png"></section><script>fetch('https://example.com')</script></body></html>`;
  assert.ok(validateConceptHtml(unsafe).some((issue) => issue.includes('network')));
});

test('G2 markdown requires a concrete, story-led and accessible experience thesis', () => {
  const review = `## Experience thesis and signature moment
- Thesis: Show how the service works through a guided before/after scene.
- Signature moment (shown in the HTML): A project-specific interactive reveal.
- How it advances the product/company story: It demonstrates the verified core benefit.
- Static, keyboard, touch and reduced-motion equivalent: A static comparison with the same labels.
- Performance and asset budget: CSS-only; no large media before interaction.
`;
  assert.deepEqual(validateDesignReviewMarkdown(review), []);
  assert.ok(validateDesignReviewMarkdown(review.replace('A project-specific interactive reveal.', 'TODO')).length > 0);
});
