"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageview } from "@/lib/pageview";

// Optional analytics; no key means no initialization or captured events.
export function Analytics({ analyticsKey, analyticsHost }: { analyticsKey?: string; analyticsHost: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!analyticsKey) return;
    let cancelled = false;
    void import("posthog-js").then(({ default: posthog }) => {
      if (!cancelled) recordPageview(posthog, analyticsKey, analyticsHost, window.location.origin, pathname);
    });
    return () => { cancelled = true; };
  }, [analyticsKey, analyticsHost, pathname]);

  return null;
}
