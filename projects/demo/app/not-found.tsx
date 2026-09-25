import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24">
      <h1 className="text-[length:var(--text-xl)] font-semibold">Page not found</h1>
      <p className="mt-4 text-muted">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="button mt-8">
        Back home
      </Link>
    </section>
  );
}
