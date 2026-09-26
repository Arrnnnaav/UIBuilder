import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function ExternalLink({ href, children, profile = false, className = "" }: { href: string; children: ReactNode; profile?: boolean; className?: string }) {
  return <a href={href} target="_blank" rel={`noopener noreferrer${profile ? " me" : ""}`} className={`text-link external-link ${className}`}>{children}<ArrowUpRight weight="regular" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>;
}
