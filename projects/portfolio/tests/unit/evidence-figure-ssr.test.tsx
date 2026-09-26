import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EvidenceFigure } from "@/components/portfolio/EvidenceFigure";
import { portfolio } from "@/lib/portfolio";

describe("evidence figure SSR accessibility", () => {
  it("renders both Edge Node SVG title labels as nonempty text in server HTML", () => {
    const project = portfolio.projects.find(item => item.slug === "edge-node")!;
    const markup = renderToStaticMarkup(createElement(EvidenceFigure, { project }));
    const titles = [...markup.matchAll(/<title id="([^"]+)">([^<]*)<\/title>/g)];
    expect(titles).toHaveLength(2);
    const expected = [
      `${project.figure.title}. Linear scale. Hatched bars are before; solid bars are after.`,
      `${project.figure.title}. Linear scale. Hatched columns are before; solid columns are after.`,
    ];
    titles.forEach(([ , id, text], index) => {
      expect(text).toBe(expected[index]);
      expect(markup).toContain(`aria-labelledby="${id}"`);
    });
  });
});
