import { site } from "@/lib/site";

// Frontend-only contact (DECISIONS D14): direct channels instead of a form backend.
// Every channel comes from content/site.json; missing ones are simply not rendered.
export function ContactChannels() {
  const { phone, whatsapp, address, hours } = site.contact ?? {};
  const waText = encodeURIComponent(`Hi ${site.shortName}, I'd like to discuss a project.`);
  const channels = [
    whatsapp && { label: "WhatsApp", value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waText}` },
    phone && { label: "Call", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <div className="grid gap-8">
      <ul className="grid gap-4" aria-label="Contact channels">
        {channels.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              className="button"
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {c.label}: {c.value}
            </a>
          </li>
        ))}
      </ul>
      {(address || hours) && (
        <address className="not-italic text-muted">
          {address && <p>{address}</p>}
          {hours && <p>{hours}</p>}
        </address>
      )}
    </div>
  );
}
