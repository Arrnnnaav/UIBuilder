import { metadataFor } from "@/lib/seo";
import { portfolio } from "@/lib/portfolio";
import { Intro } from "@/components/portfolio/Intro";
import { Timeline, Skills, Recognition } from "@/components/portfolio/Bio";
import { ProfileLinks } from "@/components/portfolio/ProfileLinks";
import { PageSchema } from "@/components/portfolio/PageSchema";
import { Faq } from "@/components/seo/Faq";
export const metadata = metadataFor("/about");
export default function About() { return <><Intro title={`About ${portfolio.name}`}><p>{portfolio.role}. {portfolio.education.degree} at {portfolio.education.institution}.</p></Intro><section className="bio-prose">{portfolio.bio.map(p => <p key={p}>{p}</p>)}</section><Timeline /><Skills /><Recognition /><div className="page-section"><Faq route="/about" /></div><section className="page-section"><h2>Elsewhere</h2><ProfileLinks /></section><PageSchema route="/about" /></>; }
