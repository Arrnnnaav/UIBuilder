import { ContactChannels } from "@/components/contact/ContactChannels";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/contact");

export default function ContactPage() {
  return (
    <section className="py-16">
      <h1 className="text-[length:var(--text-xl)] font-semibold">Contact</h1>
      <p className="mt-4 text-muted max-w-[var(--measure)]">
        Tell us about your project. The fastest way to reach us is WhatsApp.
      </p>
      <div className="mt-10">
        <ContactChannels />
      </div>
    </section>
  );
}
