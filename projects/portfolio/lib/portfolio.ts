import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Metric = { label: string; kind: "comparison" | "value" | "fact"; before?: number; after?: number; value?: string; unit?: string; source: number; status: "verified" | "pending-source"; caveat?: string };
export type Evidence = { project: string; sources: { id: number; title: string; url: string }[]; metrics: Metric[] };
export type Project = { slug: string; title: string; descriptor: string; year: string; role: string; repo: string; stack: string[]; summary: string; problem: string; approach: string[]; result: string; limits: string[]; figure: { type: "bars" | "flow" | "records"; title: string; caption: string; steps?: string[] } };
export type Portfolio = { name: string; role: string; positioning: string; bio: string[]; location: string | null; email: string | null; github: string; linkedin: string | null; resumePath: string; education: { institution: string; degree: string; period: string }; timeline: { period: string; title: string; description: string; href?: string }[]; skills: { group: string; items: string[] }[]; achievements: string[]; moreWork: { label: string; items: { name: string; url: string; description: string }[] }[]; projects: Project[] };

export const portfolio: Portfolio = JSON.parse(readFileSync(join(process.cwd(), "content/portfolio.json"), "utf8"));
export function evidenceFor(slug: string): Evidence {
  const evidence: Evidence = JSON.parse(readFileSync(join(process.cwd(), "content/evidence", `${slug}.json`), "utf8"));
  return { ...evidence, metrics: evidence.metrics.filter((metric) => metric.status === "verified") };
}
export function metricValue(metric: Metric, side: "before" | "after" = "after") {
  if (metric.kind !== "comparison") return `${metric.value ?? ""}${metric.unit ? `\u00a0${metric.unit}` : ""}`;
  return `${metric[side]}${metric.unit ? `\u00a0${metric.unit}` : ""}`;
}
export function metricChange(metric: Metric) {
  if (metric.before === undefined || metric.after === undefined || metric.before <= 0 || metric.after <= 0) return "";
  const reduction = Math.round((1 - metric.after / metric.before) * 100);
  return `${reduction >= 0 ? "−" : "+"}${Math.abs(reduction)}%, ${(metric.before / metric.after).toFixed(1)}×`;
}
