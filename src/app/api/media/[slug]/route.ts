import { NextResponse } from "next/server";
import { ensureIndexes, media } from "@/lib/db";
import { getApprovedMember } from "@/lib/member-session";
import { openMediaDownloadStream, resolveMediaDiskPath } from "@/lib/media-storage";
import { getSession } from "@/lib/session";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

export const dynamic = "force-dynamic";

function streamToWeb(stream: NodeJS.ReadableStream, mime: string, fileName: string) {
  const web = Readable.toWeb(stream as Readable);
  const encoded = encodeURIComponent(fileName);
  return new NextResponse(web as unknown as BodyInit, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `inline; filename*=UTF-8''${encoded}`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function GET(
  _request: Request,
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

  if (doc.storage === "gridfs" && doc.gridFsId) {
    try {
      const stream = await openMediaDownloadStream(doc.gridFsId);
      return streamToWeb(stream, doc.mime, doc.fileName);
    } catch {
      return NextResponse.json({ error: "file missing" }, { status: 404 });
    }
  }

  const disk = resolveMediaDiskPath(slug, doc.fileName);
  if (disk) {
    return streamToWeb(createReadStream(disk), doc.mime, doc.fileName);
  }

  return NextResponse.json({ error: "file not ingested" }, { status: 404 });
}
