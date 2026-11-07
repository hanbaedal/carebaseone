const fs = require("node:fs");
const path = require("node:path");

const srcDir = process.env.CAREBASE_MEDIA_SOURCE || "C:\\Users\\hanba\\Downloads\\carebase";
const imgDir = path.join(__dirname, "..", "public", "images", "products");

/** 카드·결제 민감 이미지는 복사하지 않음 (파일명 194718537 / 194929254 등). */
const map = [
  ["KakaoTalk_20261030_150139816.jpg", "jaryeon-cushion.jpg"],
  ["KakaoTalk_20261030_150139816_01.jpg", "jaryeon-cushion-open.jpg"],
  ["KakaoTalk_20261030_150139816_02.jpg", "jaryeon-cushion-box.jpg"],
  ["KakaoTalk_20261030_144331784.jpg", "us-recoverx-line.jpg"],
  ["KakaoTalk_20261030_143835430.jpg", "patent-garlic-sample.jpg"],
  ["KakaoTalk_20261030_142944092.png", "patch-line-promo.png"],
];

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

let copied = 0;
for (const [from, to] of map) {
  const src = path.join(srcDir, from);
  const dest = path.join(imgDir, to);
  if (!fs.existsSync(src)) {
    console.warn("missing", from);
    continue;
  }
  fs.copyFileSync(src, dest);
  copied += 1;
}
console.log(`product images copied=${copied} -> ${imgDir}`);
