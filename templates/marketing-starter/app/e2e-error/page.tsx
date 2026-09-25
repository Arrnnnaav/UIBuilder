import { notFound } from "next/navigation";

// Test-only route that proves the error boundary renders. 404 unless E2E_ERROR_ROUTE=1.
export const dynamic = "force-dynamic";

export default function E2EError() {
  if (process.env.E2E_ERROR_ROUTE !== "1") notFound();
  throw new Error("E2E: intentional render error");
}
