import { NextResponse } from "next/server";
import { listAdminGalleryItems, newGalleryUploadSlug } from "@/lib/admin-gallery";
import { requireStaffRole } from "@/lib/admin-access";
import { ensureIndexes, media } from "@/lib/db";
import { isAcceptedImageUpload } from "@/lib/image-upload";
import { mongoUpdated } from "@/lib/korea-time";
import { deleteMedia, upsertMedia } from "@/lib/media-crud";
import { getSession } from "@/lib/session";

export const maxDuration = 120;

async function requireStaff() {
  const session = await getSession();
  if (!requireStaffRole(session)) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await listAdminGalleryItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "사진 파일을 선택해 주세요." }, { status: 400 });
    }
    if (!isAcceptedImageUpload(file)) {
      return NextResponse.json(
        { error: "JPG·PNG·WebP·GIF 이미지만 올릴 수 있습니다. (파일 확장자를 확인해 주세요.)" },
        { status: 400 },
      );
    }

    const title = String(form.get("title") ?? form.get("alt") ?? "갤러리").trim() || "갤러리";
    const description = String(form.get("description") ?? form.get("summaryKo") ?? "").trim();
    const publicGallery = form.get("publicGallery") === "true" || form.get("publicGallery") === "on";
    const cmsBackground =
      form.get("cmsBackground") === "false"
        ? false
        : form.get("cmsBackground") === "true" || form.get("cmsBackground") === "on" || !form.has("cmsBackground")
          ? true
          : false;

    const slug = newGalleryUploadSlug();
    const buffer = Buffer.from(await file.arrayBuffer());
    const err = await upsertMedia({
      slug,
      category: "gallery",
      audience: "public",
      titleKo: title,
      titleEn: title,
      titleZh: title,
      summaryKo: description,
      summaryEn: description,
      summaryZh: description,
      published: true,
      createdBy: session.username,
      channels: { publicGallery, cmsBackground },
      file: { name: file.name, type: file.type, buffer },
    });
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    const items = await listAdminGalleryItems();
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "저장 중 오류";
    return NextResponse.json(
      { error: `업로드에 실패했습니다. ${msg} (DB·Mongo 연결을 확인해 주세요.)` },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: {
    id?: string;
    title?: string;
    description?: string;
    publicGallery?: boolean;
    cmsBackground?: boolean;
    published?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const slug = String(body.id ?? "").trim();
  if (!slug) return NextResponse.json({ error: "id required" }, { status: 400 });

  await ensureIndexes();
  const hit = await (await media()).findOne({ slug });
  if (!hit) return NextResponse.json({ error: "not found" }, { status: 404 });

  const title = body.title !== undefined ? String(body.title) : hit.title.ko;
  const description = body.description !== undefined ? String(body.description) : hit.summary.ko;
  const channels = {
    publicGallery: body.publicGallery ?? hit.channels?.publicGallery ?? false,
    cmsBackground: body.cmsBackground ?? hit.channels?.cmsBackground ?? false,
  };

  await (await media()).updateOne(
    { slug },
    {
      $set: {
        title: { ko: title, en: hit.title.en || title, zh: hit.title.zh || title },
        summary: {
          ko: description,
          en: hit.summary.en || description,
          zh: hit.summary.zh || description,
        },
        channels,
        published: body.published ?? hit.published,
        ...mongoUpdated(),
      },
    },
  );

  const items = await listAdminGalleryItems();
  return NextResponse.json({ ok: true, items });
}

export async function DELETE(request: Request) {
  const session = await requireStaff();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteMedia(id);
  const items = await listAdminGalleryItems();
  return NextResponse.json({ ok: true, items });
}