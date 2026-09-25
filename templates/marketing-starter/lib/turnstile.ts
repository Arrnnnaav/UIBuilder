const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Returns true when the token is valid. With no secret configured, verification is
// skipped outside production so local dev and CI work without an account.
export async function verifyTurnstile(
  token: string | null,
  { secret, ip, isProd, fetchImpl = fetch }: { secret?: string; ip?: string; isProd: boolean; fetchImpl?: typeof fetch },
) {
  if (!secret) return !isProd;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetchImpl(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
