"use client";

import { useEffect } from "react";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24" role="alert">
      <h1 className="text-[length:var(--text-xl)] font-semibold">Something went wrong</h1>
      <p className="mt-4 text-muted">This section failed to load. Try again, or come back in a minute.</p>
      <button type="button" className="button mt-8" onClick={() => retry()}>
        Try again
      </button>
    </section>
  );
}
