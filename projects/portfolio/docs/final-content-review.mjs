import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write = (p,v) => fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
const routes = read('content/seo/routes.json');
const portfolio = read('content/portfolio.json');
const site = read('content/site.json');
const manifest = read('seo.manifest.json');
const reviewDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const errors = [];
const check = (ok,message) => {if(!ok) errors.push(message);};
routes['/work/ghostcursor'].title = 'GhostCursor: Local AI Desktop Guide · Arnav Khandelwal';
routes['/work/ghostcursor'].og.title = routes['/work/ghostcursor'].title;
for (const [route,meta] of Object.entries(routes)) {
  meta.lastModified = reviewDate;
  check(meta.title.length >= 10 && meta.title.length <= 70, route+' title length');
  check(meta.description.length >= 50 && meta.description.length <= 160, route+' description length');
  check(meta.canonical === route, route+' canonical');
  if(!meta.robots.startsWith('index')) continue;
  const file = route === '/' ? 'home' : route.slice(1).replaceAll('/','-');
  const schema = read('content/schema/'+file+'.json');
  schema.dateModified = reviewDate;
  schema.name = meta.title;
  schema.description = meta.description;
  check(schema.url === site.url+route, route+' schema URL');
  if(schema.mainEntity?.['@type'] === 'Article') {
    schema.mainEntity.dateModified = reviewDate;
    const slug = route.split('/').pop();
    const evidence = read('content/evidence/'+slug+'.json');
    schema.mainEntity.citation = evidence.sources.filter(s => evidence.metrics.some(m => m.status === 'verified' && m.source === s.id)).map(s => s.url);
  }
  write('content/schema/'+file+'.json',schema);
}
write('content/seo/routes.json',routes);
check(manifest.site.url === site.url,'manifest URL mismatch');
check(portfolio.name === 'Arnav Khandelwal','identity changed');
check(portfolio.email === 'arnavkhandelwal446@gmail.com','resume email mismatch');
check(portfolio.linkedin === null,'unverified LinkedIn publication');
check(read('content/schema/person.json').sameAs.length === 1,'unexpected person identity profile');
let verified=0,pending=0;
for (const project of portfolio.projects) {
  const evidence = read('content/evidence/'+project.slug+'.json');
  check(evidence.project === project.slug,project.slug+' evidence mismatch');
  for(const metric of evidence.metrics) {
    const source=evidence.sources.find(s=>s.id===metric.source);
    check(Boolean(source),project.slug+' missing metric source');
    if(metric.status==='verified') {verified++;check(/github\.com\/Arrnnnaav\/[^/]+\/blob\/[a-f0-9]{40}\//.test(source.url),project.slug+' unpinned verified source');}
    else pending++;
  }
}
const edge = read('content/evidence/edge-node.json').metrics[0];
check(edge.before === 5.356 && edge.after === 0.973,'Edge numerical precision changed');
check(read('content/evidence/neuroux.json').metrics[0].value === '50 min → ~80 s','NeuroUX approximate value changed');
const cited = read('content/evidence/cited-researcher.json').metrics.find(m=>m.before===152);
check(cited?.status === 'pending-source','resume timing exclusion changed');
check(fs.readFileSync(path.join(root,'lib/portfolio.ts'),'utf8').includes('metric.status === "verified"'),'visible evidence filter missing');
let faqs=0;
for(const f of fs.readdirSync(path.join(root,'content/faq')).filter(f=>f.endsWith('.json'))) {
  const faq=read('content/faq/'+f);check(Boolean(routes[faq.route]),f+' route missing');
  for(const item of faq.items) check(item.a.trim().split(/\s+/).length>=40,f+' short answer');
  faqs++;
}
const publicPdf=path.join(root,'public',portfolio.resumePath.slice(1));
const original='C:/Users/user/Downloads/resume (2).pdf';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const pdfHash=sha(publicPdf);check(pdfHash===sha(original),'public PDF differs from supplied original');
const result={reviewedAt:reviewDate,publicRoutes:Object.values(routes).filter(m=>m.robots.startsWith('index')).length,internalNoindexRoutes:Object.values(routes).filter(m=>!m.robots.startsWith('index')).length,schemaFiles:fs.readdirSync(path.join(root,'content/schema')).filter(f=>f.endsWith('.json')).length,faqFiles:faqs,projects:portfolio.projects.length,verifiedMetrics:verified,pendingMetrics:pending,resumeSha256:pdfHash,errors};
write('docs/evidence/content-review.json',result);
console.log(JSON.stringify(result,null,2));
if(errors.length) process.exitCode=1;
