import type { MetadataRoute } from "next";
import { absoluteUrl, crawlers } from "@/lib/site";

// Policy comes from content/seo/crawlers.json (owner-editable via BusinessOS).
export default function robots(): MetadataRoute.Robots {
  const disallow = crawlers.disallowPaths;
  const rules = [
    crawlers.default ? { userAgent: "*", allow: "/", disallow } : { userAgent: "*", disallow: "/" },
    ...Object.entries(crawlers.bots).map(([userAgent, allowed]) =>
      allowed ? { userAgent, allow: "/", disallow } : { userAgent, disallow: "/" },
    ),
  ];
  return { rules, sitemap: absoluteUrl("/sitemap.xml") };
}
