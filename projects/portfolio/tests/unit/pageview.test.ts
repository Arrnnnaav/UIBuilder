import { expect, it, vi } from "vitest";
import type { PostHog } from "posthog-js";
import { recordPageview, pageviewProperties } from "@/lib/pageview";

function fakeClient() {
  return { init: vi.fn(), capture: vi.fn() } as unknown as PostHog;
}

it("does not initialize the SDK or capture pageviews without a key", () => {
  const client = fakeClient();
  recordPageview(client, undefined, "https://us.i.posthog.com", "https://example.com", "/contact");
  expect(client.init).not.toHaveBeenCalled();
  expect(client.capture).not.toHaveBeenCalled();
});

it("initializes once and sends only origin/path without query or hash", () => {
  const client = fakeClient();
  recordPageview(client, "key", "https://us.i.posthog.com", "https://example.com", "/contact?email=private#token");
  recordPageview(client, "key", "https://us.i.posthog.com", "https://example.com", "/work");
  expect(client.init).toHaveBeenCalledTimes(1);
  expect(client.init).toHaveBeenCalledWith("key", expect.objectContaining({ persistence: "memory", person_profiles: "never", disable_session_recording: true, autocapture: false }));
  expect(client.capture).toHaveBeenNthCalledWith(1, "$pageview", { $current_url: "https://example.com/contact" });
});

it("strips URL details and campaign/search values from automatically added properties", () => {
  expect(pageviewProperties({ $current_url: "https://example.com/contact?email=secret#token", $initial_current_url: "https://example.com/?utm_source=private", $referrer: "https://elsewhere.com/?token=private", utm_campaign: "private", $initial_utm_source: "private", $search_keyword: "private", $pathname: "/contact" })).toEqual({ $current_url: "https://example.com/contact", $initial_current_url: "https://example.com/", $referrer: "https://elsewhere.com/", $pathname: "/contact" });
});
