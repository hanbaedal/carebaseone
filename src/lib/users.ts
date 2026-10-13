import { hashPassword, verifyPassword } from "@/lib/password";
import type { Role } from "@/lib/session";
import { activity, ensureIndexes, users, type UserDoc } from "@/lib/db";

const seeds: { username?: string; password?: string; role: Role }[] = [
  {
    username: process.env.SEED_SUPERVISOR_USERNAME,
    password: process.env.SEED_SUPERVISOR_PASSWORD,
    role: "supervisor",
  },
  {
    username: process.env.SEED_ADMIN_USERNAME,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: "admin",
  },
];

export async function ensureSeedUsers() {
  await ensureIndexes();
  const collection = await users();
  for (const seed of seeds) {
    const username = seed.username?.trim();
    const password = seed.password;
    if (!username || !password) continue;
    const existing = await collection.findOne({ username });
    if (existing) continue;
    await collection.insertOne({
      username,
      passwordHash: await hashPassword(password),
      role: seed.role,
      disabled: false,
      createdAt: new Date(),
      createdBy: "seed",
    });
  }
}

export async function findUser(username: string) {
  await ensureIndexes();
  return (await users()).findOne({ username });
}

export async function authenticate(username: string, password: string) {
  await ensureSeedUsers();
  const user = await findUser(username.trim());
  if (!user || user.disabled) return null;
  const match = await verifyPassword(password, user.passwordHash);
  if (!match) return null;
  return user;
}

export async function listUsers() {
  await ensureIndexes();
  return (await users())
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ role: -1, username: 1 })
    .toArray();
}

export async function createAdmin(input: {
  username: string;
  password: string;
  createdBy: string;
}) {
  await ensureIndexes();
  const username = input.username.trim();
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
    role: "admin",
    disabled: false,
    createdAt: new Date(),
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
  role: UserDoc["role"] | "unknown";
  action: "login" | "login-failed" | "save-content" | "create-admin" | "update-admin";
  detail: string;
}) {
  await (await activity()).insertOne({ ...entry, createdAt: new Date() });
}
