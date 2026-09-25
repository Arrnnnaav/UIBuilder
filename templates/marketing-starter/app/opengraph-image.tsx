import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours are inline because ImageResponse cannot read CSS variables. Design-director
// updates these alongside tokens.css (lint:tokens allows this file).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#141413",
          color: "#f5f5f4",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>{site.name}</div>
        <div style={{ fontSize: 34, marginTop: 20, opacity: 0.75 }}>{site.description}</div>
      </div>
    ),
    size,
  );
}
