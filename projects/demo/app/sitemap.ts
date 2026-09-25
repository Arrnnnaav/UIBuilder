import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexableRoutes().map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
