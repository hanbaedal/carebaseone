import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { ensureIndexes, inquiries, type InquiryDoc, type InquiryReply } from "@/lib/db";
import { formatKoreaDateTimeStorage, mongoCreated } from "@/lib/korea-time";

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
  if (!ObjectId.isValid(id)) return;
  await (await inquiries()).deleteOne({ _id: new ObjectId(id) });
}

export async function addInquiryReply(inquiryId: string, body: string, createdBy: string) {
  await ensureIndexes();
  const text = body.trim();
  if (!ObjectId.isValid(inquiryId) || !text) return "empty";
  const reply: InquiryReply = {
    id: randomUUID(),
    body: text,
    createdBy,
    ...mongoCreated(),
  };
  await (await inquiries()).updateOne(
    { _id: new ObjectId(inquiryId) },
    { $push: { replies: reply } },
  );
  return null;
}

export async function updateInquiryReply(inquiryId: string, replyId: string, body: string) {
  await ensureIndexes();
  const text = body.trim();
  if (!ObjectId.isValid(inquiryId) || !replyId || !text) return "empty";
  const at = new Date();
  const result = await (await inquiries()).updateOne(
    { _id: new ObjectId(inquiryId), "replies.id": replyId },
    {
      $set: {
        "replies.$.body": text,
        "replies.$.updatedAt": at,
        "replies.$.updatedAtKst": formatKoreaDateTimeStorage(at),
      },
    },
  );
  if (result.matchedCount === 0) return "notfound";
  return null;
}

export async function deleteInquiryReply(inquiryId: string, replyId: string) {
  await ensureIndexes();
  if (!ObjectId.isValid(inquiryId) || !replyId) return;
  await (await inquiries()).updateOne(
    { _id: new ObjectId(inquiryId) },
    { $pull: { replies: { id: replyId } } },
  );
}

export type { InquiryDoc, InquiryReply };