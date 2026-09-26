import Link from "next/link";
import { portfolio } from "@/lib/portfolio";
import { ExternalLink } from "./ExternalLink";
export function ProfileLinks() { return <ul className="profile-links">{portfolio.email && <li><a className="text-link" href={`mailto:${portfolio.email}`}>{portfolio.email}</a></li>}<li><ExternalLink href={portfolio.github} profile>GitHub</ExternalLink></li>{portfolio.linkedin && <li><ExternalLink href={portfolio.linkedin} profile>LinkedIn</ExternalLink></li>}<li><Link href="/resume" className="text-link">Résumé and PDF</Link></li></ul>; }
