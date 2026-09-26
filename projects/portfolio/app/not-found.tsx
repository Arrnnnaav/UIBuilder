import Link from "next/link";
import { portfolio } from "@/lib/portfolio";

export default function NotFound() {
  return (
    <section className="recovery">
      <h1>This page doesn’t exist</h1>
      <p>Choose a page below to continue exploring the work.</p>
      <nav aria-label="Recovery"><Link href="/">Home</Link><Link href="/work">Work</Link>{portfolio.projects.map(p => <Link key={p.slug} href={`/work/${p.slug}`}>{p.title} case study</Link>)}<Link href="/contact">Contact Arnav</Link></nav>
    </section>
  );
}
