import { formatKoreaDateTimeStorage, mongoCreated } from "@/lib/korea-time";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { Role } from "@/lib/session";
import { activity, ensureIndexes, users, type UserDoc } from "@/lib/db";

function normalizeUsername(value: string | undefined) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed || undefined;
}

/** Render 환경 변수 값 — 앞뒤 공백·줄바꿈 제거 */
function normalizeSeedPassword(value: string | undefined) {
  if (value === undefined || value === null) return undefined;
  const trimmed = String(value).trim();
  return trimmed || undefined;
}

function seedConfigs() {
  return [
    {
      username: normalizeUsername(process.env.SEED_SUPERVISOR_USERNAME),
      password: normalizeSeedPassword(process.env.SEED_SUPERVISOR_PASSWORD),
      role: "supervisor" as const,
    },
    {
      username: normalizeUsername(process.env.SEED_ADMIN_USERNAME),
      password: normalizeSeedPassword(process.env.SEED_ADMIN_PASSWORD),
      role: "admin" as const,
    },
  ];
}

async function findSeedUser(
  collection: Awaited<ReturnType<typeof users>>,
  seed: { username: string; role: Role },
) {
  let doc = await collection.findOne({ username: seed.username });
  if (!doc) {
    doc = await collection.findOne({ role: seed.role, createdBy: "seed" });
  }
  return doc;
}

export async function ensureSeedUsers(options?: { syncPasswords?: boolean }) {
  const syncPasswords = options?.syncPasswords ?? false;
  await ensureIndexes();
  const collection = await users();
  for (const seed of seedConfigs()) {
    const username = seed.username;
    const password = seed.password;
    if (!username || !password) continue;
    const existing = await findSeedUser(collection, { username, role: seed.role });

    if (!existing) {
      const synced = new Date();
      await collection.insertOne({
        username,
        passwordHash: await hashPassword(password),
        passwordPlain: password,
        seedSyncedAt: synced,
        seedSyncedAtKst: formatKoreaDateTimeStorage(synced),
        role: seed.role,
        disabled: false,
        ...mongoCreated(synced),
        createdBy: "seed",
      });
      continue;
    }

    const update: Partial<UserDoc> = {
      role: seed.role,
      disabled: false,
    };
    if (syncPasswords) {
      update.passwordHash = await hashPassword(password);
      update.passwordPlain = password;
      const synced = new Date();
      update.seedSyncedAt = synced;
      update.seedSyncedAtKst = formatKoreaDateTimeStorage(synced);
    }
    if (existing.username !== username) {
      update.username = username;
    }
    if (Object.keys(update).length === 0) continue;
    await collection.updateOne({ _id: existing._id }, { $set: update });
  }
}

type StaffRecord = UserDoc & { _id: unknown; password?: string };

async function normalizeStaffRecord(
  collection: Awaited<ReturnType<typeof users>>,
  doc: StaffRecord,
) {
  const set: Partial<UserDoc> = {};
  const unset: Record<string, ""> = {};

  if (!doc.passwordHash && typeof doc.password === "string" && doc.password.startsWith("scrypt$")) {
    set.passwordHash = doc.password;
    unset.password = "";
    doc.passwordHash = doc.password;
  }
  if (doc.disabled === undefined) {
    set.disabled = false;
    doc.disabled = false;
  }
  if (Object.keys(set).length || Object.keys(unset).length) {
    await collection.updateOne(
      { _id: doc._id },
      {
        ...(Object.keys(set).length ? { $set: set } : {}),
        ...(Object.keys(unset).length ? { $unset: unset } : {}),
      },
    );
  }
  return doc;
}

export async function findUser(username: string) {
  await ensureIndexes();
  const collection = await users();
  const doc = await collection.findOne({ username: username.trim().toLowerCase() });
  if (!doc) return null;
  return normalizeStaffRecord(collection, doc as StaffRecord);
}

export async function authenticate(username: string, password: string) {
  const user = await findUser(username);
  if (!user || user.disabled) return null;
  const plain = password.trim();
  if (!plain) return null;
  const stored = user.passwordHash;
  if (!stored || !stored.startsWith("scrypt$")) return null;
  const match = await verifyPassword(plain, stored);
  if (!match) return null;
  return user;
}

export function configuredSeedUsernames() {
  const supervisor = normalizeUsername(process.env.SEED_SUPERVISOR_USERNAME);
  const admin = normalizeUsername(process.env.SEED_ADMIN_USERNAME);
  return { supervisor, admin };
}

export async function listUsers() {
  await ensureIndexes();
  return (await users())
    .find({}, { projection: { passwordHash: 0, passwordPlain: 0 } })
    .sort({ role: -1, username: 1 })
    .toArray();
}

export async function createAdmin(input: {
  username: string;
  password: string;
  createdBy: string;
}) {
  await ensureIndexes();
  const username = input.username.trim().toLowerCase();
  if (!/^[a-zA-Z0-9._-]{3,32}$/.test(username)) {
    return "아이디는 3~32자의 영문, 숫자, . _ - 만 사용할 수 있습니다.";
  }
  if (input.password.length < 8) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }
  const collection = await users();
  const existing = await collection.findOne({ username });
  if (existing) return "이미 있는 아이디입니다.";
  await collection.insertOne({
    username,
    passwordHash: await hashPassword(input.password),
    passwordPlain: input.password,
    role: "admin",
    disabled: false,
    ...mongoCreated(),
    createdBy: input.createdBy,
  });
  await recordActivity({
    username: input.createdBy,
    role: "supervisor",
    action: "create-admin",
    detail: username,
  });
  return null;
}

export async function updateAdmin(input: {
  username: string;
  disabled?: boolean;
  password?: string;
  actor: string;
}) {
  await ensureIndexes();
  const collection = await users();
  const user = await collection.findOne({ username: input.username });
  if (!user || user.role !== "admin") return "관리자 계정을 찾을 수 없습니다.";
  const update: Partial<UserDoc> = {};
  if (typeof input.disabled === "boolean") update.disabled = input.disabled;
  if (input.password) {
    if (input.password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    update.passwordHash = await hashPassword(input.password);
    update.passwordPlain = input.password;
  }
  if (Object.keys(update).length === 0) return null;
  await collection.updateOne({ username: user.username }, { $set: update });
  await recordActivity({
    username: input.actor,
    role: "supervisor",
    action: "update-admin",
    detail: user.username,
  });
  return null;
}

export async function recentFailures(username: string) {
  await ensureIndexes();
  return (await activity()).countDocuments({
    username,
    action: "login-failed",
    createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
  });
}

export async function recordActivity(entry: {
  username: string;
  role: UserDoc["role"] | "unknown" | "member";
  action: string;
  detail: string;
}) {
  await (await activity()).insertOne({ ...entry, ...mongoCreated() });
}
