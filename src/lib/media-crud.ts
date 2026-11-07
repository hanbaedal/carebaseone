import { ensureIndexes, media, type MediaAudience, type MediaCategory } from "@/lib/db";
import { mongoCreatedUpdated, mongoUpdated } from "@/lib/korea-time";
import { removeGridFsBySlug, uploadMediaBuffer, mediaApiPath } from "@/lib/media-storage";

const slugRe = /^[a-z0-9][a-z0-9-]{2,48}$/;

export async function upsertMedia(input: {
  slug: string;
  category: MediaCategory;
  audience: MediaAudience;
  titleKo: string;
  titleEn: string;
  titleZh: string;
  summaryKo: string;
  summaryEn: string;
  summaryZh: string;
  published: boolean;
  createdBy: string;
  file?: { name: string; type: string; buffer: Buffer };
}) {
  await ensureIndexes();
  const slug = input.slug.trim().toLowerCase();
  if (!slugRe.test(slug)) {
    return "slug는 영문 소문자·숫자·하이픈(3~49자)만 사용할 수 있습니다.";
  }

  const col = await media();
  const existing = await col.findOne({ slug });

  let gridFsId = existing?.gridFsId;
  let size = existing?.size ?? 0;
  let storage = existing?.storage ?? "missing";
  let mime = existing?.mime ?? "application/octet-stream";
  let fileName = existing?.fileName ?? `${slug}.pdf`;

  if (input.file && input.file.buffer.length > 0) {
    const uploaded = await uploadMediaBuffer(slug, input.file.buffer, {
      mime: input.file.type || "application/octet-stream",
      fileName: input.file.name,
    });
    gridFsId = uploaded.gridFsId;
    size = uploaded.size;
    storage = "gridfs";
    mime = input.file.type || mime;
    fileName = input.file.name;
  }

  const doc = {
    slug,
    category: input.category,
    audience: input.audience,
    title: { ko: input.titleKo, en: input.titleEn || input.titleKo, zh: input.titleZh || input.titleKo },
    summary: {
      ko: input.summaryKo,
      en: input.summaryEn || input.summaryKo,
      zh: input.summaryZh || input.summaryKo,
    },
    filePath: mediaApiPath(slug),
    fileName,
    mime,
    size,
    tags: existing?.tags ?? [],
    published: input.published,
    storage,
    gridFsId,
    createdBy: existing?.createdBy ?? input.createdBy,
  };

  if (!existing) {
    await col.insertOne({ ...doc, ...mongoCreatedUpdated() });
  } else {
    await col.updateOne({ slug }, { $set: { ...doc, ...mongoUpdated() } });
  }
  return null;
}

export async function deleteMedia(slug: string) {
  await ensureIndexes();
  await removeGridFsBySlug(slug);
  await (await media()).deleteOne({ slug });
}
