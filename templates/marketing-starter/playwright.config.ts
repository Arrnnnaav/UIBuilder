import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);

// Runs against a production build (`next start`), never the dev server, so hydration
// and CSP behave as in production. Turnstile uses Cloudflare's always-pass test keys.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  // Baselines are per-OS (fonts render differently). CI seeds linux baselines with --update-snapshots=missing.
  snapshotPathTemplate: "{testDir}/__snapshots__/{platform}/{projectName}/{arg}{ext}",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
    { name: "webkit-mobile", use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    // Builds with the Turnstile always-pass test site key baked in, unless E2E_SKIP_BUILD=1.
    command: `${process.env.E2E_SKIP_BUILD === "1" ? "" : "pnpm build && "}pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      E2E_ERROR_ROUTE: "1",
      CONTACT_DRY_RUN: "1",
      RATE_LIMIT_PER_MINUTE: "100",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
    },
  },
});
