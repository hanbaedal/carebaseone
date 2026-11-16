/**
 * 첨부 갤러리 이미지 → public/images/gallery + (선택) Mongo media
 * 사용: node scripts/register-gallery-images.cjs
 * 선택: ASSETS_DIR=... MONGODB_URI=...
 */
const fs = require("node:fs");
const path = require("node:path");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");

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
  fs.readFileSync(
    path.join(__dirname, "..", "src", "data", "gallery-batch-2026-11.json"),
    "utf8",
  ),
);

const assetsDir =
  process.env.ASSETS_DIR ||
  path.join(process.env.USERPROFILE || "", ".cursor", "projects", "c-CAREBAND", "assets");
const galleryDir = path.join(__dirname, "..", "public", "images", "gallery");

function koreaNow() {
  const now = new Date();
  return { createdAt: now, updatedAt: now };
}

async function uploadGridFs(db, slug, buffer, mime) {
  const bucket = new GridFSBucket(db, { bucketName: "archiveFiles" });
  const metaCol = db.collection("media");
  const existing = await metaCol.findOne({ slug });
  if (existing?.gridFsId) {
    try {
      await bucket.delete(existing.gridFsId);
    } catch {
      /* ignore */
    }
  }
  return new Promise((resolve, reject) => {
    const upload = bucket.openUploadStream(`${slug}.jpg`, {
      contentType: mime,
      metadata: { slug },
    });
    upload.on("error", reject);
    upload.on("finish", () => resolve(upload.id));
    upload.end(buffer);
  });
}

async function main() {
  fs.mkdirSync(galleryDir, { recursive: true });
  let copied = 0;
  for (const item of manifest) {
    const src = path.join(assetsDir, item.source);
  if (!fs.existsSync(src)) {
      console.warn("[gallery] missing", item.source);
      continue;
    }
    const dest = path.join(galleryDir, `${item.slug}.jpg`);
    fs.copyFileSync(src, dest);
    copied += 1;
    console.log("[gallery] copied", item.slug);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log(`[gallery] done (files only) copied=${copied}`);
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("carebaseone");
  const col = db.collection("media");

  for (const item of manifest) {
    const disk = path.join(galleryDir, `${item.slug}.jpg`);
    if (!fs.existsSync(disk)) continue;
    const buffer = fs.readFileSync(disk);
    const gridFsId = await uploadGridFs(db, item.slug, buffer, "image/jpeg");
    const filePath = `/api/media/${item.slug}`;
    const title = { ko: item.titleKo, en: item.titleKo, zh: item.titleKo };
    const summary = { ko: item.captionKo, en: item.captionKo, zh: item.captionKo };
    const doc = {
      slug: item.slug,
      category: "product",
      audience: "public",
      title,
      summary,
      filePath,
      fileName: `${item.slug}.jpg`,
      mime: "image/jpeg",
      size: buffer.length,
      tags: ["gallery"],
      published: true,
      storage: "gridfs",
      gridFsId,
      createdBy: "CAREBASE",
    };
    const hit = await col.findOne({ slug: item.slug });
    const times = koreaNow();
    if (!hit) {
      await col.insertOne({ ...doc, ...times, createdAtKst: "", updatedAtKst: "" });
    } else {
      await col.updateOne({ slug: item.slug }, { $set: { ...doc, updatedAt: times.updatedAt } });
    }
    console.log("[gallery] mongo", item.slug);
  }

  await client.close();
  console.log(`[gallery] done copied=${copied} mongo=yes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});