"use server";

import { headers } from "next/headers";
import type { ContactState } from "@/lib/contact-schema";
import { processContactSubmission } from "@/lib/submit-contact";

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  return (await processContactSubmission(formData, await headers())).state;
}
