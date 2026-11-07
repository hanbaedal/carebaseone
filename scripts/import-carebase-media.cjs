const fs = require("node:fs");
const path = require("node:path");

const srcDir = process.env.CAREBASE_MEDIA_SOURCE || "C:\\Users\\hanba\\Downloads\\carebase";
const destDir = path.join(__dirname, "..", "public", "media");
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "src", "data", "media-manifest.json"), "utf8"),
);

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

let copied = 0;
let missing = 0;
for (const item of manifest) {
  const src = path.join(srcDir, item.fileName);
  const ext = path.extname(item.fileName) || ".pdf";
  const dest = path.join(destDir, `${item.slug}${ext}`);
  if (!fs.existsSync(src)) {
    missing += 1;
    continue;
  }
  fs.copyFileSync(src, dest);
  copied += 1;
}
console.log(`copied=${copied} missing=${missing} dest=${destDir}`);
