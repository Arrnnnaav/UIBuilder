import { describe, expect, it } from "vitest";
import { selectJsonLd } from "@/lib/seo";

const files = {
  "person.json": { "@type": "Person" },
  "website.json": { "@type": "WebSite" },
  "home.json": { "@type": "WebPage" },
  "work.json": { "@type": "CollectionPage" },
  "work-edge-node.json": { "@type": "Article" },
  "work-edge-node-breadcrumb.json": { "@type": "BreadcrumbList" },
  "work-edge-node-software.json": { "@type": "SoftwareSourceCode" },
  "work-ledgerbridge.json": { "@type": "Article", name: "other project" },
};

describe("route JSON-LD scope", () => {
  it("emits only shared entities globally", () => {
    expect(selectJsonLd(files)).toEqual([files["person.json"], files["website.json"]]);
  });
  it("keeps other case studies and global entities out of a case page", () => {
    expect(selectJsonLd(files, "/work/edge-node")).toEqual([
      files["work-edge-node.json"], files["work-edge-node-breadcrumb.json"], files["work-edge-node-software.json"],
    ]);
  });
  it("does not leak work detail schemas into the work index", () => {
    expect(selectJsonLd(files, "/work")).toEqual([files["work.json"]]);
  });
  it("uses the explicit home filename and returns no schemas for unknown routes", () => {
    expect(selectJsonLd(files, "/")).toEqual([files["home.json"]]);
    expect(selectJsonLd(files, "/missing")).toEqual([]);
  });
});
