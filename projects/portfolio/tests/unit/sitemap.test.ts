import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { absoluteUrl, routes } from "@/lib/site";

describe("sitemap editorial dates and index policy", () => {
  it("uses each route's stored revision date without claiming fresh builds", () => {
    const entries = sitemap();
    for (const entry of entries) {
      const route = Object.keys(routes).find((path) => absoluteUrl(path) === entry.url)!;
      expect(entry.lastModified).toBe(routes[route].lastModified);
    }
    expect(entries.length).toBeGreaterThan(1);
  });

  it("excludes internal and error-test pages", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(absoluteUrl("/styleguide"));
    expect(urls).not.toContain(absoluteUrl("/e2e-error"));
    expect(urls).toContain(absoluteUrl("/work/edge-node"));
    expect(urls).toContain(absoluteUrl("/resume"));
  });
});
