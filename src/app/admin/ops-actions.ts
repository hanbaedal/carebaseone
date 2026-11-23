"use server";

import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/login-path";
import { getSession } from "@/lib/session";
import { findUser } from "@/lib/users";
import { deletePost, upsertPost } from "@/lib/posts";
import { setMemberStatus, deleteMember } from "@/lib/members";
import { updateOrderStatus } from "@/lib/orders";
import {
  addInquiryReply,
  deleteInquiry,
  deleteInquiryReply,
  updateInquiryReply,
} from "@/lib/inquiries";
import { ensureIndexes, media, type MediaCategory } from "@/lib/db";
import { deleteMedia, upsertMedia } from "@/lib/media-crud";
import { mongoUpdated } from "@/lib/korea-time";
import type { MemberTier, PostType } from "@/lib/db";

async function requireStaff() {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);
  const user = await findUser(session.username);
  if (!user || user.disabled) redirect(LOGIN_PATH);
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
  const back =
    type === "notice"
      ? "/admin/notices?status=saved"
      : `/admin/posts?type=${encodeURIComponent(type)}&status=saved`;
  redirect(back);
}

export async function removePost(formData: FormData) {
  await requireStaff();
  const type = String(formData.get("type") ?? "");
  await deletePost(String(formData.get("slug") ?? ""));
  const back =
    type === "notice"
      ? "/admin/notices?status=saved"
      : type
        ? `/admin/posts?type=${encodeURIComponent(type)}&status=saved`
        : "/admin/posts?status=saved";
  redirect(back);
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

export async function saveInquiryReply(formData: FormData) {
  const session = await requireStaff();
  const inquiryId = String(formData.get("inquiryId") ?? "").trim();
  const replyId = String(formData.get("replyId") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const err = replyId
    ? await updateInquiryReply(inquiryId, replyId, body)
    : await addInquiryReply(inquiryId, body, session.username);
  if (err === "empty") redirect("/admin/inquiries?status=error&message=답변+내용을+입력해+주세요");
  if (err === "notfound") redirect("/admin/inquiries?status=error&message=답변을+찾을+수+없습니다");
  redirect("/admin/inquiries?status=saved");
}

export async function removeInquiryReply(formData: FormData) {
  await requireStaff();
  await deleteInquiryReply(
    String(formData.get("inquiryId") ?? ""),
    String(formData.get("replyId") ?? ""),
  );
  redirect("/admin/inquiries?status=saved");
}

function redirectMedia(formData: FormData) {
  const returnQuery = String(formData.get("returnQuery") ?? "").trim();
  const base = `/admin/media${returnQuery}`;
  const sep = returnQuery.includes("?") ? "&" : "?";
  redirect(`${base}${sep}status=saved`);
}

export async function toggleMedia(formData: FormData) {
  await requireStaff();
  await ensureIndexes();
  const slug = String(formData.get("slug") ?? "");
  const published = formData.get("published") === "true";
  await (await media()).updateOne({ slug }, { $set: { published, ...mongoUpdated() } });
  redirectMedia(formData);
}

export async function updateMediaChannels(formData: FormData) {
  await requireStaff();
  await ensureIndexes();
  const slug = String(formData.get("slug") ?? "");
  if (!slug) redirect("/admin/media?status=error&message=slug");
  const publicGallery = formData.get("publicGallery") === "on";
  const cmsBackground = formData.get("cmsBackground") === "on";
  await (await media()).updateOne(
    { slug },
    { $set: { channels: { publicGallery, cmsBackground }, ...mongoUpdated() } },
  );
  redirectMedia(formData);
}

export async function saveMedia(formData: FormData) {
  const session = await requireStaff();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) redirect("/admin/media?status=error&message=slug");
  const file = formData.get("file");
  let fileMeta: { name: string; type: string; buffer: Buffer } | undefined;
  if (file instanceof File && file.size > 0) {
    fileMeta = {
      name: file.name,
      type: file.type,
      buffer: Buffer.from(await file.arrayBuffer()),
    };
  }
  const category = String(formData.get("category") ?? "other") as MediaCategory;
  const channels =
    formData.get("publicGallery") === "on" || formData.get("cmsBackground") === "on"
      ? {
          publicGallery: formData.get("publicGallery") === "on",
          cmsBackground: formData.get("cmsBackground") === "on",
        }
      : undefined;
  const err = await upsertMedia({
    slug,
    category,
    audience: formData.get("audience") === "member" ? "member" : "public",
    titleKo: String(formData.get("titleKo") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    titleZh: String(formData.get("titleZh") ?? ""),
    summaryKo: String(formData.get("summaryKo") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? ""),
    summaryZh: String(formData.get("summaryZh") ?? ""),
    published: formData.get("published") === "on",
    createdBy: session.username,
    channels,
    file: fileMeta,
  });
  const returnQuery = String(formData.get("returnQuery") ?? "").trim();
  const errBase = `/admin/media${returnQuery}`;
  const errSep = returnQuery.includes("?") ? "&" : "?";
  if (err) redirect(`${errBase}${errSep}status=error&message=${encodeURIComponent(err)}`);
  redirectMedia(formData);
}

export async function removeMedia(formData: FormData) {
  await requireStaff();
  await deleteMedia(String(formData.get("slug") ?? ""));
  redirectMedia(formData);
}
