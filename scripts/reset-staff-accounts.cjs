/**
 * staff(users) 컬렉션을 비우고 슈퍼바이저·관리자 시드 2계정만 다시 만듭니다.
 *
 * node scripts/reset-staff-accounts.cjs
 * (또는 인자: node scripts/reset-staff-accounts.cjs basic "pw" xinxinedu "pw2")
 */
const { MongoClient } = require("mongodb");
const { randomBytes, scrypt } = require("node:crypto");
const { promisify } = require("node:util");

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

const defaults = [
  { username: "basic", password: "haesoo.4949!", role: "supervisor" },
  { username: "xinxinedu", password: "jangintack062500", role: "admin" },
];

function parseAccounts() {
  const args = process.argv.slice(2);
  if (args.length === 0) return defaults;
  if (args.length % 2 !== 0 || args.length < 4) {
    console.error("사용법: node scripts/reset-staff-accounts.cjs [supervisor_id supervisor_pw admin_id admin_pw]");
    process.exit(1);
  }
  return [
    { username: args[0].trim().toLowerCase(), password: args[1], role: "supervisor" },
    { username: args[2].trim().toLowerCase(), password: args[3], role: "admin" },
  ];
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const accounts = parseAccounts();
  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db("carebaseone").collection("users");

  const deleted = await users.deleteMany({});
  console.log(`[reset-staff] 기존 계정 ${deleted.deletedCount}건 삭제`);

  const now = new Date();
  for (const account of accounts) {
    await users.insertOne({
      username: account.username,
      passwordHash: await hashPassword(account.password),
      seedPasswordPlain: account.password,
      seedSyncedAt: now,
      role: account.role,
      disabled: false,
      createdAt: now,
      createdBy: "seed",
    });
    console.log(`[reset-staff] 생성: ${account.username} (${account.role})`);
  }

  await client.close();
}

main().catch((err) => {
  console.error("[reset-staff] 실패:", err.message);
  process.exit(1);
});
