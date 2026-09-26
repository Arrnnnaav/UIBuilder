"use client";
import { useRef, type ReactNode } from "react";
export function WorkDock({ children, previews }: { children: ReactNode; previews: ReactNode[] }) {
 const root = useRef<HTMLDivElement>(null);
 const activate = (target: EventTarget | null) => { if (!(target instanceof Element)) return; const row = target.closest<HTMLElement>("[data-work-row]"), slot = root.current?.querySelector<HTMLElement>(".work-preview"); if (!row || !slot) return; slot.style.transform = `translateY(${row.offsetTop}px)`; slot.querySelectorAll<HTMLElement>("[data-preview]").forEach(p => { p.dataset.active = String(p.dataset.preview === row.dataset.workRow); }); };
 return <div ref={root} className="work-dock" onMouseOver={e => activate(e.target)} onFocus={e => activate(e.target)}><div className="work-rows">{children}</div><div className="work-preview" aria-hidden="true">{previews.map((p, i) => <div key={i} data-preview={i} data-active={i === 0}>{p}</div>)}</div></div>;
}
