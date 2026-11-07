import path from "node:path";
import manifest from "@/data/media-manifest.json";
import mediaI18n from "@/data/media-i18n.json";
import { ensureIndexes, media, type MediaCategory } from "@/lib/db";
import { mongoCreatedUpdated, mongoUpdated } from "@/lib/korea-time";
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

let seedRunning: Promise<void> | null = null;
let ingestStarted = false;

/** 공개 목록용 — DB 조회만, 매 요청 manifest 동기화 없음 */
export async function ensureMediaReady() {
  await ensureIndexes();
  const col = await media();
  const count = await col.estimatedDocumentCount();
  if (count === 0) {
    await ensureMediaSeed();
  }
}

/** 관리·최초 적재: manifest 메타 동기화 (관리 화면에서만 호출 권장) */
export async function ensureMediaSeed() {
  if (seedRunning) return seedRunning;
  seedRunning = runMediaSeed();
  return seedRunning;
}

async function runMediaSeed() {
  try {
    await ensureIndexes();
    const col = await media();
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
          createdBy: "CAREBASE",
          ...mongoCreatedUpdated(),
        });
      }
    }

    await col.updateMany(
      { filePath: { $regex: "^/media/" } },
      [
        {
          $set: {
            filePath: { $concat: ["/api/media/", "$slug"] },
            ...mongoUpdated(),
          },
        },
      ],
    );

    await col.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: "CAREBASE" } },
    );

    if (!process.env.MONGODB_URI || ingestStarted) return;

    const pending = await col.countDocuments({
      $or: [{ storage: { $ne: "gridfs" } }, { gridFsId: { $exists: false } }],
    });
    if (pending > 0) {
      ingestStarted = true;
      const jobs = manifest.map((item) => {
        const ext = path.extname(item.fileName) || ".pdf";
        const mime = mimeByExt[ext.toLowerCase()] ?? "application/octet-stream";
        return { slug: item.slug, fileName: item.fileName, mime };
      });
      void ingestAllMediaBinaries(jobs);
    }
  } finally {
    seedRunning = null;
  }
}
