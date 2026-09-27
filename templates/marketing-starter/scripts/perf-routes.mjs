// G3 measures every route in the SEO registry. Indexing policy does not change
// whether a rendered route needs browser/performance coverage.
export function performanceRoutes(routes) {
  return Object.keys(routes).filter((route) => route !== "/e2e-error");
}

export function passesLcpGate(lcp) {
  return Number.isFinite(lcp) && lcp < 2500;
}
