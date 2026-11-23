import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { ensureIndexes, media } from "@/lib/db";
import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { getApprovedMember } from "@/lib/member-session";
import { openMediaDownloadStream, resolveMediaDiskPath } from "@/lib/media-storage";
import { getSession } from "@/lib/session";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";

function parseRange(rangeHeader: string | null, size: number) {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=") || size <= 0) return null;
  const part = rangeHeader.replace(/bytes=/, "").split(",")[0]?.trim();
  if (!part) return null;
  const [startStr, endStr] = part.split("-");
  let start = startStr ? Number.parseInt(startStr, 10) : NaN;
  let end = endStr ? Number.parseInt(endStr, 10) : NaN;
  if (Number.isNaN(start)) {
    // suffix: bytes=-500
    if (Number.isNaN(end)) return null;
    start = Math.max(0, size - end);
    end = size - 1;
  } else {
    if (Number.isNaN(end) || end >= size) end = size - 1;
  }
  if (start < 0 || start >= size || end < start) return null;
  return { start, end, length: end - start + 1 };
}

function streamResponse(
  stream: NodeJS.ReadableStream,
  mime: string,
  fileName: string,
  opts: { size?: number; start?: number; end?: number; length?: number } = {},
) {
  const web = Readable.toWeb(stream as Readable);
  const encoded = encodeURIComponent(fileName);
  const headers: Record<string, string> = {
    "Content-Type": mime || "application/octet-stream",
    "Content-Disposition": `inline; filename*=UTF-8''${encoded}`,
    "Cache-Control": "private, max-age=3600",
    "Accept-Ranges": "bytes",
  };

  if (opts.size != null && opts.start != null && opts.end != null && opts.length != null) {
    headers["Content-Range"] = `bytes ${opts.start}-${opts.end}/${opts.size}`;
    headers["Content-Length"] = String(opts.length);
    return new NextResponse(web as unknown as BodyInit, { status: 206, headers });
  }

  if (opts.size != null) {
    headers["Content-Length"] = String(opts.size);
  }
  return new NextResponse(web as unknown as BodyInit, { status: 200, headers });
}

async function streamFromDisk(diskPath: string, mime: string, fileName: string, rangeHeader: string | null) {
  const stat = fs.statSync(diskPath);
  const size = stat.size;
  const range = parseRange(rangeHeader, size);
  if (range) {
    const stream = createReadStream(diskPath, { start: range.start, end: range.end });
    return streamResponse(stream, mime, fileName, {
      size,
      start: range.start,
      end: range.end,
      length: range.length,
    });
  }
  return streamResponse(createReadStream(diskPath), mime, fileName, { size });
}

async function streamFromGridFs(
  gridFsId: string,
  mime: string,
  fileName: string,
  size: number | undefined,
  rangeHeader: string | null,
) {
  const total = typeof size === "number" && size > 0 ? size : undefined;
  const range = total != null ? parseRange(rangeHeader, total) : null;
  if (range && total != null) {
    const { GridFSBucket, ObjectId } = await import("mongodb");
    const { getDatabase } = await import("@/lib/mongodb");
    const db = await getDatabase();
    const bucket = new GridFSBucket(db, { bucketName: "archiveFiles" });
    if (!ObjectId.isValid(gridFsId)) {
      throw new Error("Invalid gridFsId");
    }
    const stream = bucket.openDownloadStream(new ObjectId(gridFsId), {
      start: range.start,
      end: range.end + 1, // end is exclusive in GridFS API
    });
    return streamResponse(stream, mime, fileName, {
      size: total,
      start: range.start,
      end: range.end,
      length: range.length,
    });
  }
  const stream = await openMediaDownloadStream(gridFsId);
  return streamResponse(stream, mime, fileName, total != null ? { size: total } : {});
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
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

  const disk = resolveMediaDiskPath(slug, doc.fileName);
  if (disk) {
    return streamFromDisk(disk, mime, doc.fileName, rangeHeader);
  }

  if (doc.storage === "gridfs" && doc.gridFsId) {
    try {
      return await streamFromGridFs(doc.gridFsId, mime, doc.fileName, doc.size, rangeHeader);
    } catch {
      return NextResponse.json({ error: "file missing" }, { status: 404 });
    }
  }

  // CMS 갤러리 시드 — public/images 정적 파일
  const publicHint = galleryPublicPathFromDoc(doc.tags, doc.fileName);
  if (publicHint.startsWith("/images/")) {
    const publicDisk = path.join(process.cwd(), "public", publicHint.replace(/^\//, ""));
    if (fs.existsSync(publicDisk)) {
      return streamFromDisk(publicDisk, mime, doc.fileName, rangeHeader);
    }
  }

  return NextResponse.json({ error: "file not ingested" }, { status: 404 });
}
