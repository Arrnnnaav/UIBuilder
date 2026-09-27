"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FooterAction() {
  const contact = usePathname() === "/contact";
  return <Link className="footer-cta" href={contact ? "/work" : "/contact"}>{contact ? "See the work" : "Contact Arnav"}</Link>;
}
