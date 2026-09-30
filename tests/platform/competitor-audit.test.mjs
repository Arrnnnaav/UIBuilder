import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditSite, buildMatrix, detectFeatures, extractPage, normalizeUrl, parsePsi, psiUrl, renderMatrixMarkdown, robotsAllows, runAudit } from '../../scripts/lib/competitor-audit.mjs';

const page = (title, nav, body = '', head = '') => `<!doctype html><html lang="en"><head><title>${title}</title><meta name="description" content="About ${title}"><meta name="viewport" content="width=device-width"><meta property="og:image" content="/og.png"><link rel="canonical" href="https://x.test/">${head}</head><body><header><nav>${nav.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav></header><main><h1>${title}</h1>${body}</main></body></html>`;
const ld = (type) => `<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"${type}"},{"@type":["Service","Thing"]}]}</script>`;

const rich = page('Rich Plumbing', [['Services', '/services'], ['Pricing', '/pricing'], ['Reviews', '/reviews'], ['Book online', '/book'], ['Contact', '/contact']],
  '<h2>Licensed and insured</h2><h2>24/7 emergency service</h2><h2>Service areas</h2><a href="tel:+15550100">Call</a><form><input type="email"><textarea></textarea></form><iframe src="https://www.google.com/maps/embed?x"></iframe>', ld('Plumber'));
const bare = page('Bare Plumbing', [['Home', '/'], ['Contact', '/contact']], '<h2>Welcome</h2>');
const other = page('Other Plumbing', [['Services', '/services'], ['FAQ', '/faq'], ['Blog', '/blog'], ['Reviews', '/reviews']], '<h2>Licensed technicians</h2><a href="tel:+15550111">Call</a>');

const psiJson = { analysisUTCTimestamp: '2026-09-30T00:00:00Z', lighthouseResult: { categories: { performance: { score: 0.91 }, accessibility: { score: 0.85 }, 'best-practices': { score: 1 }, seo: { score: 0.9 } }, audits: { 'largest-contentful-paint': { numericValue: 2311.6 }, 'cumulative-layout-shift': { numericValue: 0.02 }, 'total-blocking-time': { numericValue: 120.4 } } } };

const web = (routes) => async (url) => {
  const key = Object.keys(routes).find((k) => url === k || url.startsWith(k + '?'));
  const value = key ? routes[key] : { status: 404, body: '' };
  const status = value.status ?? 200;
  return { status, url, text: async () => value.body ?? '', json: async () => JSON.parse(value.body) };
};
const fast = { sleep: async () => {}, delayMs: 0 };

test('robots.txt: disallow all, path rules, longest match and allow override', () => {
  assert.equal(robotsAllows('User-agent: *\nDisallow: /', '/'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /private\nAllow: /private/ok', '/private/ok'), true);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /private', '/private/x'), false);
  assert.equal(robotsAllows('User-agent: *\nDisallow: /private', '/public'), true);
  assert.equal(robotsAllows('User-agent: googlebot\nDisallow: /', '/x'), true);
  assert.equal(robotsAllows('', '/x'), true);
});

test('URLs must be public: private, local and non-http addresses are refused', () => {
  assert.equal(normalizeUrl('Example.com/path#frag'), 'https://example.com/path');
  for (const bad of ['http://localhost:3000', 'http://127.0.0.1', 'http://192.168.1.5/x', 'http://10.0.0.1', 'ftp://example.com', 'http://intranet', 'http://[::1]/', 'http://169.254.169.254/latest']) {
    assert.throws(() => normalizeUrl(bad), /refusing|only http|not a URL/, bad);
  }
});

test('page extraction reads SEO, headings, navigation, schema, forms and CTAs', () => {
  const p = extractPage(rich, 'https://x.test/');
  assert.equal(p.title, 'Rich Plumbing');
  assert.equal(p.description, 'About Rich Plumbing');
  assert.equal(p.canonical, 'https://x.test/');
  assert.equal(p.lang, 'en');
  assert.deepEqual(p.h1, ['Rich Plumbing']);
  assert.deepEqual(p.sections, ['Licensed and insured', '24/7 emergency service', 'Service areas']);
  assert.equal(p.nav.length, 5);
  assert.deepEqual(p.schema_types.sort(), ['Plumber', 'Service', 'Thing']);
  assert.equal(p.tel_links, 1);
  assert.equal(p.forms, 1);
  assert.ok(p.form_fields.includes('email') && p.form_fields.includes('textarea'));
  assert.equal(p.map_embed, true);
  assert.equal(p.viewport && p.og_image, true);
});

test('feature detection finds sections and calls to action, and matrix gaps compare client to competitors', () => {
  const features = (html) => detectFeatures([extractPage(html, 'https://x.test/')]);
  const richF = features(rich);
  for (const f of ['pricing', 'testimonials', 'booking', 'emergency', 'credentials', 'service_areas', 'phone_cta', 'contact_form', 'map_embed']) assert.ok(richF.includes(f), f);
  assert.deepEqual(features(bare), []);
  const sites = [
    { role: 'client', url: 'https://c.test', features: features(bare), skipped: null },
    { role: 'competitor', url: 'https://a.test', features: richF, skipped: null },
    { role: 'competitor', url: 'https://b.test', features: features(other), skipped: null },
    { role: 'competitor', url: 'https://d.test', features: [], skipped: 'robots.txt disallows this path for research crawlers' },
  ];
  const matrix = buildMatrix(sites);
  assert.ok(matrix.gaps.includes('phone_cta') && matrix.gaps.includes('testimonials'));
  assert.ok(matrix.gaps.includes('pricing'), 'exactly half of the competitors counts as a gap');
  assert.ok(!matrix.gaps.includes('financing') && !matrix.gaps.includes('careers'));
  assert.equal(matrix.rows.find((r) => r.feature === 'phone_cta').competitors_total, 2);
  assert.equal(matrix.rows.find((r) => r.feature === 'phone_cta').share, 1);
  assert.match(renderMatrixMarkdown({ generated_at: 'now', sites, matrix }), /Gaps against the client[\s\S]*phone_cta/);
});

test('PageSpeed responses are reduced to scores and web vitals', () => {
  assert.deepEqual(parsePsi(psiJson), { performance: 91, accessibility: 85, best_practices: 100, seo: 90, lcp_ms: 2312, cls: 0.02, tbt_ms: 120, fetched_at: '2026-09-30T00:00:00Z' });
  assert.equal(parsePsi({}), null);
  assert.match(psiUrl('https://a.test/', 'mobile', 'K'), /strategy=mobile.*category=seo.*key=K/);
});

test('auditSite reads home plus priority pages, sitemap and llms.txt, and scores with PageSpeed', async () => {
  const fetchMock = web({
    'https://a.test/robots.txt': { body: 'User-agent: *\nDisallow: /admin' },
    'https://a.test/': { body: rich },
    'https://a.test/services': { body: page('Services', [['Home', '/']], '<h2>Drain cleaning</h2>') },
    'https://a.test/pricing': { body: page('Pricing', [['Home', '/']]) },
    'https://a.test/sitemap.xml': { body: '<urlset><url><loc>a</loc></url><url><loc>b</loc></url></urlset>' },
    'https://a.test/llms.txt': { body: '# A\n' },
    'https://www.googleapis.com/pagespeedonline/v5/runPagespeed': { body: JSON.stringify(psiJson) },
  });
  const result = await auditSite('https://a.test/', { fetch: fetchMock, pages: 3, ...fast });
  assert.equal(result.skipped, null);
  assert.equal(result.pages.length, 3);
  assert.deepEqual(result.pages.map((p) => p.title).slice(0, 1), ['Rich Plumbing']);
  assert.equal(result.sitemap_urls, 2);
  assert.equal(result.llms_txt, true);
  assert.equal(result.psi.mobile.performance, 91);
  assert.ok(result.features.includes('pricing'));
  assert.ok(!('_signal' in result.pages[0]));
});

test('odd links, redirects to www, and a robots-declared sitemap do not break the audit (found on live sites)', async () => {
  const odd = page('Odd Site', [['Menu', 'javascript:void(0)'], ['Mail', 'mailto:a@b.co'], ['Call', 'tel:+1555'], ['Broken', 'http://[bad'], ['Services', '/services'], ['Hash', '#top']], '<h2>Hello</h2>');
  const fetchMock = async (url) => {
    const respond = (body, over = {}) => ({ status: 200, url, text: async () => body, json: async () => ({}), ...over });
    if (url === 'https://odd.test/robots.txt') return respond('Sitemap: https://www.odd.test/custom-map.xml');
    if (url === 'https://odd.test/') return respond(odd, { url: 'https://www.odd.test/' });
    if (url === 'https://www.odd.test/robots.txt') return respond('User-agent: *\nDisallow: /private\nSitemap: https://www.odd.test/custom-map.xml');
    if (url === 'https://www.odd.test/services') return respond(page('Services', [['Home', '/']], '<h2>Fix</h2>'));
    if (url === 'https://www.odd.test/custom-map.xml') return respond('<sitemapindex><sitemap><loc>a</loc></sitemap><sitemap><loc>b</loc></sitemap></sitemapindex>');
    return respond('', { status: 404 });
  };
  const result = await auditSite('https://odd.test/', { fetch: fetchMock, pages: 3, psi: false, ...fast });
  assert.equal(result.skipped, null);
  assert.deepEqual(result.pages.map((p) => p.title), ['Odd Site', 'Services']);
  assert.ok(result.notes.some((n) => /redirected to https:\/\/www\.odd\.test/.test(n)));
  assert.equal(result.sitemap_urls, 2);
  assert.ok(result.notes.some((n) => /sitemap is an index/.test(n)));
});

test('robots-blocked, failing and rate-limited sites are reported instead of crashing the audit', async () => {
  const blocked = await auditSite('https://b.test/', { fetch: web({ 'https://b.test/robots.txt': { body: 'User-agent: *\nDisallow: /' } }), ...fast });
  assert.match(blocked.skipped, /robots\.txt disallows/);
  const down = await auditSite('https://c.test/', { fetch: web({ 'https://c.test/': { status: 503, body: '' } }), ...fast });
  assert.match(down.skipped, /HTTP 503/);
  const limited = await auditSite('https://d.test/', { fetch: web({ 'https://d.test/': { body: bare }, 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed': { status: 429, body: '{}' } }), pages: 1, ...fast });
  assert.match(limited.psi.mobile.unavailable, /HTTP 429.*PSI_API_KEY/);
  const audit = await runAudit({ competitors: ['https://x.test', 'http://localhost:3000'], client: 'https://y.test', fetch: web({ 'https://x.test/': { body: rich }, 'https://y.test/': { body: bare } }), psi: false, pages: 1, ...fast });
  assert.equal(audit.sites.length, 3);
  assert.match(audit.sites.find((s) => s.url === 'http://localhost:3000').skipped, /refusing/);
  assert.ok(audit.matrix.gaps.length > 0);
  await assert.rejects(runAudit({ competitors: Array.from({ length: 9 }, (_, i) => `https://s${i}.test`), fetch: web({}), ...fast }), /at most 8 competitors/);
});
