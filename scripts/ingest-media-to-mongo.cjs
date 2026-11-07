/**
 * manifest 기준 파일을 MongoDB GridFS(archiveFiles)에 적재합니다.
 * 사용: MONGODB_URI=... node scripts/ingest-media-to-mongo.cjs
 * 선택: CAREBASE_MEDIA_SOURCE=원본 폴더
 */
const fs = require("node:fs");
const path = require("node:path");
const { MongoClient, GridFSBucket } = require("mongodb");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnvLocal();

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "media-manifest.json"), "utf8"),
);

const mimeByExt = {
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

function resolveDisk(slug, fileName) {
  const ext = path.extname(fileName) || ".pdf";
  const pub = path.join(__dirname, "..", "public", "media", `${slug}${ext}`);
  if (fs.existsSync(pub)) return pub;
  const srcRoot = process.env.CAREBASE_MEDIA_SOURCE;
  if (srcRoot) {
    const src = path.join(srcRoot, fileName);
    if (fs.existsSync(src)) return src;
  }
  return null;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI required");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("carebaseone");
  const bucket = new GridFSBucket(db, { bucketName: "archiveFiles" });
  const col = db.collection("media");

  let ok = 0;
  let skip = 0;
  let miss = 0;

  for (const item of manifest) {
    const disk = resolveDisk(item.slug, item.fileName);
    if (!disk) {
      miss += 1;
      console.warn("missing file", item.slug, item.fileName);
      continue;
    }
    const ext = path.extname(item.fileName) || ".pdf";
    const mime = mimeByExt[ext.toLowerCase()] ?? "application/octet-stream";
    const stat = fs.statSync(disk);

    const existing = await bucket.find({ "metadata.slug": item.slug }).toArray();
    for (const f of existing) await bucket.delete(f._id);

    await new Promise((resolve, reject) => {
      const upload = bucket.openUploadStream(item.fileName, {
        metadata: { slug: item.slug, mime },
      });
      upload.on("error", reject);
      upload.on("finish", resolve);
      fs.createReadStream(disk).pipe(upload);
    });

    const file = await bucket.find({ "metadata.slug": item.slug }).sort({ uploadDate: -1 }).next();
    if (!file) continue;

    await col.updateOne(
      { slug: item.slug },
      {
        $set: {
          gridFsId: file._id.toString(),
          size: stat.size,
          storage: "gridfs",
          filePath: `/api/media/${item.slug}`,
          mime,
          fileName: item.fileName,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          category: item.category,
          audience: "public",
          title: { ko: item.titleKo, en: item.titleKo, zh: item.titleKo },
          summary: { ko: item.titleKo, en: item.titleKo, zh: item.titleKo },
          tags: item.tags ?? [],
          published: true,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    ok += 1;
    console.log("ingested", item.slug, Math.round(stat.size / 1024), "KB");
  }

  await client.close();
  console.log(`done ok=${ok} skip=${skip} miss=${miss}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
