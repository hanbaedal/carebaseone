/**
 * 로컬에서 Mongo 비밀번호를 직접 맞출 때 (Render SEED_* 와 동일 값 사용 권장)
 *
 * node scripts/set-staff-passwords.cjs basic "haesoo.4949!" xinxinedu jangintack06250
 */
const { MongoClient } = require("mongodb");
const { randomBytes, scrypt } = require("node:crypto");
const { promisify } = require("node:util");

const scryptAsync = promisify(scrypt);
const { formatKoreaDateTimeStorage } = require("./korea-time.cjs");

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args.length < 2 || args.length % 2 !== 0) {
    console.error("사용법: node scripts/set-staff-passwords.cjs <아이디> <비밀번호> ...");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db("carebaseone").collection("users");

  for (let i = 0; i < args.length; i += 2) {
    const username = args[i].trim().toLowerCase();
    const password = args[i + 1];
    const passwordHash = await hashPassword(password);
    const synced = new Date();
    const res = await users.updateOne(
      { username },
      {
        $set: {
          passwordHash,
          passwordPlain: password,
          seedSyncedAt: synced,
          seedSyncedAtKst: formatKoreaDateTimeStorage(synced),
          disabled: false,
        },
      },
    );
    if (res.matchedCount === 0) {
      console.error(`계정 없음: ${username}`);
    } else {
      console.log(`비밀번호 설정: ${username}`);
    }
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
