import { afterEach, beforeEach, expect, it, vi } from "vitest";

const submission = vi.hoisted(() => ({ run: vi.fn() }));
vi.mock("@/lib/submit-contact", () => ({ processContactSubmission: submission.run }));

import { POST } from "../../app/api/contact/route";

const validForm = () => {
  const form = new FormData();
  form.set("name", "Ada Lovelace");
  form.set("email", "ada@example.com");
  form.set("message", "Please contact me about a backend engineering role.");
  form.set("cf-turnstile-response", "verified-test-token");
  return form;
};

const formRequest = (body: FormData, headers: HeadersInit = {}) =>
  new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { origin: "https://portfolio.example", ...headers },
    body,
  });

beforeEach(() => submission.run.mockResolvedValue({ state: { status: "success" }, statusCode: 200 }));
afterEach(() => vi.clearAllMocks());

it("rejects a cross-origin POST before processing form data", async () => {
  const response = await POST(formRequest(validForm(), { origin: "https://attacker.example" }));

  expect(response.status).toBe(403);
  expect(await response.json()).toEqual({ status: "error", message: "Request origin is not allowed." });
  expect(submission.run).not.toHaveBeenCalled();
});

it("requires multipart form data", async () => {
  const response = await POST(new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { origin: "https://portfolio.example", "content-type": "application/json" },
    body: JSON.stringify({ name: "Ada" }),
  }));

  expect(response.status).toBe(415);
  expect(submission.run).not.toHaveBeenCalled();
});

it("rejects oversized streamed form bodies before parsing them", async () => {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(40_000));
      controller.close();
    },
  });
  const request = new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: {
      origin: "https://portfolio.example",
      "content-type": "multipart/form-data; boundary=oversized",
    },
    body,
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  const response = await POST(request);

  expect(response.status).toBe(413);
  expect(await response.json()).toEqual({ status: "error", message: "Message is too large." });
  expect(submission.run).not.toHaveBeenCalled();
});

it("rejects an oversized declared body without reading it", async () => {
  const response = await POST(formRequest(validForm(), { "content-length": "40000" }));

  expect(response.status).toBe(413);
  expect(submission.run).not.toHaveBeenCalled();
});

it("returns a stable JSON state and prevents caching", async () => {
  submission.run.mockResolvedValue({
    state: { status: "error", message: "Too many messages. Try again in a minute." },
    statusCode: 429,
    retryAfter: 60,
  });

  const response = await POST(formRequest(validForm()));

  expect(response.status).toBe(429);
  expect(response.headers.get("content-type")).toContain("application/json");
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("retry-after")).toBe("60");
  expect(await response.json()).toEqual({ status: "error", message: "Too many messages. Try again in a minute." });
  expect(submission.run).toHaveBeenCalledOnce();
});

it("returns handled field validation as contact state instead of a transport failure", async () => {
  submission.run.mockResolvedValue({
    state: { status: "error", message: "Check the highlighted fields.", fieldErrors: { email: "Enter a valid email" } },
    statusCode: 200,
  });

  const response = await POST(formRequest(validForm()));

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    status: "error",
    message: "Check the highlighted fields.",
    fieldErrors: { email: "Enter a valid email" },
  });
});

it("returns a generic 400 for malformed multipart bodies", async () => {
  const response = await POST(new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: {
      origin: "https://portfolio.example",
      "content-type": "multipart/form-data; boundary=broken",
    },
    body: "not a multipart body",
  }));

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ status: "error", message: "Check the submitted fields and try again." });
  expect(submission.run).not.toHaveBeenCalled();
});
