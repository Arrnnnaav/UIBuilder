import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import routes from "../content/seo/routes.json" with { type: "json" };

const pages = Object.keys(routes).filter((route) => route !== "/e2e-error");

test.setTimeout(120_000);

test("all public routes meet axe text contrast checks in light and dark themes", async ({ page }, testInfo) => {
  const results = [];
  for (const route of pages) {
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme });
      await page.goto(route);
      const { violations, incomplete, passes } = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();
      const tokenContrast = await page.evaluate(() => {
        const color = (property: "color" | "backgroundColor", token: string) => {
          const probe = document.createElement("span");
          probe.style[property] = `var(${token})`;
          document.body.append(probe);
          const value = getComputedStyle(probe)[property];
          probe.remove();
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Canvas 2D context unavailable");
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3), (channel) => channel / 255);
        };
        const luminance = (rgb: number[]) => {
          const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
          return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        };
        const ratio = (foreground: string, background: string) => {
          const a = luminance(color("color", foreground));
          const b = luminance(color("backgroundColor", background));
          return Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2));
        };
        return {
          text: {
            foregroundOnPage: ratio("--color-fg", "--color-bg"),
            mutedOnPage: ratio("--color-muted", "--color-bg"),
            foregroundOnSurface: ratio("--color-fg", "--color-surface"),
            mutedOnSurface: ratio("--color-muted", "--color-surface"),
            accentForegroundOnAccent: ratio("--color-accent-fg", "--color-accent"),
            dangerOnPage: ratio("--color-danger", "--color-bg"),
            successOnPage: ratio("--color-success", "--color-bg"),
          },
          nonText: {
            borderOnPage: ratio("--color-border", "--color-bg"),
            borderOnSurface: ratio("--color-border", "--color-surface"),
          },
        };
      });
      results.push({
        route,
        colorScheme,
        passedNodes: passes.flatMap((rule) => rule.nodes).length,
        tokenContrast,
        violations: violations.map((rule) => ({
          id: rule.id,
          impact: rule.impact,
          nodes: rule.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
        })),
        incomplete: incomplete.map((rule) => ({
          id: rule.id,
          nodes: rule.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
        })),
      });
      expect(violations, `${route} (${colorScheme})`).toEqual([]);
      expect(Object.values(tokenContrast.text).every((ratio) => ratio >= 4.5), `${route} (${colorScheme}) token text contrast: ${JSON.stringify(tokenContrast)}`).toBe(true);
      expect(Object.values(tokenContrast.nonText).every((ratio) => ratio >= 3), `${route} (${colorScheme}) token border contrast`).toBe(true);
    }
  }

  if (process.env.CONTRAST_EVIDENCE === "1") {
    const evidence = {
      reviewedAt: new Date().toISOString(),
      browser: testInfo.project.name,
      viewport: testInfo.project.use.viewport,
      routes: pages.length,
      colorSchemes: ["light", "dark"],
      results,
    };
    const evidenceDir = join(process.cwd(), "docs/evidence");
    mkdirSync(evidenceDir, { recursive: true });
    writeFileSync(join(evidenceDir, `contrast-audit-${testInfo.project.name}.json`), JSON.stringify(evidence, null, 2));
  }
});
