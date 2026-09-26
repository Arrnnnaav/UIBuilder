import Link from "next/link";
import type { ReactNode } from "react";
export function Intro({ title, children, work = false }: { title: string; children?: ReactNode; work?: boolean }) {
  return <><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li>{work && <li><span aria-hidden="true">/</span><Link href="/work">Work</Link></li>}<li><span aria-hidden="true">/</span><span aria-current="page">{title}</span></li></ol></nav><header className="page-intro"><h1>{title}</h1>{children && <div className="lede">{children}</div>}</header></>;
}
