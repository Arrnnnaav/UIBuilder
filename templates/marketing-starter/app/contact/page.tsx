import { ContactForm } from "@/components/contact/ContactForm";
import { clientEnv } from "@/lib/env";
import { metadataFor } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = metadataFor("/contact");

export default function ContactPage() {
  return (
    <section className="py-16">
      <h1 className="text-[length:var(--text-xl)] font-semibold">Contact</h1>
      <p className="mt-4 text-muted max-w-[var(--measure)]">
        Tell us what you need. Prefer email? Write to <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <div className="mt-10">
        <ContactForm turnstileSiteKey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      </div>
    </section>
  );
}
