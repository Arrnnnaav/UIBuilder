import Link from "next/link";
import { Faq } from "@/components/seo/Faq";
import { metadataFor } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = metadataFor("/");

// Placeholder home. The frontend agent replaces this from WIREFRAMES.md + DESIGN.md.
export default function Home() {
  return (
    <>
      <section className="py-24">
        <h1 className="text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-tight max-w-[18ch]">
          {site.name}
        </h1>
        <p className="mt-6 text-lg text-muted max-w-[var(--measure)]">{site.description}</p>
        <div className="mt-10">
          <Link href="/contact" className="button">
            Get in touch
          </Link>
        </div>
      </section>
      <div className="py-16">
        <Faq route="/" />
      </div>
    </>
  );
}
