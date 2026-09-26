import { ContactForm } from "@/components/contact/ContactForm";
import { clientEnv } from "@/lib/env";
import { metadataFor } from "@/lib/seo";
import { portfolio } from "@/lib/portfolio";
import { Intro } from "@/components/portfolio/Intro";
import { ProfileLinks } from "@/components/portfolio/ProfileLinks";
import { PageSchema } from "@/components/portfolio/PageSchema";
import { Faq } from "@/components/seo/Faq";

export const metadata = metadataFor("/contact");

export default function ContactPage() {
  return (
    <>
      <Intro title={`Contact ${portfolio.name}`}><p>Write about backend and AI roles, internships, collaborations or a build you have in mind.</p></Intro>
      <div className="contact-grid">
        <ContactForm turnstileSiteKey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY} github={portfolio.github} />
        <aside><h2>Direct channels</h2><p className="caption">Prefer a direct conversation? Use a profile or email.</p><ProfileLinks /></aside>
      </div>
      <div className="page-section"><Faq route="/contact" /></div><PageSchema route="/contact" />
    </>
  );
}
