// Mechanical checks for the taste-core bans (brain/playbooks/taste-core.md). Advisory evidence for the
// premium-bar review and /audit; it has no gate authority and cannot judge taste.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', '.git', '.astro', 'docs', 'e2e', 'tests', 'test', 'coverage', '.vercel', '.wrangler', 'out', '__snapshots__']);
const CODE = /\.(tsx|ts|jsx|js|mjs|astro|html)$/;
const COPY = /\.(tsx|jsx|astro|html|json|md|mdx)$/;
const ROOTS = ['app', 'components', 'content', 'src', 'pages', 'astro-pilot/src'];

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:"'`\\])\/\/[^\n]*/g, '$1');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), out); }
    else if (entry.isFile() && statSync(join(dir, entry.name)).size < 400_000) out.push(join(dir, entry.name));
  }
  return out;
}

export function lintProject(project) {
  const files = ROOTS.flatMap((dir) => walk(join(project, dir))).filter((file) => CODE.test(file) || COPY.test(file) || file.endsWith('.css'));
  const sources = files.map((file) => {
    const raw = readFileSync(file, 'utf8');
    const rel = relative(project, file).split(sep).join('/');
    return { rel, isCode: CODE.test(file), isCss: file.endsWith('.css'), text: CODE.test(file) || file.endsWith('.css') ? stripComments(raw) : raw };
  });
  const findings = [];
  const rule = (id, severity, description, test, only = () => true) => {
    const hits = [];
    for (const source of sources.filter(only)) {
      source.text.split('\n').forEach((line, index) => { if (test(line, source)) hits.push(`${source.rel}:${index + 1}`); });
    }
    if (hits.length) findings.push({ id, severity, description, count: hits.length, samples: hits.slice(0, 3) });
  };

  rule('dash-in-copy', 'fail', 'em-dash or en-dash in visible copy (use a period, comma, colon or hyphen)', (line) => /[—–]/.test(line), (s) => !s.isCss);
  rule('placeholder-copy', 'fail', 'placeholder or startup-slop copy (lorem ipsum, John/Jane Doe, Acme, Nexus)', (line) => /lorem ipsum|\bjohn doe\b|\bjane doe\b|\bacme\b|\bnexus\b/i.test(line), (s) => !s.isCss);
  rule('scroll-listener', 'fail', 'window scroll listener (use Motion useScroll, ScrollTrigger, IntersectionObserver or CSS scroll-driven animation)', (line) => /addEventListener\(\s*['"]scroll['"]/.test(line), (s) => s.isCode);
  rule('scrolly-in-state', 'warn', 'scroll position written to React state', (line) => /\bset[A-Z]\w*\([^)]*(window\.)?scrollY/.test(line), (s) => s.isCode);
  rule('h-screen', 'warn', 'h-screen instead of min-h-[100dvh]', (line) => /\bh-screen\b/.test(line), (s) => s.isCode);
  rule('animated-layout-props', 'warn', 'animating width, height, top or left instead of transform and opacity', (line) => /animate=\{\{[^}]*\b(width|height|top|left)\b/.test(line), (s) => s.isCode);
  rule('custom-cursor', 'warn', 'custom mouse cursor', (line) => /cursor:\s*(none|url\()/.test(line), (s) => s.isCode || s.isCss);
  rule('inter-default', 'warn', 'Inter as the font (allowed only when the brief asks for a neutral look)', (line) => /\bInter\b\s*\(|font-family:[^;]*\bInter\b/.test(line), (s) => s.isCode || s.isCss);
  rule('banned-serif', 'warn', 'Fraunces or Instrument Serif by reflex', (line) => /Fraunces|Instrument[_ ]Serif/.test(line), (s) => s.isCode || s.isCss);
  rule('lucide', 'warn', 'lucide-react (prefer Phosphor, HugeIcons, Radix or Tabler)', (line) => /from ['"]lucide-react['"]/.test(line), (s) => s.isCode);
  rule('filler-verbs', 'warn', 'filler marketing verbs (elevate, seamless, unleash, next-gen, revolutionize, game-changing)', (line) => /\b(elevate|seamless(ly)?|unleash|next-gen|revolutionize|game-changing)\b/i.test(line), (s) => !s.isCss);
  rule('scroll-cue', 'warn', 'scroll cue label in the markup', (line) => />\s*(scroll( to explore| down)?|↓ scroll)\s*</i.test(line), (s) => s.isCode);

  const mixed = sources.filter((s) => s.isCode && /from ['"]gsap['"]/.test(s.text) && /from ['"]motion\/react['"]/.test(s.text));
  if (mixed.length) findings.push({ id: 'gsap-with-motion', severity: 'warn', description: 'GSAP and Motion imported in one file (isolate each in its own client leaf)', count: mixed.length, samples: mixed.slice(0, 3).map((s) => s.rel) });

  const usesMotion = sources.some((s) => s.isCode && /from ['"](motion\/react|gsap|framer-motion)['"]/.test(s.text));
  const honorsReduced = sources.some((s) => /prefers-reduced-motion|useReducedMotion/.test(s.text));
  if (usesMotion && !honorsReduced) findings.push({ id: 'reduced-motion-missing', severity: 'fail', description: 'animation library used but no prefers-reduced-motion or useReducedMotion handling found', count: 1, samples: [] });

  const sectionCount = sources.filter((s) => s.isCode).reduce((n, s) => n + (s.text.match(/<section\b/g)?.length ?? 0), 0);
  const eyebrows = sources.filter((s) => s.isCode).reduce((n, s) => n + s.text.split('\n').filter((line) => /uppercase/.test(line) && /tracking-/.test(line)).length, 0);
  if (sectionCount && eyebrows > Math.ceil(sectionCount / 3)) {
    findings.push({ id: 'eyebrow-overuse', severity: 'warn', description: `about ${eyebrows} uppercase tracked labels for ${sectionCount} sections (limit ${Math.ceil(sectionCount / 3)}; approximate count)`, count: eyebrows, samples: [] });
  }
  const marquees = sources.filter((s) => s.isCode && /marquee/i.test(s.text)).length;
  if (marquees > 1) findings.push({ id: 'marquee-count', severity: 'warn', description: 'more than one file implements a marquee (limit one per page)', count: marquees, samples: [] });

  return { scanned_files: sources.length, findings, failed: findings.filter((f) => f.severity === 'fail').length, warned: findings.filter((f) => f.severity === 'warn').length };
}
