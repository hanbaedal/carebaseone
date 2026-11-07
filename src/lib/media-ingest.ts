import { ensureIndexes, media } from "@/lib/db";
import {
  mediaApiPath,
  resolveMediaDiskPath,
  uploadMediaFileFromPath,
} from "@/lib/media-storage";

/** manifest 메타가 있으면 GridFS에 바이너리 적재 (없을 때만) */
export async function ensureMediaBinary(slug: string, fileName: string, mime: string) {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const doc = await col.findOne({ slug });
  if (!doc || (doc.storage === "gridfs" && doc.gridFsId)) return;

  const disk = resolveMediaDiskPath(slug, fileName);
  if (!disk) {
    await col.updateOne(
      { slug },
      { $set: { storage: "missing", updatedAt: new Date() } },
    );
    return;
  }

  const { gridFsId, size } = await uploadMediaFileFromPath(slug, disk, {
    mime,
    fileName,
  });
  await col.updateOne(
    { slug },
    {
      $set: {
        gridFsId,
        size,
        storage: "gridfs",
        filePath: mediaApiPath(slug),
        updatedAt: new Date(),
      },
    },
  );
}

export async function ingestAllMediaBinaries(
  items: { slug: string; fileName: string; mime: string }[],
) {
  for (const item of items) {
    try {
      await ensureMediaBinary(item.slug, item.fileName, item.mime);
    } catch (error) {
      console.error("[CAREBASE media-ingest]", item.slug, error);
    }
  }
}
