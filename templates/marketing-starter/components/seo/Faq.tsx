import { JsonLd } from "@/components/seo/JsonLd";
import { faqFor } from "@/lib/site";

// Answer-first FAQ (AEO). Content comes from content/faq/*.json; the same data is emitted
// as FAQPage JSON-LD so the visible answer and the structured answer never drift.
export function Faq({ route, heading = "Questions" }: { route: string; heading?: string }) {
  const faq = faqFor(route);
  if (!faq) return null;
  return (
    <section aria-labelledby="faq-heading" className="faq">
      <h2 id="faq-heading">{heading}</h2>
      {faq.items.map((item) => (
        <div key={item.q} className="faq-item">
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </div>
      ))}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </section>
  );
}
