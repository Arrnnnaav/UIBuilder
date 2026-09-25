import { describe, expect, it } from "vitest";
import { indexableRoutes, metadataFor } from "@/lib/seo";
import { faqs, routes, schemas } from "@/lib/site";
import { routeMeta } from "@/lib/content-schemas";

describe("SEO contract", () => {
  it("builds metadata for every route in routes.json", () => {
    for (const route of Object.keys(routes)) {
      const meta = metadataFor(route);
      expect(meta.title).toBe(routes[route].title);
      expect(meta.alternates?.canonical).toBe(routes[route].canonical);
    }
  });

  it("throws for a route missing from routes.json", () => {
    expect(() => metadataFor("/does-not-exist")).toThrow(/routes\.json/);
  });

  it("excludes noindex routes from the sitemap", () => {
    expect(indexableRoutes()).not.toContain("/styleguide");
    expect(indexableRoutes()).toContain("/");
  });

  it("rejects out-of-range meta", () => {
    expect(routeMeta.safeParse({ title: "short", description: "x", canonical: "/", robots: "index,follow" }).success).toBe(false);
  });

  it("has valid JSON-LD and FAQ files", () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
    for (const faq of faqs) expect(routes[faq.route]).toBeDefined();
  });
});
