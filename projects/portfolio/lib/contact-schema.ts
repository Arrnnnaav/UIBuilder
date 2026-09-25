import { z } from "zod";

export const contactInput = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  message: z.string().trim().min(10, "Tell us a little more").max(5000),
  // Honeypot: real users never see or fill this field.
  company: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactInput>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
