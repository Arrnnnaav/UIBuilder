import type { CSSProperties } from "react";
import Link from "next/link";
import { evidenceFor, metricChange, metricValue, type Evidence, type Metric } from "@/lib/portfolio";
import { ExternalLink } from "./ExternalLink";
import { RetractObserver } from "./RetractObserver";

export type LedgerRow = { metric: Metric; evidence: Evidence; title?: string; slug?: string };
export function comparisonStyle(metric: Metric, index = 0): CSSProperties {
  return { "--ratio": metric.before ? Number(((metric.after ?? 0) / metric.before).toFixed(4)) : 1, "--i": index } as CSSProperties;
}
export function Bars({ metric }: { metric: Metric }) {
  return <div className="retract-bars" aria-hidden="true"><span className="before-bar" /><span className="after-bar" style={comparisonStyle(metric)} /></div>;
}
export function HeroSpecimen() {
  const evidence = evidenceFor("edge-node");
  const metric = evidence.metrics.find(item => item.kind === "comparison");
  if (!metric) return null;
  const source = evidence.sources.find(item => item.id === metric.source)!;
  const sample = evidence.metrics.find(item => item.label === "Latency requests");
  return (
    <aside id="hero-specimen" className="hero-specimen" aria-label="Edge Node measured result">
      <div data-retract style={comparisonStyle(metric)}>
        <Link href="/work/edge-node" className="text-link">Edge Node. {metric.label}</Link>
        <div className="hero-values"><span>{metricValue(metric, "before")}</span><span aria-hidden="true">→</span><strong className="mark resting-mark">{metricValue(metric)}</strong></div>
        <Bars metric={metric} />
        <p className="specimen-change">{metricChange(metric)} faster</p>
        <p className="caption">{metric.caveat ?? (sample ? `n = ${sample.value} latency requests. ${sample.caveat ?? ""}` : "n not reported")}</p>
        <ExternalLink href={source.url}>{source.title}</ExternalLink>
      </div>
      <RetractObserver id="hero-specimen" />
    </aside>
  );
}
export function Ledger({ rows, id, caption, headline = false }: { rows: LedgerRow[]; id: string; caption: string; headline?: boolean }) {
  const visible = rows.filter(row => row.metric.status === "verified");
  if (!visible.length) return null;
  const citationIds = [...new Set(visible.map(row => row.metric.source))];
  const citationRules = citationIds.map(n => `.case:has([data-cite="${n}"]:is(:hover,:focus-visible,:focus-within,:target)) .mark[data-cite="${n}"]::before{transform:scaleX(1) skewX(-4deg)}.case:has([data-cite="${n}"]:is(:hover,:focus-visible,:focus-within,:target)) .mark[data-cite="${n}"]{color:var(--color-accent-fg)}`).join("");
  return (
    <div id={id} className="ledger">
      {headline && <style>{citationRules}</style>}
      <table>
        <caption>{caption}</caption>
        <thead><tr><th scope="col">Metric</th><th scope="col">Before</th><th scope="col">After / value</th><th scope="col">Change</th><th scope="col">Method / caveat</th><th scope="col">Source</th></tr></thead>
        <tbody>
          {visible.map(({ metric, evidence, title, slug }, index) => {
            const source = evidence.sources.find(item => item.id === metric.source)!;
            const sourceType = source.url.toLowerCase().includes("benchmark_report") ? "Committed benchmark" : "README";
            return (
              <tr key={`${evidence.project}-${metric.label}`} data-cite={metric.source} data-retract={metric.kind === "comparison" ? "" : undefined} style={comparisonStyle(metric, index)}>
                <th scope="row">{slug ? <Link href={`/work/${slug}`}>{title}<span>{metric.label}</span></Link> : metric.label}</th>
                <td data-label="Before" className="before-value">{metric.kind === "comparison" ? metricValue(metric, "before") : "Not applicable"}</td>
                <td data-label={metric.kind === "fact" ? "Fact" : "After / value"} className={`after-value ${metric.kind === "fact" ? "fact-value" : ""}`}>
                  <span className={`mark ${headline && index === 0 ? "resting-mark" : ""}`} data-cite={metric.source}>{metricValue(metric)}</span>
                  {headline && <a className="citation mark" data-cite={metric.source} href={`#source-${metric.source}`} aria-label={`Source ${metric.source}: ${source.title}, ${sourceType}`}>[{metric.source}]</a>}
                  {metric.kind === "comparison" && <Bars metric={metric} />}
                </td>
                <td data-label="Change">{metricChange(metric) || "Not applicable"}</td>
                <td data-label="Method / caveat" className="caption">{metric.caveat ?? "n not reported"}</td>
                <td data-label="Source"><span className="source-type caption">{sourceType}</span><ExternalLink href={source.url}>{source.title}</ExternalLink></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="ledger-legend caption">Committed benchmarks are inspectable reports. README results are project reports, with their original caveats.</p>
      <RetractObserver id={id} />
    </div>
  );
}
