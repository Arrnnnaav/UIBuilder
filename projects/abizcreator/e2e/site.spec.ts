import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import routes from "../content/seo/routes.json" with { type: "json" };

const pages = Object.keys(routes);

// Fail any test that logs a console error or hits a hydration mismatch.
const watchConsole = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
};

for (const route of pages) {
  test.describe(`page ${route}`, () => {
    test("loads with metadata, one h1, no console errors", async ({ page }) => {
      const errors = watchConsole(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(routes[route as keyof typeof routes].title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await page.waitForLoadState("load");
      expect(errors).toEqual([]);
    });

    test("has no serious or critical axe violations", async ({ page }) => {
      // Reduced motion so axe sees final colours, not mid-fade opacity.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(blocking, JSON.stringify(blocking.map((v) => [v.id, v.nodes.length]))).toEqual([]);
    });

    test("matches the visual snapshot", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await page.waitForLoadState("load");
      await expect(page).toHaveScreenshot(`${route === "/" ? "home" : route.slice(1).replaceAll("/", "_")}.png`, {
        fullPage: true,
      });
    });
  });
}

test("primary nav reaches every linked page", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await nav.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await nav.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("skip link moves focus to main", async ({ page, browserName }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "Skip to content" });
  // Safari only tabs to links when "Press Tab to highlight each item" is on; focus directly there.
  if (browserName === "webkit") await skip.focus();
  else await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("contact page offers direct channels", async ({ page }) => {
  await page.goto("/contact");
  const channels = page.getByRole("list", { name: "Contact channels" });
  await expect(channels.getByRole("link", { name: /^Email:/ })).toHaveAttribute("href", /^mailto:/);
});

test("unknown route renders the 404 page", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("SEO files are served", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});
