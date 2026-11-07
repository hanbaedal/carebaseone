import path from "node:path";
import manifest from "@/data/media-manifest.json";
import { ensureIndexes, media, type MediaCategory } from "@/lib/db";

const mimeByExt: Record<string, string> = {
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

function emptyLocale(text: string) {
  return { ko: text, en: text, zh: text };
}

export async function ensureMediaSeed() {
  await ensureIndexes();
  const col = await media();
  const now = new Date();
  for (const item of manifest) {
    const hit = await col.findOne({ slug: item.slug });
    if (hit) continue;
    const ext = path.extname(item.fileName) || ".pdf";
    const filePath = `/media/${item.slug}${ext}`;
    await col.insertOne({
      slug: item.slug,
      category: item.category as MediaCategory,
      audience: "public",
      title: emptyLocale(item.titleKo),
      summary: emptyLocale(item.titleKo),
      filePath,
      fileName: item.fileName,
      mime: mimeByExt[ext.toLowerCase()] ?? "application/octet-stream",
      size: 0,
      tags: item.tags ?? [],
      published: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}
