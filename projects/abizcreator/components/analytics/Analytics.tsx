"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { clientEnv } from "@/lib/env";

let started = false;

// Cookieless PostHog: memory persistence means no cookies or localStorage, so no consent
// banner is needed for basic pageview analytics. No key → renders nothing.
export function Analytics() {
  const pathname = usePathname();
  const key = clientEnv.NEXT_PUBLIC_POSTHOG_KEY;

  useEffect(() => {
    if (!key) return;
    if (!started) {
      posthog.init(key, {
        api_host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
        persistence: "memory",
        person_profiles: "identified_only",
        capture_pageview: false,
        autocapture: false,
      });
      started = true;
    }
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [key, pathname]);

  return null;
}
