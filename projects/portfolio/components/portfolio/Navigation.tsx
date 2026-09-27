"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

export function Navigation({ name, github, externalIcon }: { name: string; github: string; externalIcon: ReactNode }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => { dialog.current?.close(); trigger.current?.focus(); };
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')].filter(element => element.getClientRects().length > 0);
    const first = elements[0], last = elements.at(-1);
    if (!first || !last) return;
    // WebKit can skip links during native Tab navigation. Move every Tab within
    // the modal explicitly so the cycle stays complete in both browser engines.
    const index = elements.indexOf(document.activeElement as HTMLElement);
    const next = index < 0 ? (event.shiftKey ? elements.length - 1 : 0)
      : (index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length;
    event.preventDefault();
    elements[next].focus();
  };
  useEffect(() => { const element = dialog.current; const onClose = () => { document.body.style.overflow = ""; trigger.current?.focus(); }; element?.addEventListener("close", onClose); return () => { element?.removeEventListener("close", onClose); document.body.style.overflow = ""; }; }, []);
  const current = (href: string) => pathname === href || (href === "/work" && pathname.startsWith("/work/"));
  const links = <><Link href="/work" aria-current={current("/work") ? "page" : undefined} onClick={close}>Work</Link><Link href="/about" aria-current={current("/about") ? "page" : undefined} onClick={close}>About</Link><a href={github} target="_blank" rel="me noopener noreferrer">GitHub {externalIcon}<span className="sr-only"> (opens in a new tab)</span></a></>;
  return <header className="site-header"><div className="container nav-bar"><Link href="/" prefetch={pathname === "/" ? false : null} className="wordmark">{name}</Link><nav className="desktop-nav" aria-label="Primary">{links}</nav><Link className="button nav-contact" href="/contact" aria-current={current("/contact") ? "page" : undefined}>Contact Arnav</Link><button ref={trigger} type="button" className="menu-button" aria-haspopup="dialog" onClick={() => { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }}>Menu</button></div><dialog ref={dialog} className="nav-dialog" aria-label="Main menu" onKeyDown={trapFocus} onCancel={close}><div className="container"><button type="button" className="menu-close text-link" onClick={close}>Close menu</button><nav aria-label="Mobile primary">{links}<Link href="/contact" onClick={close}>Contact Arnav</Link><Link href="/resume" onClick={close}>Résumé</Link></nav></div></dialog></header>;
}
