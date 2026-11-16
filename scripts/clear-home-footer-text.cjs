/**
 * 프로덕션 Mongo에 남은 home.footerText(면책 등) 제거
 * node scripts/clear-home-footer-text.cjs
 */
const { MongoClient } = require("mongodb");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI 필요");
    process.exit(1);
  }
  const client = new MongoClient(uri);
  await client.connect();
  const contents = client.db("carebaseone").collection("contents");

  for (const locale of ["ko", "en", "zh"]) {
    const res = await contents.updateOne(
      { locale },
      {
        $set: {
          "messages.home.footerText": "",
          "messages.footer.rights": "",
        },
      },
    );
    console.log(`[clear-footer] ${locale} matched=${res.matchedCount} modified=${res.modifiedCount}`);
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});