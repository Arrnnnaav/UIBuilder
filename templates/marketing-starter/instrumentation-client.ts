// Client-side Sentry, loaded lazily and only when a DSN is configured.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({ dsn, tracesSampleRate: 0 });
  });
}
