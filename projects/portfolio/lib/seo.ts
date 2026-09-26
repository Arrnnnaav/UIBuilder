import type { Metadata } from "next";
import { routes, site, schemas } from "@/lib/site";

// Route filenames make scope explicit: unrelated case-study schema never leaks
// into the root layout or another project's page.
export function selectJsonLd(files: Record<string, unknown>, route?: string): unknown[] {
  const base = route === "/" ? "home" : route?.slice(1).replaceAll("/", "-");
  const names = base
    ? [`${base}.json`, `${base}-breadcrumb.json`, `${base}-software.json`]
    : ["person.json", "website.json"];
  return names.filter((name) => name in files).map((name) => files[name]);
}

export const globalJsonLd = () => selectJsonLd(schemas);
export const jsonLdFor = (route: string) => selectJsonLd(schemas, route);

// Every page calls metadataFor(route). Route metadata lives in content/seo/routes.json so
// BusinessOS can improve it through an approved PR without touching code.
export function metadataFor(route: string): Metadata {
  const meta = routes[route];
  if (!meta) {
    throw new Error(`content/seo/routes.json has no entry for "${route}"`);
  }
  const [index, follow] = meta.robots.split(",");
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    robots: { index: index === "index", follow: follow === "follow" },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: meta.canonical,
      title: meta.og?.title ?? meta.title,
      description: meta.og?.description ?? meta.description,
      ...(meta.og?.image ? { images: [meta.og.image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.og?.title ?? meta.title,
      description: meta.og?.description ?? meta.description,
    },
  };
}

export const indexableRoutes = () =>
  Object.entries(routes)
    .filter(([, meta]) => meta.robots.startsWith("index"))
    .map(([route]) => route);
