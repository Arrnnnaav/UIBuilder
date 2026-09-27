import { metadataFor } from "@/lib/seo";
import { portfolio, evidenceFor } from "@/lib/portfolio";
import { Ledger } from "@/components/portfolio/Ledger";
import { EvidenceFigure } from "@/components/portfolio/EvidenceFigure";
import { MoreWork } from "@/components/portfolio/WorkIndex";
import { ContactForm } from "@/components/contact/ContactForm";
import { Intro } from "@/components/portfolio/Intro";
import { PageSchema } from "@/components/portfolio/PageSchema";

export const metadata = metadataFor("/styleguide");

// Living styleguide: the design source of truth rendered from tokens.css. Replaces Figma.
const colors = ["bg", "surface", "fg", "muted", "border", "accent", "accent-fg", "danger", "success"];
const type = [
  ["display", "--text-display"],
  ["xl", "--text-xl"],
  ["lg", "--text-lg"],
  ["base", "--text-base"],
  ["sm", "--text-sm"],
];

export default function Styleguide() {
  return (
    <div className="py-16 grid gap-16">
      <PageSchema route="/styleguide" />
      <Intro title="Styleguide"><p>The approved tokens and real components, with source-backed data.</p></Intro>
      <section aria-labelledby="sg-colors">
        <h2 id="sg-colors" className="font-semibold mb-4">
          Colour
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {colors.map((name) => (
            <li key={name} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-10 border border-border"
                style={{ background: `var(--color-${name})` }}
              />
              <code>--color-{name}</code>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="sg-type">
        <h2 id="sg-type" className="font-semibold mb-4">
          Type
        </h2>
        {type.map(([label, token]) => (
          <p key={label} style={{ fontSize: `var(${token})` }} className="leading-tight">
            {label}: The quick brown fox
          </p>
        ))}
      </section>
      <section><h2>Ledger states</h2><Ledger id="styleguide-ledger" caption="Comparison, single value and qualitative facts." rows={portfolio.projects.flatMap(p => { const e = evidenceFor(p.slug); return e.metrics.slice(0, 1).map(metric => ({ metric, evidence: e, title: p.title, slug: p.slug })); })} /></section>
      <section><h2>Evidence figures</h2><div className="resume-projects">{portfolio.projects.map(p => <EvidenceFigure key={p.slug} project={p} />)}</div></section>
      <section><h2>Contact form</h2><ContactForm /></section>
      <MoreWork />
      <section aria-labelledby="sg-components">
        <h2 id="sg-components" className="font-semibold mb-4">
          Components
        </h2>
        <button type="button" className="button">
          Primary button
        </button>
      </section>
    </div>
  );
}
