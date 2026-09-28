import { processContactSubmission } from "@/lib/submit-contact";

const MAX_BODY_BYTES = 32 * 1024;

function jsonError(status: number, message: string) {
  return Response.json(
    { status: "error", message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readBodyWithinLimit(request: Request): Promise<ArrayBuffer | null> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return null;
  if (!request.body) return new ArrayBuffer(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const arrayBuffer = new ArrayBuffer(body.byteLength);
  new Uint8Array(arrayBuffer).set(body);
  return arrayBuffer;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError(403, "Request origin is not allowed.");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) {
    return jsonError(415, "Submit the contact form to send a message.");
  }

  let body: ArrayBuffer | null;
  try {
    body = await readBodyWithinLimit(request);
  } catch {
    return jsonError(400, "Check the submitted fields and try again.");
  }
  if (!body) return jsonError(413, "Message is too large.");

  let formData: FormData;
  try {
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    formData = await new Request(request.url, { method: "POST", headers, body }).formData();
  } catch {
    return jsonError(400, "Check the submitted fields and try again.");
  }

  const result = await processContactSubmission(formData, request.headers);
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (result.retryAfter) headers.set("Retry-After", String(result.retryAfter));
  return Response.json(result.state, { status: result.statusCode, headers });
}
