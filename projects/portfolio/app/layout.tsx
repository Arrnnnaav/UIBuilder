import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import { globalJsonLd } from "@/lib/seo";
import { clientEnv } from "@/lib/env";
import { portfolio } from "@/lib/portfolio";
import { Navigation } from "@/components/portfolio/Navigation";
import { Footer } from "@/components/portfolio/Footer";
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
        <Navigation name={portfolio.name} github={portfolio.github} />
        <main id="main" tabIndex={-1} className="container flex-1">
          {children}
        </main>
        <Footer projects={portfolio.projects.map(({ slug, title }) => ({ slug, title }))} github={portfolio.github} linkedin={portfolio.linkedin} name={portfolio.name} />
        {globalJsonLd().map((data, index) => <JsonLd key={index} data={data} />)}
        <Analytics analyticsKey={clientEnv.NEXT_PUBLIC_POSTHOG_KEY} analyticsHost={clientEnv.NEXT_PUBLIC_POSTHOG_HOST} />
      </body>
    </html>
  );
}
