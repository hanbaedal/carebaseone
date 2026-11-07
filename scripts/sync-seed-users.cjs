/**
 * Render 배포 시 SEED_* 환경 변수로 Mongo staff 비밀번호를 맞춥니다.
 * 사용: MONGODB_URI 및 SEED_* 가 설정된 상태에서 node scripts/sync-seed-users.cjs
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

function normalizeUsername(value) {
  const t = value?.trim().toLowerCase();
  return t || undefined;
}

function normalizePassword(value) {
  if (value === undefined || value === null) return undefined;
  return String(value).trim();
}

const seeds = [
  {
    username: normalizeUsername(process.env.SEED_SUPERVISOR_USERNAME),
    password: normalizePassword(process.env.SEED_SUPERVISOR_PASSWORD),
    role: "supervisor",
  },
  {
    username: normalizeUsername(process.env.SEED_ADMIN_USERNAME),
    password: normalizePassword(process.env.SEED_ADMIN_PASSWORD),
    role: "admin",
  },
];

async function findSeedUser(collection, seed) {
  if (!seed.username) return null;
  let doc = await collection.findOne({ username: seed.username });
  if (!doc) {
    doc = await collection.findOne({ role: seed.role, createdBy: "seed" });
  }
  return doc;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("[sync-seed-users] MONGODB_URI 없음 — 건너뜀");
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db("carebaseone").collection("users");

  for (const seed of seeds) {
    if (!seed.username || !seed.password) continue;
    const passwordHash = await hashPassword(seed.password);
    const existing = await findSeedUser(users, seed);

    if (!existing) {
      const now = new Date();
      await users.insertOne({
        username: seed.username,
        passwordHash,
        passwordPlain: seed.password,
        seedSyncedAt: now,
        role: seed.role,
        disabled: false,
        createdAt: now,
        createdBy: "seed",
      });
      console.log(`[sync-seed-users] 생성: ${seed.username} (${seed.role})`);
      continue;
    }

    const set = {
      passwordHash,
      passwordPlain: seed.password,
      seedSyncedAt: new Date(),
      role: seed.role,
      disabled: false,
    };
    if (existing.username !== seed.username) {
      set.username = seed.username;
    }
    await users.updateOne({ _id: existing._id }, { $set: set });
    console.log(`[sync-seed-users] 비밀번호 동기화: ${seed.username} (${seed.role})`);
  }

  await client.close();
}

main().catch((err) => {
  console.error("[sync-seed-users] 실패:", err.message);
  process.exit(1);
});
