"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="recovery" role="alert">
      <h1>Something broke on this page</h1>
      <p>This page could not load. Retry, or use the links below.</p>
      <button type="button" className="button mt-8" onClick={() => retry()}>
        Retry
      </button>
      <nav aria-label="Recovery"><Link href="/">Home</Link><Link href="/work">Work</Link><Link href="/contact">Contact Arnav</Link></nav>
    </section>
  );
}
