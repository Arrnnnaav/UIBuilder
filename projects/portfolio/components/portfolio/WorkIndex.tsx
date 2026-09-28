import Link from "next/link";
import { portfolio, evidenceFor, metricValue } from "@/lib/portfolio";
import { WorkDock } from "./WorkDock";
import { EvidenceFigure } from "./EvidenceFigure";
import { ExternalLink } from "./ExternalLink";
export function WorkIndex({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
 const ProjectHeading = headingLevel === 2 ? "h2" : "h3";
 return <WorkDock previews={portfolio.projects.map(p => <EvidenceFigure key={p.slug} project={p} compact />)}>{portfolio.projects.map((p, i) => { const m = evidenceFor(p.slug).metrics[0]; return <article className="work-row" data-work-row={i} key={p.slug}><div className="work-row-heading"><ProjectHeading><Link href={`/work/${p.slug}`}>{p.title}</Link></ProjectHeading><span className="caption">{p.year}</span></div><p>{p.descriptor}</p><div className="work-row-meta"><p className="caption">{p.stack.slice(0, 3).join(", ")}</p>{m && <p className="work-headline">{metricValue(m)}</p>}</div><details className="touch-preview"><summary>Preview {p.title}</summary><EvidenceFigure project={p} compact /><Link className="text-link" href={`/work/${p.slug}`}>{p.title} case study</Link></details></article>; })}</WorkDock>;
}
export function MoreWork() { return <section id="more-work" className="page-section"><h2>More work</h2><div className="work-appendix">{portfolio.moreWork.map((g, i) => <details id={`group-${i}`} key={g.label} open={i === 0}><summary><h3>{g.label}</h3><span className="caption">{g.items.length} repositories</span></summary><ul>{g.items.map(item => <li key={item.url}><ExternalLink href={item.url}>{item.name}</ExternalLink><p className="caption">{item.description}</p></li>)}</ul></details>)}</div></section>; }
