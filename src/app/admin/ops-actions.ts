"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { findUser } from "@/lib/users";
import { deletePost, upsertPost } from "@/lib/posts";
import { setMemberStatus, deleteMember } from "@/lib/members";
import { updateOrderStatus } from "@/lib/orders";
import { deleteInquiry } from "@/lib/inquiries";
import { ensureIndexes, media, type MediaCategory } from "@/lib/db";
import { deleteMedia, upsertMedia } from "@/lib/media-crud";
import { mongoUpdated } from "@/lib/korea-time";
import type { MemberTier, PostType } from "@/lib/db";

async function requireStaff() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const user = await findUser(session.username);
  if (!user || user.disabled) redirect("/admin/login");
  return session;
}

export async function savePost(formData: FormData) {
  const session = await requireStaff();
  const slug = String(formData.get("slug") ?? "").trim();
  const type = String(formData.get("type") ?? "notice") as PostType;
  if (!slug) redirect("/admin/posts?status=error");

  await upsertPost({
    slug,
    type,
    visibility: formData.get("visibility") === "member" ? "member" : "public",
    title: {
      ko: String(formData.get("titleKo") ?? ""),
      en: String(formData.get("titleEn") ?? ""),
      zh: String(formData.get("titleZh") ?? ""),
    },
    body: {
      ko: String(formData.get("bodyKo") ?? ""),
      en: String(formData.get("bodyEn") ?? ""),
      zh: String(formData.get("bodyZh") ?? ""),
    },
    eventPlace: String(formData.get("eventPlace") ?? "") || undefined,
    mediaIds: [],
    pinned: formData.get("pinned") === "on",
    published: formData.get("published") !== "off",
    createdBy: session.username,
  });
  redirect("/admin/posts?status=saved");
}

export async function removePost(formData: FormData) {
  await requireStaff();
  await deletePost(String(formData.get("slug") ?? ""));
  redirect("/admin/posts?status=saved");
}

export async function manageMember(formData: FormData) {
  const session = await requireStaff();
  const username = String(formData.get("username") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const tier = String(formData.get("tier") ?? "") as MemberTier;

  if (intent === "delete") {
    await deleteMember(username);
  } else if (intent === "approve") {
    await setMemberStatus({
      username,
      status: "approved",
      tier: tier || "general",
      actor: session.username,
    });
  } else if (intent === "hold") {
    await setMemberStatus({ username, status: "held", actor: session.username });
  } else if (intent === "pending") {
    await setMemberStatus({ username, status: "pending", actor: session.username });
  }
  redirect("/admin/members?status=saved");
}

export async function updateOrder(formData: FormData) {
  await requireStaff();
  const orderNo = String(formData.get("orderNo") ?? "");
  const status = String(formData.get("status") ?? "");
  await updateOrderStatus(orderNo, status);
  redirect("/admin/orders?status=saved");
}

export async function removeInquiry(formData: FormData) {
  await requireStaff();
  await deleteInquiry(String(formData.get("id") ?? ""));
  redirect("/admin/inquiries?status=saved");
}

export async function toggleMedia(formData: FormData) {
  await requireStaff();
  await ensureIndexes();
  const slug = String(formData.get("slug") ?? "");
  const published = formData.get("published") === "true";
  await (await media()).updateOne({ slug }, { $set: { published, ...mongoUpdated() } });
  redirect("/admin/media?status=saved");
}

export async function saveMedia(formData: FormData) {
  const session = await requireStaff();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) redirect("/admin/media?status=error&message=slug");
  const file = formData.get("file");
  let buffer: Buffer | undefined;
  let fileMeta: { name: string; type: string; buffer: Buffer } | undefined;
  if (file instanceof File && file.size > 0) {
    buffer = Buffer.from(await file.arrayBuffer());
    fileMeta = { name: file.name, type: file.type, buffer };
  }
  const err = await upsertMedia({
    slug,
    category: String(formData.get("category") ?? "other") as MediaCategory,
    audience: formData.get("audience") === "member" ? "member" : "public",
    titleKo: String(formData.get("titleKo") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    titleZh: String(formData.get("titleZh") ?? ""),
    summaryKo: String(formData.get("summaryKo") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? ""),
    summaryZh: String(formData.get("summaryZh") ?? ""),
    published: formData.get("published") === "on",
    createdBy: session.username,
    file: fileMeta,
  });
  if (err) redirect(`/admin/media?status=error&message=${encodeURIComponent(err)}`);
  redirect("/admin/media?status=saved");
}

export async function removeMedia(formData: FormData) {
  await requireStaff();
  await deleteMedia(String(formData.get("slug") ?? ""));
  redirect("/admin/media?status=saved");
}
