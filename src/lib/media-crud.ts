import path from "node:path";
import { ensureIndexes, media, type MediaAudience, type MediaCategory } from "@/lib/db";
import { mongoCreatedUpdated, mongoUpdated } from "@/lib/korea-time";
import { defaultChannelsForNewUpload, isImageMime } from "@/lib/media-channels";
import {
  openMediaDownloadStream,
  removeGridFsBySlug,
  resolveMediaDiskPath,
  uploadMediaBuffer,
  writePublicMediaMirror,
  mediaApiPath,
} from "@/lib/media-storage";

const slugRe = /^[a-z0-9][a-z0-9-]{2,48}$/;

export function mimeFromFileName(fileName: string, fallback = "application/octet-stream") {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return fallback;
}

export function isGalleryImageFile(fileName: string, mime: string) {
  return isImageMime(mime) || /\.(jpe?g|png|webp|gif)$/i.test(fileName);
}

/** 업로드 시 MIME이 비어 있으면 목록·공개 갤러리에서 빠지는 문제 보정 */
/** GridFS만 있고 public/media 미러 없으면 썸네일이 깨질 수 있어 복원 */
export async function repairGalleryDiskMirrors() {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const docs = await col
    .find({
      category: "gallery",
      storage: "gridfs",
      gridFsId: { $exists: true },
    })
    .project({ slug: 1, fileName: 1, mime: 1, gridFsId: 1 })
    .toArray();
  for (const doc of docs) {
    if (!isGalleryImageFile(doc.fileName, doc.mime)) continue;
    if (resolveMediaDiskPath(doc.slug, doc.fileName)) continue;
    if (!doc.gridFsId) continue;
    try {
      const stream = await openMediaDownloadStream(doc.gridFsId);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      writePublicMediaMirror(doc.slug, doc.fileName, Buffer.concat(chunks));
    } catch {
      /* 개별 실패 무시 */
    }
  }
}

export async function repairGalleryImageMime() {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const broken = await col
    .find({
      category: "gallery",
      mime: { $not: { $regex: /^image\//i } },
      fileName: { $regex: /\.(jpe?g|png|webp|gif)$/i },
    })
    .project({ slug: 1, fileName: 1 })
    .toArray();
  for (const doc of broken) {
    const mime = mimeFromFileName(doc.fileName);
    if (isImageMime(mime)) {
      await col.updateOne({ slug: doc.slug }, { $set: { mime } });
    }
  }
}

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
  channels?: { publicGallery: boolean; cmsBackground: boolean };
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
    const fileMime =
      input.file.type && input.file.type !== "application/octet-stream"
        ? input.file.type
        : mimeFromFileName(input.file.name, "image/jpeg");
    const uploaded = await uploadMediaBuffer(slug, input.file.buffer, {
      mime: fileMime,
      fileName: input.file.name,
    });
    gridFsId = uploaded.gridFsId;
    size = uploaded.size;
    storage = "gridfs";
    mime = fileMime;
    fileName = input.file.name;
    if (isImageMime(fileMime)) {
      writePublicMediaMirror(slug, fileName, input.file.buffer);
    }
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
    channels:
      input.channels ??
      existing?.channels ??
      defaultChannelsForNewUpload(input.category, mime),
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
