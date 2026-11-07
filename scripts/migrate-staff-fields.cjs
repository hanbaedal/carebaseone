/**
 * users 컬렉션 필드 점검·보정 (password → passwordHash, disabled 기본값)
 * node scripts/migrate-staff-fields.cjs
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
  const users = client.db("carebaseone").collection("users");
  const docs = await users.find().toArray();
  console.log(`[migrate] carebaseone.users 문서 ${docs.length}건`);

  for (const doc of docs) {
    const set = {};
    const unset = {};
    if (!doc.passwordHash && typeof doc.password === "string" && doc.password.startsWith("scrypt$")) {
      set.passwordHash = doc.password;
      unset.password = "";
      console.log(`[migrate] ${doc.username}: password → passwordHash`);
    }
    if (doc.disabled === undefined) {
      set.disabled = false;
    }
    if (doc.role !== "supervisor" && doc.role !== "admin") {
      console.warn(`[migrate] ${doc.username}: role 값 이상 (${doc.role})`);
    }
    if (!doc.username) {
      console.warn(`[migrate] _id=${doc._id}: username 없음`);
    }
    if (Object.keys(set).length || Object.keys(unset).length) {
      await users.updateOne(
        { _id: doc._id },
        { ...(Object.keys(set).length ? { $set: set } : {}), ...(Object.keys(unset).length ? { $unset: unset } : {}) },
      );
    }
    const fields = Object.keys(doc).filter((k) => k !== "passwordHash");
    console.log(`[migrate] ${doc.username ?? "?"} fields: ${fields.join(", ")}`);
  }
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
