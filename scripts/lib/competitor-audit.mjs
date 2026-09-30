// Competitor and client-site audit: page inventory, sections/features, SEO snapshot and Lighthouse scores (via Google's
// PageSpeed Insights API, so no local browser). Public pages only: robots.txt is honored, private addresses are refused,
// volume is capped and rate-limited, nothing is submitted or logged in. Heuristics are signals to verify, not facts.
export const USER_AGENT = 'UIBuilderResearch/1.0 (design research; public pages only)';
const MAX_BYTES = 2_000_000;

export const FEATURES = {
  pricing: /\b(pricing|prices?|rates|plans|packages)\b/,
  testimonials: /\b(testimonials?|reviews?|what (our )?(clients|customers|patients|guests) say|5[- ]star)\b/,
  case_studies: /\b(case stud(y|ies)|our work|projects?|portfolio|before (and|&) after|results)\b/,
  gallery: /\b(gallery|photos?|lookbook)\b/,
  faq: /\b(faqs?|frequently asked|common questions)\b/,
  blog: /\b(blog|news|articles?|insights|resources|guides)\b/,
  booking: /\b(book( online| now| an? appointment)?|schedule|appointments?|reserve|reservations?)\b/,
  quote_request: /\b(free (quote|estimate)|get (a |your )?(quote|estimate)|request (a )?(quote|estimate))\b/,
  emergency: /\b(24\/7|24 hours|emergency|same[- ]day)\b/,
  service_areas: /\b(service areas?|areas we serve|locations?|near you|serving)\b/,
  credentials: /\b(licensed|insured|certified|accredited|certifications?|awards?|bonded|member of)\b/,
  team: /\b(our team|meet (the|our)|staff|our story)\b/,
  about: /\b(about|who we are)\b/,
  shop_or_order: /\b(shop|store|order online|add to cart|cart|checkout|takeout|delivery)\b/,
  menu: /\b(menu|drinks|wine list)\b/,
  newsletter: /\b(newsletter|subscribe|sign up for)\b/,
  careers: /\b(careers|jobs|join (our|the) team|hiring)\b/,
  financing: /\b(financing|payment plans?)\b/,
};
const CHAT = /(intercom|drift\.com|tawk\.to|crisp\.chat|livechatinc|tidio|hs-scripts|zopim|olark)/i;

const fail = (message) => { throw new Error(message); };

export function normalizeUrl(input) {
  let url;
  try { url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`); } catch { return fail(`not a URL: ${input}`); }
  if (!['http:', 'https:'].includes(url.protocol)) fail(`only http(s) URLs are allowed: ${input}`);
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.') && !host.includes(':')) fail(`refusing a non-public host: ${host}`);
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || host === '::1' || host.startsWith('[')) fail(`refusing a private address: ${host}`);
  url.hash = '';
  return url.toString();
}

// Minimal robots.txt check for our user agent (falls back to *). Longest matching rule wins; Allow beats Disallow on ties.
export function robotsAllows(robotsText, path) {
  const groups = [];
  let current = null;
  for (const raw of String(robotsText ?? '').split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (key === 'user-agent') { if (!current || current.rules.length) { current = { agents: [], rules: [] }; groups.push(current); } current.agents.push(m[2].trim().toLowerCase()); }
    else if (current && (key === 'allow' || key === 'disallow')) current.rules.push({ allow: key === 'allow', path: m[2].trim() });
  }
  const mine = groups.find((g) => g.agents.some((a) => a !== '*' && 'uibuilderresearch'.includes(a.replace(/\*/g, '')) && a)) ?? groups.find((g) => g.agents.includes('*'));
  if (!mine) return true;
  let best = null;
  for (const rule of mine.rules) {
    if (!rule.path) continue;
    const pattern = new RegExp('^' + rule.path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (pattern.test(path) && (!best || rule.path.length > best.path.length || (rule.path.length === best.path.length && rule.allow))) best = rule;
  }
  return best ? best.allow : true;
}

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, ' ');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&amp;|&#\d+;|&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))?.slice(2).find(Boolean);

export function extractPage(html, pageUrl) {
  const clean = strip(html);
  const origin = new URL(pageUrl);
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (key) => { const tag = metas.find((t) => (attr(t, 'name') ?? attr(t, 'property'))?.toLowerCase() === key); return tag ? attr(tag, 'content') ?? '' : undefined; };
  const anchors = [...clean.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: attr(m[0], 'href') ?? '', text: text(m[1]) })).filter((a) => a.href);
  const navBlocks = [...clean.matchAll(/<(nav|header)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]).join(' ');
  const navLinks = [...navBlocks.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: attr(m[0], 'href') ?? '', text: text(m[1]) })).filter((a) => a.href && a.text && a.text.length < 40);
  const types = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (node) => { if (Array.isArray(node)) node.forEach(walk); else if (node && typeof node === 'object') { if (node['@type']) types.push(...[].concat(node['@type'])); Object.values(node).forEach(walk); } };
      walk(JSON.parse(m[1]));
    } catch { /* ignore malformed JSON-LD */ }
  }
  const headings = [...clean.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: text(m[2]) })).filter((h) => h.text);
  const forms = [...clean.matchAll(/<form\b[\s\S]*?<\/form>/gi)].map((m) => m[0]);
  const bodyText = text(clean);
  const resolve = (href) => { try { return new URL(href, pageUrl); } catch { return null; } };
  return {
    url: pageUrl,
    title: text(clean.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: meta('description') ?? null,
    canonical: attr(html.match(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i)?.[0] ?? '', 'href') ?? null,
    lang: attr(html.match(/<html\b[^>]*>/i)?.[0] ?? '', 'lang') ?? null,
    viewport: Boolean(meta('viewport')),
    og_image: Boolean(meta('og:image')),
    h1: headings.filter((h) => h.level === 1).map((h) => h.text),
    sections: headings.filter((h) => h.level === 2).map((h) => h.text).slice(0, 30),
    nav: navLinks.slice(0, 40),
    internal_links: [...new Set(anchors.map((a) => resolve(a.href)).filter((u) => u && u.host === origin.host).map((u) => u.origin + u.pathname))].slice(0, 200),
    schema_types: [...new Set(types)],
    images: (html.match(/<img\b/gi) ?? []).length,
    forms: forms.length,
    form_fields: [...new Set(forms.flatMap((f) => [...f.matchAll(/<(input|textarea|select)\b[^>]*>/gi)].map((m) => (attr(m[0], 'type') ?? m[1]).toLowerCase())))],
    tel_links: anchors.filter((a) => /^tel:/i.test(a.href)).length,
    mailto_links: anchors.filter((a) => /^mailto:/i.test(a.href)).length,
    live_chat: CHAT.test(html),
    map_embed: /<iframe[^>]+(google\.[a-z.]+\/maps|maps\.google|openstreetmap)/i.test(html),
    words: bodyText ? bodyText.split(' ').length : 0,
    _signal: `${navLinks.map((l) => `${l.text} ${l.href}`).join(' ')} ${headings.map((h) => h.text).join(' ')} ${anchors.map((a) => a.text).join(' ')}`.toLowerCase(),
  };
}

export function detectFeatures(pages) {
  const signal = pages.map((p) => p._signal).join(' ');
  const found = {};
  for (const [name, pattern] of Object.entries(FEATURES)) if (pattern.test(signal)) found[name] = true;
  if (pages.some((p) => p.tel_links > 0)) found.phone_cta = true;
  if (pages.some((p) => p.forms > 0 && p.form_fields.some((f) => ['email', 'textarea', 'tel'].includes(f)))) found.contact_form = true;
  if (pages.some((p) => p.live_chat)) found.live_chat = true;
  if (pages.some((p) => p.map_embed)) found.map_embed = true;
  const serviceNav = new Set(pages.flatMap((p) => p.nav).filter((l) => /service|repair|install|clean|treatment|cut|colou?r|class|lesson/i.test(`${l.text} ${l.href}`)).map((l) => l.href));
  if (serviceNav.size >= 3) found.multiple_service_pages = true;
  return Object.keys(found).sort();
}

export function parsePsi(json) {
  const lh = json?.lighthouseResult;
  if (!lh) return null;
  const score = (id) => (lh.categories?.[id]?.score === null || lh.categories?.[id]?.score === undefined ? null : Math.round(lh.categories[id].score * 100));
  const audit = (id) => lh.audits?.[id]?.numericValue ?? null;
  return { performance: score('performance'), accessibility: score('accessibility'), best_practices: score('best-practices'), seo: score('seo'),
    lcp_ms: audit('largest-contentful-paint') === null ? null : Math.round(audit('largest-contentful-paint')), cls: audit('cumulative-layout-shift'),
    tbt_ms: audit('total-blocking-time') === null ? null : Math.round(audit('total-blocking-time')), fetched_at: json.analysisUTCTimestamp ?? null };
}

export function psiUrl(url, strategy = 'mobile', key) {
  const params = new URLSearchParams({ url, strategy });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) params.append('category', c);
  if (key) params.set('key', key);
  return `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
}

const pathOf = (url) => { const u = new URL(url); return u.pathname + u.search; };
async function get(fetchImpl, url, { timeoutMs = 15000 } = {}) {
  const response = await fetchImpl(url, { headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,text/plain,application/xml' }, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
  const body = await response.text();
  return { status: response.status, body: body.length > MAX_BYTES ? body.slice(0, MAX_BYTES) : body, url: response.url || url };
}
const PRIORITY = /(service|price|pricing|about|contact|menu|book|work|project|gallery|team|faq|blog)/i;

export async function auditSite(siteUrl, { fetch: fetchImpl = fetch, pages = 3, psi = true, psiKey, delayMs = 1000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  const start = normalizeUrl(siteUrl);
  const result = { url: start, fetched_at: new Date().toISOString(), skipped: null, pages: [], features: [], sitemap_urls: null, llms_txt: null, robots_txt: null, psi: {}, notes: [] };
  const readRobots = async (origin) => {
    try { const r = await get(fetchImpl, `${origin}/robots.txt`); result.robots_txt = r.status === 200; return r.status === 200 ? r.body : ''; } catch { result.robots_txt = null; return ''; }
  };
  let robots = await readRobots(new URL(start).origin);
  if (!robotsAllows(robots, pathOf(start))) { result.skipped = 'robots.txt disallows this path for research crawlers'; return result; }
  await sleep(delayMs);
  const home = await get(fetchImpl, start);
  if (home.status >= 400) { result.skipped = `home page returned HTTP ${home.status}`; return result; }
  // The site may redirect (example.com to www.example.com): judge and crawl by the final origin.
  const origin = new URL(home.url).origin;
  if (origin !== new URL(start).origin) {
    result.notes.push(`redirected to ${origin}`);
    robots = await readRobots(origin);
    if (!robotsAllows(robots, pathOf(home.url))) { result.skipped = 'robots.txt disallows this path for research crawlers'; return result; }
  }
  const homePage = extractPage(home.body, home.url);
  const fetched = [homePage];
  const toPageUrl = (href) => { try { const u = new URL(href, home.url); return /^https?:$/.test(u.protocol) ? u.origin + u.pathname : null; } catch { return null; } };
  const candidates = [...new Set([...homePage.nav.map((l) => toPageUrl(l.href)), ...homePage.internal_links.map(toPageUrl)])]
    .filter((u) => u && new URL(u).origin === origin && pathOf(u) !== '/' && !/\.(pdf|jpe?g|png|webp|gif|svg|zip|mp4)$/i.test(u))
    .sort((a, b) => Number(PRIORITY.test(b)) - Number(PRIORITY.test(a)));
  for (const url of candidates) {
    if (fetched.length >= pages) break;
    if (!robotsAllows(robots, pathOf(url))) continue;
    await sleep(delayMs);
    try { const r = await get(fetchImpl, url); if (r.status < 400 && /html/i.test(r.body.slice(0, 500) + '<html')) fetched.push(extractPage(r.body, r.url)); } catch { result.notes.push(`could not fetch ${url}`); }
  }
  result.pages = fetched.map(({ _signal, ...page }) => page);
  result.features = detectFeatures(fetched);
  try {
    await sleep(delayMs);
    const declared = robots.match(/^\s*sitemap\s*:\s*(\S+)/im)?.[1];
    let sitemapUrl = `${origin}/sitemap.xml`;
    if (declared) { try { const u = new URL(declared, origin); if (u.origin === origin) sitemapUrl = u.toString(); } catch { /* keep default */ } }
    const s = await get(fetchImpl, sitemapUrl);
    result.sitemap_urls = s.status === 200 ? (s.body.match(/<loc>/gi) ?? []).length : null;
    if (s.status === 200 && /<sitemapindex/i.test(s.body)) result.notes.push('sitemap is an index; count is the number of child sitemaps');
  } catch { result.sitemap_urls = null; }
  try { await sleep(delayMs); const l = await get(fetchImpl, `${origin}/llms.txt`); result.llms_txt = l.status === 200 && !/<html/i.test(l.body.slice(0, 300)); } catch { result.llms_txt = null; }
  if (psi) {
    for (const strategy of ['mobile']) {
      try {
        const response = await fetchImpl(psiUrl(start, strategy, psiKey), { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(90000) });
        if (response.status === 200) result.psi[strategy] = parsePsi(await response.json());
        else result.psi[strategy] = { unavailable: `PageSpeed Insights returned HTTP ${response.status}${response.status === 429 ? ' (quota; set PSI_API_KEY for more)' : ''}` };
      } catch (error) { result.psi[strategy] = { unavailable: `PageSpeed Insights request failed: ${error.message}` }; }
    }
  }
  return result;
}

export async function runAudit({ competitors, client, ...options }) {
  const sites = [];
  const list = [...(client ? [{ role: 'client', url: client }] : []), ...competitors.map((url) => ({ role: 'competitor', url }))];
  if (competitors.length > 8) fail('at most 8 competitors plus the client per audit');
  for (const item of list) {
    try { sites.push({ role: item.role, ...(await auditSite(item.url, options)) }); }
    catch (error) { sites.push({ role: item.role, url: item.url, skipped: error.message, pages: [], features: [], psi: {}, notes: [] }); }
  }
  return { schema_version: 1, generated_at: new Date().toISOString(), user_agent: USER_AGENT, sites, matrix: buildMatrix(sites) };
}

// features x sites, plus the gaps: features most competitors show that the client lacks.
export function buildMatrix(sites) {
  const competitors = sites.filter((s) => s.role === 'competitor' && !s.skipped);
  const client = sites.find((s) => s.role === 'client');
  const names = [...new Set(sites.flatMap((s) => s.features ?? []))].sort();
  const rows = names.map((feature) => {
    const have = competitors.filter((s) => s.features.includes(feature)).length;
    return { feature, competitors_with: have, competitors_total: competitors.length, share: competitors.length ? Math.round((have / competitors.length) * 100) / 100 : 0, client_has: client && !client.skipped ? client.features.includes(feature) : null };
  }).sort((a, b) => b.share - a.share || a.feature.localeCompare(b.feature));
  const gaps = client && !client.skipped ? rows.filter((r) => r.share >= 0.5 && r.client_has === false).map((r) => r.feature) : [];
  const unique = client && !client.skipped ? rows.filter((r) => r.client_has === true && r.competitors_with === 0).map((r) => r.feature) : [];
  return { rows, gaps, client_only: unique };
}

const cell = (v) => (v === true ? 'yes' : v === false ? 'no' : v ?? 'n/a');
export function renderMatrixMarkdown(audit) {
  const { sites, matrix } = audit;
  const lines = ['# Competitor matrix', '', `Generated ${audit.generated_at} by scripts/competitor-audit.mjs. Heuristic signals from public pages; verify anything important by hand.`, '', '## Sites'];
  lines.push('', '| Role | URL | Pages read | Sitemap URLs | llms.txt | Schema | Perf | A11y | SEO | LCP ms | Notes |', '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const s of sites) {
    const p = s.psi?.mobile;
    const schema = [...new Set((s.pages ?? []).flatMap((pg) => pg.schema_types))].slice(0, 4).join(', ') || 'none';
    lines.push(`| ${s.role} | ${s.url} | ${(s.pages ?? []).length} | ${cell(s.sitemap_urls)} | ${cell(s.llms_txt)} | ${schema} | ${cell(p?.performance)} | ${cell(p?.accessibility)} | ${cell(p?.seo)} | ${cell(p?.lcp_ms)} | ${s.skipped ?? p?.unavailable ?? ''} |`);
  }
  const usable = sites.filter((s) => !s.skipped);
  lines.push('', '## Features and sections', '', `| Feature | ${usable.map((s) => s.role === 'client' ? 'CLIENT' : new URL(s.url).hostname.replace(/^www\./, '')).join(' | ')} | Competitors with it |`, `|---|${usable.map(() => '---').join('|')}|---|`);
  for (const row of matrix.rows) lines.push(`| ${row.feature} | ${usable.map((s) => (s.features.includes(row.feature) ? 'yes' : '-')).join(' | ')} | ${row.competitors_with}/${row.competitors_total} |`);
  lines.push('', '## Gaps against the client', '', matrix.gaps.length ? matrix.gaps.map((g) => `- **${g}**: shown by at least half of the competitors and missing on the client's site.`).join('\n') : '_No client site audited, or no gap reaches half of the competitors._');
  if (matrix.client_only.length) lines.push('', '## Only the client has', '', matrix.client_only.map((g) => `- ${g}`).join('\n'));
  return lines.join('\n') + '\n';
}
