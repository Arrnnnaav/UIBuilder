import Link from "next/link";
import type { Project } from "@/lib/portfolio";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { FooterAction } from "./FooterAction";
const siteLinks = [["Home", "/"], ["Work", "/work"], ["About", "/about"], ["Contact", "/contact"], ["Résumé", "/resume"]] as const;

export function Footer({ projects, github, linkedin, name }: { projects: Pick<Project, "slug" | "title">[]; github: string; linkedin: string | null; name: string }) {
  return <footer className="container site-footer"><FooterAction /><div className="footer-columns"><div><h2>Site</h2><nav aria-label="Footer">{siteLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></div><div><h2>Case studies</h2>{projects.map(project => <Link key={project.slug} href={`/work/${project.slug}`}>{project.title}</Link>)}</div><div><h2>Profiles</h2><a href={github} target="_blank" rel="me noopener noreferrer">GitHub <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>{linkedin && <a href={linkedin} rel="me noopener noreferrer" target="_blank">LinkedIn <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}</div></div><div className="footer-note"><Link href="/#evidence">Numbers on this site link to their sources.</Link><p>© {new Date().getFullYear()} {name}</p></div></footer>;
}
