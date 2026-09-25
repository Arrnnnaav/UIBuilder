"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactInput, type ContactState } from "@/lib/contact-schema";
import { serverEnv } from "@/lib/env";
import { createRateLimiter } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { site } from "@/lib/site";

const limiter = createRateLimiter({ limit: serverEnv().RATE_LIMIT_PER_MINUTE, windowMs: 60_000 });

const clientIp = (h: Headers) =>
  h.get("cf-connecting-ip") ?? h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const env = serverEnv();
  const isProd = env.NODE_ENV === "production";
  const ip = clientIp(await headers());

  if (!limiter(ip).ok) {
    return { status: "error", message: "Too many messages. Try again in a minute." };
  }

  const parsed = contactInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
  });
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]));
    return { status: "error", message: "Check the highlighted fields.", fieldErrors };
  }
  // Honeypot filled: pretend success so bots learn nothing.
  if (parsed.data.company) return { status: "success" };

  const human = await verifyTurnstile(formData.get("cf-turnstile-response")?.toString() ?? null, {
    secret: env.TURNSTILE_SECRET_KEY,
    ip,
    isProd,
  });
  if (!human) {
    return { status: "error", message: "Verification failed. Refresh and try again." };
  }

  if (env.CONTACT_DRY_RUN === "1") {
    console.info("[contact] CONTACT_DRY_RUN=1; message accepted, not sent");
    return { status: "success" };
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    if (isProd) return { status: "error", message: `Email is not configured. Write to ${site.email} instead.` };
    console.info("[contact] RESEND_API_KEY not set; message accepted but not sent");
    return { status: "success" };
  }

  const { name, email, message } = parsed.data;
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
    return { status: "error", message: `Could not send right now. Write to ${site.email} instead.` };
  }
  return { status: "success" };
}
