import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import routes from "../content/seo/routes.json" with { type: "json" };

// The deliberate throwing route has its own recovery test below.
const pages = Object.keys(routes).filter((route) => route !== "/e2e-error");

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
      if (await page.locator(".cf-turnstile").count()) {
        await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 20_000 });
      }
      await expect(page).toHaveScreenshot(`${route === "/" ? "home" : route.slice(1).replaceAll("/", "_")}.png`, {
        fullPage: true,
        // The long styleguide needs two stable captures; WebKit can exceed 5s.
        timeout: 20_000,
        // Third-party widgets render differently per run; mask them.
        mask: [page.locator(".cf-turnstile")],
      });
    });
  });
}

test("primary nav reaches every linked page", async ({ page }) => {
  await page.goto("/");
  const mobile = (page.viewportSize()?.width ?? 1440) < 1024;
  for (const [label, path] of [["Work", "/work"], ["About", "/about"]]) {
    if (mobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
    const nav = page.getByRole("navigation", { name: mobile ? "Mobile primary" : "Primary", exact: true });
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    if (mobile) await expect(page.getByRole("dialog")).not.toBeVisible();
  }
  await page.locator("header").getByRole("link", { name: "Contact Arnav", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.locator("header").getByRole("link", { name: "Arnav Khandelwal", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("mobile menu contains keyboard focus and restores it on Escape", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 1024, "Desktop has no overlay menu");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.focus();
  await menu.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Main menu" });
  await expect(dialog).toBeVisible();
  const first = dialog.getByRole("button", { name: "Close menu" });
  const last = dialog.getByRole("link", { name: "Résumé", exact: true });
  await first.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(menu).toBeFocused();
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
  await expect(page.locator("main")).toBeFocused();
});

test("contact form validates then submits", async ({ page }) => {
  await page.goto("/contact");
  const token = page.locator('input[name="cf-turnstile-response"]');
  // Turnstile loads after hydration; its token proves the form is interactive.
  await expect(token).toHaveValue(/.+/, { timeout: 20_000 });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Check the highlighted fields" })).toBeVisible();
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Message").fill("I would like to talk about a new website project.");
  await expect(token).toHaveValue(/.+/, { timeout: 20_000 });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Message sent");
});

test("unknown route renders the 404 page", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /This page doesn.t exist/ })).toBeVisible();
  await page.getByRole("navigation", { name: "Recovery" }).getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
});

test("render error shows the error boundary", async ({ page }) => {
  await page.goto("/e2e-error");
  await expect(page.getByRole("heading", { name: "Something broke on this page" })).toBeVisible();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Something broke on this page" })).toBeVisible();
  await page.getByRole("navigation", { name: "Recovery" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("case studies preserve source precision and hide pending claims", async ({ page }) => {
  await page.goto("/work/edge-node");
  await expect(page.locator("#edge-node-ledger")).toContainText("5.356");
  await expect(page.locator("#edge-node-ledger")).toContainText("0.973");
  await page.locator("#edge-node-ledger").getByRole("link", { name: /^Source 1:/ }).first().click();
  await expect(page).toHaveURL(/#source-1$/);
  await expect(page.locator("#source-1 a").first()).toHaveAttribute("href", /\/blob\/[a-f0-9]{40}\//);
  await page.goto("/work/cited-researcher");
  await expect(page.locator("#cited-researcher-ledger")).not.toContainText("Five-worker execution time");
  await expect(page.locator("#cited-researcher-ledger")).not.toContainText("152");
});

test("reduced motion renders final evidence without a pending retract", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const bar = page.locator("#hero-specimen .after-bar");
  await expect(bar).toBeVisible();
  await expect(page.locator("#hero-specimen [data-armed]")).toHaveCount(0);
  const duration = await bar.evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration.split(",").every((value) => parseFloat(value) <= 0.01)).toBe(true);
});

test("resume download resolves to a PDF", async ({ page, request }) => {
  await page.goto("/resume");
  const link = page.locator('main a[href$=".pdf"]').first();
  const href = await link.getAttribute("href");
  expect(href).toBeTruthy();
  const response = await request.get(href!);
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
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
