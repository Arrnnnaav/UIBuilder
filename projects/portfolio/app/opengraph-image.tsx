import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours are inline because ImageResponse cannot read CSS variables. They mirror the light
// scheme in app/styles/tokens.css (DESIGN.md §Color): paper bg, ink fg, muted, and the single
// highlighter mark behind the headline measured result. lint:tokens allows this file.
const PAPER = "#f5f7f9";
const INK = "#131822";
const MUTED = "#505660";
const MARK = "#fae353";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: PAPER,
          color: INK,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2.6, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 34, marginTop: 24, color: MUTED, maxWidth: 900 }}>{site.description}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: `3px solid ${INK}`, paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 44, fontWeight: 600 }}>
            <span style={{ color: MUTED }}>5.356 s</span>
            <span style={{ margin: "0 20px" }}>→</span>
            <span style={{ background: MARK, padding: "0 10px" }}>0.973 s</span>
          </div>
          <div style={{ fontSize: 24, marginTop: 12, color: MUTED }}>
            Mean latency, Edge Node. n=50 requests, committed benchmark.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
