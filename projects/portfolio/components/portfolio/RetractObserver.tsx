"use client";
import { useEffect } from "react";
export function RetractObserver({ id }: { id: string }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = document.getElementById(id)?.querySelectorAll<HTMLElement>("[data-retract]");
    if (!rows?.length) return;
    const frames: number[] = [];
    const release = (row: HTMLElement) => { frames.push(requestAnimationFrame(() => { frames.push(requestAnimationFrame(() => row.removeAttribute("data-armed"))); })); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          release(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.5 });
    rows.forEach(row => row.setAttribute("data-armed", ""));
    rows.forEach(row => observer.observe(row));
    return () => { observer.disconnect(); frames.forEach(cancelAnimationFrame); rows.forEach(row => row.removeAttribute("data-armed")); };
  }, [id]);
  return null;
}
