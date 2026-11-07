import type { ObjectId } from "mongodb";
import { formatKoreaDateTimeStorage, mongoCreated } from "@/lib/korea-time";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { Role } from "@/lib/session";
import { activity, ensureIndexes, users, type UserDoc } from "@/lib/db";

function normalizeUsername(value: string | undefined) {
  const trimmed = value?.trim().toLowerCase();
  return trimmed || undefined;
}

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

/** DB에 staff 계정이 하나도 없을 때만 SEED_* 로 최초 2계정 생성 (비밀번호 덮어쓰기 없음) */
export async function bootstrapStaffIfEmpty() {
  await ensureIndexes();
  const collection = await users();
  if ((await collection.countDocuments({})) > 0) return;

  for (const seed of seedConfigs()) {
    const { username, password, role } = seed;
    if (!username || !password) continue;
    const synced = new Date();
    await collection.insertOne({
      username,
      passwordHash: await hashPassword(password),
      passwordPlain: password,
      seedSyncedAt: synced,
      seedSyncedAtKst: formatKoreaDateTimeStorage(synced),
      role,
      disabled: false,
      ...mongoCreated(synced),
      createdBy: "seed",
    });
  }
}

type StaffRecord = UserDoc & { _id?: ObjectId; password?: string };

export async function findUser(username: string): Promise<StaffRecord | null> {
  await ensureIndexes();
  const doc = await (await users()).findOne({ username: username.trim().toLowerCase() });
  if (!doc) return null;
  const record = doc as StaffRecord;
  if (!record.passwordHash && typeof record.password === "string" && record.password.startsWith("scrypt$")) {
    record.passwordHash = record.password;
  }
  if (record.disabled === undefined) record.disabled = false;
  return record;
}

/** 로그인: passwordHash 검증. Compass에서 passwordPlain만 맞고 해시가 어긋난 경우 1회 재해시 */
export async function authenticate(username: string, password: string) {
  const user = await findUser(username);
  if (!user || user.disabled) return null;
  const plain = password.trim();
  if (!plain) return null;

  let stored = user.passwordHash;
  if ((!stored || !stored.startsWith("scrypt$")) && typeof user.password === "string" && user.password.startsWith("scrypt$")) {
    stored = user.password;
  }

  const collection = await users();
  const uname = user.username;

  if (stored?.startsWith("scrypt$")) {
    if (await verifyPassword(plain, stored)) return user;
    if (user.passwordPlain === plain) {
      const passwordHash = await hashPassword(plain);
      await collection.updateOne({ username: uname }, { $set: { passwordHash, passwordPlain: plain } });
      return user;
    }
    return null;
  }

  if (user.passwordPlain === plain) {
    const passwordHash = await hashPassword(plain);
    await collection.updateOne({ username: uname }, { $set: { passwordHash, passwordPlain: plain } });
    return user;
  }

  return null;
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
