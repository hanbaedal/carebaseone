import fs from "node:fs";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";
import { GridFSBucket, ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

const BUCKET = "archiveFiles";

function bucket() {
  return getDatabase().then((db) => new GridFSBucket(db, { bucketName: BUCKET }));
}

export function mediaApiPath(slug: string) {
  return `/api/media/${slug}`;
}

export async function removeGridFsBySlug(slug: string) {
  const b = await bucket();
  const files = await b.find({ "metadata.slug": slug }).toArray();
  for (const file of files) {
    await b.delete(file._id);
  }
}

export async function uploadMediaBuffer(
  slug: string,
  data: Buffer,
  meta: { mime: string; fileName: string },
): Promise<{ gridFsId: string; size: number }> {
  const b = await bucket();
  await removeGridFsBySlug(slug);
  return new Promise((resolve, reject) => {
    const upload = b.openUploadStream(meta.fileName, {
      metadata: { slug, mime: meta.mime },
    });
    upload.on("error", reject);
    upload.on("finish", () => {
      resolve({ gridFsId: upload.id.toString(), size: data.length });
    });
    Readable.from(data).pipe(upload);
  });
}

export async function uploadMediaFileFromPath(
  slug: string,
  diskPath: string,
  meta: { mime: string; fileName: string },
): Promise<{ gridFsId: string; size: number }> {
  const stat = fs.statSync(diskPath);
  const b = await bucket();
  await removeGridFsBySlug(slug);
  return new Promise((resolve, reject) => {
    const upload = b.openUploadStream(meta.fileName, {
      metadata: { slug, mime: meta.mime },
    });
    upload.on("error", reject);
    upload.on("finish", () => {
      resolve({ gridFsId: upload.id.toString(), size: stat.size });
    });
    createReadStream(diskPath).pipe(upload);
  });
}

export async function openMediaDownloadStream(gridFsId: string) {
  const b = await bucket();
  if (!ObjectId.isValid(gridFsId)) {
    throw new Error("Invalid gridFsId");
  }
  return b.openDownloadStream(new ObjectId(gridFsId));
}

export function resolveMediaDiskPath(slug: string, fileName: string) {
  const ext = path.extname(fileName) || ".pdf";
  const publicPath = path.join(process.cwd(), "public", "media", `${slug}${ext}`);
  if (fs.existsSync(publicPath)) return publicPath;
  const srcRoot = process.env.CAREBASE_MEDIA_SOURCE;
  if (srcRoot) {
    const srcPath = path.join(srcRoot, fileName);
    if (fs.existsSync(srcPath)) return srcPath;
  }
  return null;
}
