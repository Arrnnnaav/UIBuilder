import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { portfolio, evidenceFor } from "@/lib/portfolio";
import { HeroSpecimen, Ledger } from "@/components/portfolio/Ledger";
import { WorkIndex } from "@/components/portfolio/WorkIndex";
import { Faq } from "@/components/seo/Faq";
import { PageSchema } from "@/components/portfolio/PageSchema";
export const metadata = metadataFor("/");
export default function Home() {
 const rows = portfolio.projects.flatMap(p => { const e = evidenceFor(p.slug); const m = p.slug === "edge-node" ? e.metrics.find(item => item.label.toLowerCase().includes("p95")) ?? e.metrics[0] : e.metrics[0]; return m ? [{ metric: m, evidence: e, title: p.title, slug: p.slug }] : []; });
 return <><section className="hero"><div className="hero-copy"><h1>{portfolio.name}<span>{portfolio.role}</span></h1><p className="hero-positioning">{portfolio.positioning}</p><div className="hero-actions"><Link href="/contact" className="button">Contact Arnav</Link><Link href="#work" className="text-link">See the measured work</Link></div></div><HeroSpecimen /></section><section className="page-section" id="evidence"><h2>Measured results</h2><Ledger id="home-ledger" rows={rows} caption="Measured results. Each one links to its source." /></section><section className="page-section" id="work"><h2>Selected work</h2><WorkIndex /></section><section className="page-section more-work-teaser"><h2>Beyond the selected work</h2><p>{portfolio.moreWork.map((g, i) => <span key={g.label}>{i > 0 && ", "}<Link href={`/work#group-${i}`} className="text-link">{g.label}</Link></span>)}.</p></section><section className="page-section bio-teaser"><div><h2>The builder behind the benchmarks</h2><p>{portfolio.bio[0]}</p><Link href="/about" className="text-link">About Arnav Khandelwal</Link></div><dl><div><dt>Education</dt><dd>{portfolio.education.degree}<br />{portfolio.education.institution}<br /><span className="caption">{portfolio.education.period}</span></dd></div><div><dt>Focus</dt><dd>{portfolio.role}</dd></div>{portfolio.location && <div><dt>Based in</dt><dd>{portfolio.location}</dd></div>}</dl></section><div className="page-section"><Faq route="/" /></div><PageSchema route="/" /></>;
}
