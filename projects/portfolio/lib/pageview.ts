import type { PostHog } from "posthog-js";

const initialized = new WeakSet<PostHog>();

export function withoutUrlDetails(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

export function pageviewProperties(properties: Record<string, unknown>) {
  const clean = { ...properties };
  for (const [key, value] of Object.entries(clean)) {
    if (/^(\$initial_)?utm_|^utm_|^\$?(initial_)?(search_keyword|search_engine)|^\$?(initial_)?(gclid|fbclid|msclkid)/.test(key)) {
      delete clean[key];
    } else if (/url|referrer/i.test(key) && typeof value === "string") {
      clean[key] = withoutUrlDetails(value);
    }
  }
  return clean;
}

// Memory persistence avoids browser storage. It does not establish a legal basis
// for analytics: the owner must review privacy/consent policy before enabling keys.
export function recordPageview(client: PostHog, key: string | undefined, host: string, origin: string, pathname: string) {
  if (!key) return;
  if (!initialized.has(client)) {
    client.init(key, {
      api_host: host,
      persistence: "memory",
      person_profiles: "never",
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      disable_session_recording: true,
      advanced_disable_flags: true,
      before_send: (event) => event ? { ...event, properties: pageviewProperties(event.properties) } : null,
    });
    initialized.add(client);
  }
  client.capture("$pageview", { $current_url: withoutUrlDetails(`${origin}${pathname}`) });
}
