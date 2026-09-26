"use client";

import Script from "next/script";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { submitContact } from "@/app/actions/contact";
import type { ContactState } from "@/lib/contact-schema";

const initial: ContactState = { status: "idle" };

export function ContactForm({ turnstileSiteKey, github }: { turnstileSiteKey?: string; github?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  useEffect(() => {
    if (state.status === "success") success.current?.focus();
    if (state.status === "error" && state.fieldErrors) {
      const first = ["name", "email", "message"].find(name => state.fieldErrors?.[name as "name" | "email" | "message"]);
      if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state]);
  const fieldError = (name: "name" | "email" | "message") =>
    state.status === "error" ? state.fieldErrors?.[name] : undefined;

  if (state.status === "success") {
    return (
      <div role="status" className="contact-success"><h2 ref={success} tabIndex={-1}><CheckCircle aria-hidden="true" />Message sent.</h2><p>Arnav will reply by email.</p><Link href="/work" className="text-link">See the work</Link>{github && <p><a href={github} className="text-link" target="_blank" rel="me noopener noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a></p>}</div>
    );
  }

  return (
    <form ref={form} action={action} className="contact-form" data-server-error={state.status === "error" && !state.fieldErrors ? "true" : undefined} aria-busy={pending} noValidate>
      {(["name", "email"] as const).map((field) => (
        <div key={field} className="field">
          <label htmlFor={field}>{field === "name" ? "Name" : "Email"}</label>
          <input
            id={field}
            name={field}
            type={field === "email" ? "email" : "text"}
            autoComplete={field}
            required
            value={values[field]}
            onChange={event => setValues(previous => ({ ...previous, [field]: event.target.value }))}
            readOnly={pending}
            spellCheck={field !== "email"}
            inputMode={field === "email" ? "email" : "text"}
            aria-invalid={Boolean(fieldError(field))}
            aria-describedby={fieldError(field) ? `${field}-error` : undefined}
          />
          {fieldError(field) && (
            <p id={`${field}-error`} className="field-error">
              <WarningCircle aria-hidden="true" />{fieldError(field)}
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
          value={values.message}
          onChange={event => setValues(previous => ({ ...previous, message: event.target.value }))}
          readOnly={pending}
          placeholder="What are you building or hiring for?…"
          aria-invalid={Boolean(fieldError("message"))}
          aria-describedby={fieldError("message") ? "message-error" : undefined}
        />
        {fieldError("message") && (
          <p id="message-error" className="field-error">
            <WarningCircle aria-hidden="true" />{fieldError("message")}
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
          <div className="turnstile-slot"><div className="cf-turnstile" data-sitekey={turnstileSiteKey} /></div>
        </>
      )}
      {state.status === "error" && (
        <p role="alert" className="form-error">
          <WarningCircle aria-hidden="true" />{state.message}
        </p>
      )}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
