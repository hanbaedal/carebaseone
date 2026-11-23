import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { GridFSBucket, ObjectId } from "mongodb";
import { ensureIndexes, media } from "@/lib/db";
import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { getApprovedMember } from "@/lib/member-session";
import { getDatabase } from "@/lib/mongodb";
import { resolveMediaDiskPath } from "@/lib/media-storage";
import { getSession } from "@/lib/session";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";

const BUCKET = "archiveFiles";

function parseRange(rangeHeader: string | null, size: number) {
  if (!rangeHeader?.startsWith("bytes=") || size <= 0) return null;
  const part = rangeHeader.replace(/^bytes=/, "").split(",")[0]?.trim();
  if (!part) return null;
  const [startStr, endStr] = part.split("-");
  let start = startStr === "" ? NaN : Number.parseInt(startStr, 10);
  let end = endStr === "" || endStr === undefined ? NaN : Number.parseInt(endStr, 10);
  if (Number.isNaN(start)) {
    if (Number.isNaN(end)) return null;
    start = Math.max(0, size - end);
    end = size - 1;
  } else if (Number.isNaN(end) || end >= size) {
    end = size - 1;
  }
  if (start < 0 || start >= size || end < start) return null;
  return { start, end, length: end - start + 1 };
}

function toWebResponse(
  stream: NodeJS.ReadableStream,
  mime: string,
  fileName: string,
  status: number,
  extra: Record<string, string> = {},
) {
  const web = Readable.toWeb(stream as Readable);
  const encoded = encodeURIComponent(fileName);
  return new NextResponse(web as unknown as BodyInit, {
    status,
    headers: {
      "Content-Type": mime || "application/octet-stream",
      "Content-Disposition": `inline; filename*=UTF-8''${encoded}`,
      "Cache-Control": "public, max-age=3600",
      "Accept-Ranges": "bytes",
      ...extra,
    },
  });
}

async function gridFsFileLength(gridFsId: string): Promise<number | null> {
  if (!ObjectId.isValid(gridFsId)) return null;
  const db = await getDatabase();
  const bucket = new GridFSBucket(db, { bucketName: BUCKET });
  const files = await bucket.find({ _id: new ObjectId(gridFsId) }).limit(1).toArray();
  const len = files[0]?.length;
  return typeof len === "number" && len > 0 ? len : null;
}

async function streamGridFs(
  gridFsId: string,
  mime: string,
  fileName: string,
  knownSize: number | undefined,
  rangeHeader: string | null,
) {
  if (!ObjectId.isValid(gridFsId)) {
    return NextResponse.json({ error: "invalid file id" }, { status: 404 });
  }
  const db = await getDatabase();
  const bucket = new GridFSBucket(db, { bucketName: BUCKET });
  const size = (typeof knownSize === "number" && knownSize > 0 ? knownSize : null) ?? (await gridFsFileLength(gridFsId));
  if (size == null) {
    const stream = bucket.openDownloadStream(new ObjectId(gridFsId));
    return toWebResponse(stream, mime, fileName, 200);
  }

  const range = parseRange(rangeHeader, size);
  if (range) {
    try {
      // GridFS end is exclusive
      const stream = bucket.openDownloadStream(new ObjectId(gridFsId), {
        start: range.start,
        end: range.end + 1,
      });
      return toWebResponse(stream, mime, fileName, 206, {
        "Content-Range": `bytes ${range.start}-${range.end}/${size}`,
        "Content-Length": String(range.length),
      });
    } catch {
      /* Range 실패 시 전체 스트림으로 폴백 */
    }
  }

  const stream = bucket.openDownloadStream(new ObjectId(gridFsId));
  return toWebResponse(stream, mime, fileName, 200, {
    "Content-Length": String(size),
  });
}

function streamDisk(diskPath: string, mime: string, fileName: string, rangeHeader: string | null) {
  const size = fs.statSync(diskPath).size;
  const range = parseRange(rangeHeader, size);
  if (range) {
    const stream = createReadStream(diskPath, { start: range.start, end: range.end });
    return toWebResponse(stream, mime, fileName, 206, {
      "Content-Range": `bytes ${range.start}-${range.end}/${size}`,
      "Content-Length": String(range.length),
    });
  }
  return toWebResponse(createReadStream(diskPath), mime, fileName, 200, {
    "Content-Length": String(size),
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
    }

    await ensureIndexes();
    const doc = await (await media()).findOne({ slug });
    if (!doc) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const staff = await getSession();
    if (!doc.published && !staff) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    if (doc.audience === "member") {
      const member = await getApprovedMember();
      if (!member && !staff) {
        return NextResponse.json({ error: "members only" }, { status: 403 });
      }
    }

    const rangeHeader = request.headers.get("range");
    const mime = doc.mime || "application/octet-stream";

    // GridFS first for uploads — Render 등에서 public/media 미러는 인스턴스마다 없을 수 있음
    if (doc.storage === "gridfs" && doc.gridFsId) {
      return await streamGridFs(doc.gridFsId, mime, doc.fileName, doc.size, rangeHeader);
    }

    const disk = resolveMediaDiskPath(slug, doc.fileName);
    if (disk) {
      return streamDisk(disk, mime, doc.fileName, rangeHeader);
    }

    const publicHint = galleryPublicPathFromDoc(doc.tags, doc.fileName);
    if (publicHint.startsWith("/images/")) {
      const publicDisk = path.join(process.cwd(), "public", publicHint.replace(/^\//, ""));
      if (fs.existsSync(publicDisk)) {
        return streamDisk(publicDisk, mime, doc.fileName, rangeHeader);
      }
    }

    return NextResponse.json({ error: "file not ingested" }, { status: 404 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "media stream error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
