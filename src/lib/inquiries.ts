import { ensureIndexes, inquiries, type InquiryDoc } from "@/lib/db";

export async function listInquiries(limit = 200) {
  await ensureIndexes();
  return (await inquiries())
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function deleteInquiry(id: string) {
  await ensureIndexes();
  const { ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) return;
  await (await inquiries()).deleteOne({ _id: new ObjectId(id) });
}

export type { InquiryDoc };
