import { isIP } from "node:net";

// Vercel overwrites these headers. Never prefer a caller-supplied Cloudflare header
// on Vercel. Other hosting needs an explicit adapter for its trusted proxy.
export function contactClientIp(headers: Pick<Headers, "get">, vercel = process.env.VERCEL === "1") {
  if (!vercel) return "unknown";
  const candidate = (headers.get("x-vercel-forwarded-for") ?? headers.get("x-forwarded-for"))?.trim();
  return candidate && isIP(candidate) ? candidate : "unknown";
}
