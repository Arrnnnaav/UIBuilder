import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import routes from '../content/seo/routes.json' with { type: 'json' };

const base = process.argv[2] ?? 'http://localhost:3400';
const output = 'docs/evidence/visual';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const observations = [];
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
    for (const route of Object.keys(routes).filter(path => path !== '/e2e-error')) {
      const errors = [];
      const onError = message => { if (message.type() === 'error') errors.push(message.text()); };
      page.on('console', onError);
      const response = await page.goto(`${base}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, h1: document.querySelector('h1')?.textContent }));
      const file = `${output}/${width}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '_')}.png`;
      await page.screenshot({ path: file, fullPage: true });
      observations.push({ route, width, status: response.status(), ...layout, errors, file });
      page.off('console', onError);
    }
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${output}/observations.json`, JSON.stringify(observations, null, 2));
console.table(observations.map(({ route, width, status, scrollWidth, errors }) => ({ route, width, status, scrollWidth, errors: errors.length })));
process.exitCode = observations.some(row => row.status !== 200 || row.scrollWidth > row.width || row.errors.length) ? 1 : 0;
