"use client";

import Script from "next/script";
import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";
import type { ContactState } from "@/lib/contact-schema";

const initial: ContactState = { status: "idle" };

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const fieldError = (name: "name" | "email" | "message") =>
    state.status === "error" ? state.fieldErrors?.[name] : undefined;

  if (state.status === "success") {
    return (
      <p role="status" className="contact-success">
        Thanks — your message is in. You will hear back soon.
      </p>
    );
  }

  return (
    <form action={action} className="contact-form" noValidate>
      {(["name", "email"] as const).map((field) => (
        <div key={field} className="field">
          <label htmlFor={field}>{field === "name" ? "Name" : "Email"}</label>
          <input
            id={field}
            name={field}
            type={field === "email" ? "email" : "text"}
            autoComplete={field}
            required
            aria-invalid={Boolean(fieldError(field))}
            aria-describedby={fieldError(field) ? `${field}-error` : undefined}
          />
          {fieldError(field) && (
            <p id={`${field}-error`} className="field-error">
              {fieldError(field)}
            </p>
          )}
        </div>
      ))}
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(fieldError("message"))}
          aria-describedby={fieldError("message") ? "message-error" : undefined}
        />
        {fieldError("message") && (
          <p id="message-error" className="field-error">
            {fieldError("message")}
          </p>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {turnstileSiteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </>
      )}
      {state.status === "error" && (
        <p role="alert" className="form-error">
          {state.message}
        </p>
      )}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
