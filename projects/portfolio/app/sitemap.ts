import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/seo";
import { absoluteUrl, routes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((route) => ({
    url: absoluteUrl(route),
    // Editorial revision dates come from content, never the build clock.
    ...(routes[route].lastModified ? { lastModified: routes[route].lastModified } : {}),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
