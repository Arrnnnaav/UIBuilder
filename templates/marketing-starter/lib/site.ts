import siteJson from "@/content/site.json";
import routesJson from "@/content/seo/routes.json";
import crawlersJson from "@/content/seo/crawlers.json";
import { schemaFiles, faqFiles } from "@/lib/generated/content";
import { crawlersFile, faqFile, jsonLd, routesFile, siteFile, type FaqFile } from "@/lib/content-schemas";

// Parsed once at module load. A bad content file fails the build loudly instead of
// shipping broken metadata.
export const site = siteFile.parse(siteJson);
export const routes = routesFile.parse(routesJson);
export const crawlers = crawlersFile.parse(crawlersJson);

export const schemas = Object.fromEntries(
  Object.entries(schemaFiles).map(([file, value]) => [file, jsonLd.parse(value)]),
);

export const faqs: FaqFile[] = Object.values(faqFiles).map((value) => faqFile.parse(value));

export const faqFor = (route: string) => faqs.find((f) => f.route === route);

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
