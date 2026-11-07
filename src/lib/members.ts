import { hashPassword, verifyPassword } from "@/lib/password";
import {
  ensureIndexes,
  members,
  type MemberDoc,
  type MemberStatus,
  type MemberTier,
} from "@/lib/db";
import { sendMemberApprovedEmail } from "@/lib/notify";

export type MemberPublic = Omit<MemberDoc, "passwordHash">;

const usernameRe = /^[a-zA-Z0-9._-]{4,24}$/;

export async function findMemberByUsername(username: string) {
  await ensureIndexes();
  const doc = await (await members()).findOne({ username });
  if (!doc) return null;
  const { passwordHash: _, ...rest } = doc;
  return rest as MemberPublic;
}

export async function isUsernameTaken(username: string) {
  await ensureIndexes();
  const hit = await (await members()).findOne({ username });
  return Boolean(hit);
}

export async function findMemberByOAuth(
  channel: MemberDoc["signupChannel"],
  oauthId: string,
) {
  await ensureIndexes();
  const doc = await (await members()).findOne({ signupChannel: channel, oauthId });
  if (!doc) return null;
  const { passwordHash: _, ...rest } = doc;
  return rest as MemberPublic;
}

export async function registerMember(input: {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  note: string;
  signupChannel?: MemberDoc["signupChannel"];
  oauthId?: string;
}) {
  await ensureIndexes();
  const username = input.username.trim();
  if (!usernameRe.test(username)) {
    return "아이디는 4~24자의 영문, 숫자, . _ - 만 사용할 수 있습니다.";
  }
  if (input.password.length < 8) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }
  const col = await members();
  if (await col.findOne({ username })) return "이미 사용 중인 아이디입니다.";
  const now = new Date();
  await col.insertOne({
    username,
    passwordHash: await hashPassword(input.password),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    zipcode: input.zipcode.trim(),
    address: input.address.trim(),
    addressDetail: input.addressDetail.trim(),
    note: input.note.trim(),
    status: "pending",
    tier: "general",
    signupChannel: input.signupChannel ?? "local",
    oauthId: input.oauthId,
    phoneVerified: false,
    createdAt: now,
    updatedAt: now,
  });
  return null;
}

export async function authenticateMember(username: string, password: string) {
  await ensureIndexes();
  const doc = await (await members()).findOne({ username: username.trim() });
  if (!doc || !doc.passwordHash) return null;
  if (doc.status === "deleted") return null;
  if (doc.status !== "approved") {
    return { error: "approved-required" as const, status: doc.status };
  }
  const ok = await verifyPassword(password, doc.passwordHash);
  if (!ok) return null;
  const { passwordHash: _, ...rest } = doc;
  return { member: rest as MemberPublic };
}

export async function listMembers(filter?: { status?: MemberStatus }) {
  await ensureIndexes();
  const query = filter?.status ? { status: filter.status } : {};
  return (await members())
    .find(query, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function setMemberStatus(input: {
  username: string;
  status: MemberStatus;
  tier?: MemberTier;
  actor: string;
}) {
  await ensureIndexes();
  const col = await members();
  const doc = await col.findOne({ username: input.username });
  if (!doc) return "회원을 찾을 수 없습니다.";
  const now = new Date();
  const update: Partial<MemberDoc> = {
    status: input.status,
    updatedAt: now,
  };
  if (input.tier) update.tier = input.tier;
  if (input.status === "approved") {
    update.approvedAt = now;
    update.approvedBy = input.actor;
    if (!input.tier) update.tier = doc.tier ?? "general";
  }
  await col.updateOne({ username: input.username }, { $set: update });
  if (input.status === "approved") {
    await sendMemberApprovedEmail({
      email: doc.email,
      phone: doc.phone,
      name: doc.name,
      username: doc.username,
      tier: update.tier ?? "general",
    });
  }
  return null;
}

export async function updateMemberProfile(
  username: string,
  input: {
    password?: string;
    email?: string;
    phone?: string;
    zipcode?: string;
    address?: string;
    addressDetail?: string;
    note?: string;
  },
) {
  await ensureIndexes();
  const col = await members();
  const doc = await col.findOne({ username });
  if (!doc || doc.status !== "approved") return "수정할 수 없습니다.";
  const update: Partial<MemberDoc> = { updatedAt: new Date() };
  if (input.email) update.email = input.email.trim();
  if (input.phone) update.phone = input.phone.trim();
  if (input.zipcode) update.zipcode = input.zipcode.trim();
  if (input.address) update.address = input.address.trim();
  if (input.addressDetail !== undefined) update.addressDetail = input.addressDetail.trim();
  if (input.note !== undefined) update.note = input.note.trim();
  if (input.password) {
    if (input.password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    update.passwordHash = await hashPassword(input.password);
  }
  await col.updateOne({ username }, { $set: update });
  return null;
}

export async function deleteMember(username: string) {
  return setMemberStatus({ username, status: "deleted", actor: "system" });
}
