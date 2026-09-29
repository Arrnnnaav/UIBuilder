export function validateConceptHtml(html) {
  const issues = [];
  if (typeof html !== 'string' || !/<!doctype html>/i.test(html) || !/<html\b/i.test(html) || !/<title>\s*[^<]+/i.test(html)) {
    return ['must be a complete standalone HTML document with a title'];
  }
  if (!/<meta\s+name=["']viewport["']/i.test(html)) issues.push('responsive viewport metadata is required');
  const options = [...html.matchAll(/<section\b[^>]*\bdata-concept-option\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1].trim());
  if (new Set(options).size < 2) issues.push('at least two distinct data-concept-option sections are required');
  if (/\{\{|\bTODO\b|REPLACE THIS SCAFFOLD|replace this starter/i.test(html)) issues.push('unfilled template placeholders remain');
  if (/<(?:script|link|img|video|audio|iframe)\b[^>]*(?:src|href|poster)\s*=\s*["']https?:/i.test(html) || /@import\s+url\s*\(\s*["']?https?:|url\(\s*["']?https?:/i.test(html)) {
    issues.push('remote executable, style, frame or media dependencies are not allowed');
  }
  if (/<iframe\b/i.test(html) || /\b(fetch\s*\(|XMLHttpRequest|WebSocket\s*\(|EventSource\s*\(|sendBeacon\s*\()/i.test(html)) {
    issues.push('network-connected embeds or requests are not allowed in a design-review artifact');
  }
  return issues;
}

export function validateDesignReviewMarkdown(markdown) {
  if (typeof markdown !== 'string') return ['missing Markdown review'];
  const issues = [];
  for (const label of [
    '## Experience thesis and signature moment',
    '- Thesis:',
    '- Signature moment (shown in the HTML):',
    '- How it advances the product/company story:',
    '- Static, keyboard, touch and reduced-motion equivalent:',
    '- Performance and asset budget:',
  ]) {
    if (!markdown.includes(label)) issues.push(`missing required field: ${label}`);
  }
  if (/\bTODO\b|\bTBD\b|\[fill in\]/i.test(markdown)) issues.push('unfilled review placeholders remain');
  return issues;
}
