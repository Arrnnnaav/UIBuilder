import { afterEach, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({ init: vi.fn(), captureRequestError: vi.fn() }));
vi.mock("@sentry/nextjs", () => sdk);
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); vi.resetModules(); });

it("server instrumentation does not initialize or send errors without a DSN", async () => {
  vi.stubEnv("SENTRY_DSN", "");
  const instrumentation = await import("../../instrumentation");
  await instrumentation.register();
  await instrumentation.onRequestError(new Error("test"), { path: "/", method: "GET", headers: {} }, { routerKind: "App Router", routePath: "/", routeType: "render", revalidateReason: undefined });
  expect(sdk.init).not.toHaveBeenCalled();
  expect(sdk.captureRequestError).not.toHaveBeenCalled();
});

it("server instrumentation initializes and forwards errors when explicitly configured", async () => {
  vi.stubEnv("SENTRY_DSN", "https://example@example.com/1");
  const instrumentation = await import("../../instrumentation");
  await instrumentation.register();
  const error = new Error("synthetic test");
  await instrumentation.onRequestError(error, { path: "/", method: "GET", headers: {} }, { routerKind: "App Router", routePath: "/", routeType: "render", revalidateReason: undefined });
  expect(sdk.init).toHaveBeenCalledWith({ dsn: "https://example@example.com/1", tracesSampleRate: 0 });
  expect(sdk.captureRequestError).toHaveBeenCalledWith(error, expect.any(Object), expect.any(Object));
});

it("client instrumentation does not initialize without its public DSN", async () => {
  vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "");
  await import("../../instrumentation-client");
  expect(sdk.init).not.toHaveBeenCalled();
});
