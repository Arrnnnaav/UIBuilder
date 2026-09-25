"use client";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1rem", maxWidth: "40rem", margin: "0 auto" }}>
        <title>Something went wrong</title>
        <h1>Something went wrong</h1>
        <p>The site hit an unexpected error. Try again in a moment.</p>
        <button type="button" onClick={() => retry()}>
          Try again
        </button>
      </body>
    </html>
  );
}
