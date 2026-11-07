import path from "node:path";
import manifest from "@/data/media-manifest.json";
import mediaI18n from "@/data/media-i18n.json";
import { ensureIndexes, media, type MediaCategory } from "@/lib/db";
import { ingestAllMediaBinaries } from "@/lib/media-ingest";
import { mediaApiPath } from "@/lib/media-storage";

const mimeByExt: Record<string, string> = {
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

type ManifestItem = (typeof manifest)[number] & {
  titleEn?: string;
  titleZh?: string;
};

function localizedTitle(item: ManifestItem) {
  const extra = mediaI18n[item.slug as keyof typeof mediaI18n];
  const ko = item.titleKo;
  const en = item.titleEn ?? extra?.en ?? ko;
  const zh = item.titleZh ?? extra?.zh ?? ko;
  return { ko, en, zh };
}

export async function ensureMediaSeed() {
  await ensureIndexes();
  const col = await media();
  const now = new Date();
  for (const item of manifest) {
    const ext = path.extname(item.fileName) || ".pdf";
    const mime = mimeByExt[ext.toLowerCase()] ?? "application/octet-stream";
    const titles = localizedTitle(item as ManifestItem);
    const hit = await col.findOne({ slug: item.slug });
    if (!hit) {
      await col.insertOne({
        slug: item.slug,
        category: item.category as MediaCategory,
        audience: "public",
        title: titles,
        summary: titles,
        filePath: mediaApiPath(item.slug),
        fileName: item.fileName,
        mime,
        size: 0,
        tags: item.tags ?? [],
        published: true,
        storage: "missing",
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await col.updateOne(
        { slug: item.slug },
        { $set: { title: titles, summary: titles, updatedAt: now } },
      );
    }
  }

  await col.updateMany(
    { filePath: { $regex: "^/media/" } },
    [
      {
        $set: {
          filePath: { $concat: ["/api/media/", "$slug"] },
          updatedAt: new Date(),
        },
      },
    ],
  );

  if (!process.env.MONGODB_URI) return;

  const col2 = await media();
  const pending = await col2.countDocuments({
    $or: [{ storage: { $ne: "gridfs" } }, { gridFsId: { $exists: false } }],
  });
  if (pending > 0) {
    const jobs = manifest.map((item) => {
      const ext = path.extname(item.fileName) || ".pdf";
      const mime = mimeByExt[ext.toLowerCase()] ?? "application/octet-stream";
      return { slug: item.slug, fileName: item.fileName, mime };
    });
    void ingestAllMediaBinaries(jobs);
  }
}
