import { describe, expect, it } from "vitest";
import { performanceRoutes, passesLcpGate } from "../../scripts/perf-routes.mjs";

describe("performance route coverage", () => {
  it("includes every public route even when robots marks it noindex", () => {
    const routes = {
      "/": { robots: "index,follow" },
      "/contact": { robots: "index,follow" },
      "/styleguide": { robots: "noindex,nofollow" },
      "/e2e-error": { robots: "noindex,nofollow" },
    };

    expect(performanceRoutes(routes)).toEqual(["/", "/contact", "/styleguide"]);
  });

  it("requires LCP strictly below 2500ms", () => {
    expect(passesLcpGate(2499)).toBe(true);
    expect(passesLcpGate(2500)).toBe(false);
    expect(passesLcpGate(Number.NaN)).toBe(false);
  });
});
