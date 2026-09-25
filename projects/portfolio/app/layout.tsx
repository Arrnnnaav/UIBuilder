import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { schemas, site } from "@/lib/site";
import "./globals.css";

// DESIGN.md §Typography: Archivo (variable wght + wdth; OFL) for everything including numerals,
// Martian Mono (OFL) for literal code and filenames only. Mono is never preloaded.
const sans = Archivo({
  variable: "--font-sans-family",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  adjustFontFallback: true,
});
const mono = Martian_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: "%s" },
  description: site.description,
  applicationName: site.name,
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.locale.split("_")[0]} className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="container flex items-center justify-between py-6">
          <Link href="/" className="font-semibold">
            {site.shortName}
          </Link>
          <nav aria-label="Primary">
            <ul className="flex gap-6">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main id="main" className="container flex-1">
          {children}
        </main>
        <footer className="container py-12 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {site.name} · <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </footer>
        {Object.entries(schemas).map(([file, data]) => (
          <JsonLd key={file} data={data} />
        ))}
        <Analytics />
      </body>
    </html>
  );
}
