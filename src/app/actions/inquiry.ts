"use server";

import { getCollection } from "@/lib/mongodb";

export type InquiryState = {
  ok: boolean;
  message?: string;
};

type Inquiry = {
  audience: string;
  name: string;
  email: string;
  organization: string;
  country: string;
  partnerType: string;
  message: string;
  createdAt: Date;
};

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();

  if (!name || !email || !message || !audience) {
    return { ok: false, message: "required" };
  }

  const inquiry: Inquiry = {
    audience,
    name,
    email,
    organization: String(formData.get("organization") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    partnerType: String(formData.get("partnerType") ?? "").trim(),
    message,
    createdAt: new Date(),
  };

  try {
    const inquiries = await getCollection<Inquiry>("inquiries");
    await inquiries.insertOne(inquiry);
  } catch (error) {
    console.error("[CAREBASE inquiry]", error);
    return { ok: false, message: "error" };
  }

  return { ok: true };
}
