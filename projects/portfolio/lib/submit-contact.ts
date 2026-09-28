import { Resend } from "resend";
import { contactInput, type ContactState } from "@/lib/contact-schema";
import { serverEnv } from "@/lib/env";
import { createRateLimiter } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { site } from "@/lib/site";
import { contactClientIp } from "@/lib/client-ip";

export interface ContactSubmissionResult {
  state: ContactState;
  statusCode: number;
  retryAfter?: number;
}

const limiter = createRateLimiter({ limit: serverEnv().RATE_LIMIT_PER_MINUTE, windowMs: 60_000 });

const failure = (message: string, statusCode: number, fieldErrors?: Partial<Record<string, string>>): ContactSubmissionResult => ({
  state: { status: "error", message, ...(fieldErrors ? { fieldErrors } : {}) },
  statusCode,
});

export async function processContactSubmission(
  formData: FormData,
  requestHeaders: Pick<Headers, "get">,
): Promise<ContactSubmissionResult> {
  const env = serverEnv();
  const now = Date.now();
  const ip = contactClientIp(requestHeaders);
  const rate = limiter(ip, now);
  if (!rate.ok) {
    return {
      ...failure("Too many messages. Try again in a minute.", 429),
      retryAfter: Math.max(1, Math.ceil((rate.resetAt - now) / 1000)),
    };
  }

  const parsed = contactInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message]));
    return failure("Check the highlighted fields.", 200, fieldErrors);
  }

  const human = await verifyTurnstile(formData.get("cf-turnstile-response")?.toString() ?? null, {
    secret: env.TURNSTILE_SECRET_KEY,
    ip: ip === "unknown" ? undefined : ip,
    isProd: env.NODE_ENV === "production",
  });
  if (!human) return failure("Verification failed. Refresh and try again.", 200);

  if (env.CONTACT_DRY_RUN === "1") {
    console.info("[contact] CONTACT_DRY_RUN=1; message accepted, not sent");
    return { state: { status: "success" }, statusCode: 200 };
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    if (env.NODE_ENV === "production") {
      return failure(`Email is not configured. Write to ${site.email} instead.`, 503);
    }
    console.info("[contact] RESEND_API_KEY not set; message accepted but not sent");
    return { state: { status: "success" }, statusCode: 200 };
  }

  const { name, email, message } = parsed.data;
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL ?? `${site.shortName} <onboarding@resend.dev>`,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    if (error) {
      console.error("[contact] resend failed", error.name);
      return failure(`Could not send right now. Write to ${site.email} instead.`, 502);
    }
  } catch (error) {
    console.error("[contact] resend failed", error instanceof Error ? error.name : "unknown");
    return failure(`Could not send right now. Write to ${site.email} instead.`, 502);
  }
  return { state: { status: "success" }, statusCode: 200 };
}
