import { metadataFor } from "@/lib/seo";

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
      <h1 className="text-[length:var(--text-xl)] font-semibold">Styleguide</h1>
      <section aria-labelledby="sg-colors">
        <h2 id="sg-colors" className="font-semibold mb-4">
          Colour
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {colors.map((name) => (
            <li key={name} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-10 rounded-md border border-border"
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
            {label} — The quick brown fox
          </p>
        ))}
      </section>
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
