import Link from "next/link";
import { statSync } from "node:fs";
import { join } from "node:path";
import { metadataFor } from "@/lib/seo";
import { portfolio } from "@/lib/portfolio";
import { Intro } from "@/components/portfolio/Intro";
import { Timeline, Skills, Recognition } from "@/components/portfolio/Bio";
import { PageSchema } from "@/components/portfolio/PageSchema";
export const metadata = metadataFor("/resume");
export default function Resume() { const size = Math.round(statSync(join(process.cwd(), "public", portfolio.resumePath.replace(/^\//, ""))).size / 1024); return <><Intro title={`${portfolio.name}, résumé`}><p>{portfolio.role}. A readable résumé, with project source links.</p><a href={portfolio.resumePath} download className="button">Download PDF</a><p className="caption">PDF, {size} KB</p></Intro><Timeline /><section className="page-section"><h2>Projects</h2><div className="resume-projects">{portfolio.projects.map(p => <article key={p.slug}><h3><Link href={`/work/${p.slug}`}>{p.title}</Link></h3><p>{p.summary}</p><p className="caption">{p.stack.join(", ")}</p></article>)}</div></section><section className="page-section"><h2>Education</h2><p>{portfolio.education.degree}<br />{portfolio.education.institution}<br />{portfolio.education.period}</p></section><Skills /><Recognition /><PageSchema route="/resume" /></>; }
