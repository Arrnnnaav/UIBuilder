import type { NextConfig } from "next";

// Frontend-only static export (DECISIONS D14): no server, no server actions.
// Security headers can't come from next.config in export mode; they live in
// public/_headers, which Cloudflare Workers static assets apply at the edge.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
  typedRoutes: true,
  // No image-optimisation server in a static export. Ship pre-sized AVIF/WebP from public/.
  images: { unoptimized: true },
  // NEXT_BUILD_CPUS caps build workers on memory-constrained machines (Windows dev boxes).
  ...(process.env.NEXT_BUILD_CPUS ? { experimental: { cpus: Number(process.env.NEXT_BUILD_CPUS) } } : {}),
};

export default nextConfig;
