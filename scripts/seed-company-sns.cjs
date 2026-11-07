/**
 * company_profile SNS URL만 갱신 (기존 회사 정보는 유지)
 * node scripts/seed-company-sns.cjs
 */
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { formatKoreaDateTimeStorage } = require("./korea-time.cjs");

function loadEnvFile() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      if (!line || line.trimStart().startsWith("#")) continue;
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m || process.env[m[1]] !== undefined) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
    return;
  }
}

const DEFAULT_SNS = {
  snsFacebook: "https://www.facebook.com/profile.php?id=61596489113854",
  snsInstagram: "https://www.instagram.com/carebase.kr/",
  snsYoutube: "https://www.youtube.com/channel/UCycMxD82rFtJyCT53w8MUZA",
  snsNaverCafe:
    "https://section.blog.naver.com/BlogHome.naver?directoryNo=0&currentPage=1&groupId=0",
};

async function main() {
  loadEnvFile();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI 필요 (.env.local)");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db("carebaseone").collection("company_profile");
  const existing = await col.findOne({ _id: "site" });
  const updated = new Date();
  const patch = {
    ...DEFAULT_SNS,
    updatedAt: updated,
    updatedAtKst: formatKoreaDateTimeStorage(updated),
    updatedBy: "seed-company-sns",
  };
  if (!existing) {
    await col.insertOne({
      _id: "site",
      companyName: "CAREBASE",
      representativeName: "",
      companyPhone: "",
      companyFax: "",
      companyEmail: "",
      representativePhone: "",
      website: "https://carebaseone.com",
      businessRegistrationNumber: "",
      businessType: "",
      businessItem: "",
      snsKakao: "",
      ...patch,
    });
    console.log("[seed-company-sns] 새 company_profile 생성 + SNS 저장");
  } else {
    await col.updateOne({ _id: "site" }, { $set: patch });
    console.log("[seed-company-sns] SNS 필드만 갱신");
  }
  const doc = await col.findOne({ _id: "site" });
  console.log("[seed-company-sns] 확인:", {
    snsFacebook: doc.snsFacebook,
    snsInstagram: doc.snsInstagram,
    snsYoutube: doc.snsYoutube,
    snsNaverCafe: doc.snsNaverCafe,
  });
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
