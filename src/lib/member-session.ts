import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findMemberByUsername, type MemberPublic } from "@/lib/members";

export type MemberSession = {
  username: string;
  exp: number;
};

const cookieName = "cb_member";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET is not set");
  }
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function createToken(session: MemberSession) {
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function readToken(token: string): MemberSession | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const actual = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted)) {
    return null;
  }
  const data = JSON.parse(Buffer.from(body, "base64url").toString()) as MemberSession;
  if (data.exp < Date.now()) return null;
  if (!data.username) return null;
  return data;
}

export async function getMemberSession() {
  try {
    const jar = await cookies();
    const token = jar.get(cookieName)?.value;
    if (!token) return null;
    return readToken(token);
  } catch {
    return null;
  }
}

export async function getApprovedMember(): Promise<MemberPublic | null> {
  const session = await getMemberSession();
  if (!session) return null;
  const member = await findMemberByUsername(session.username);
  if (!member || member.status !== "approved") return null;
  return member;
}

export async function setMemberSession(username: string) {
  const token = createToken({
    username,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14,
  });
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearMemberSession() {
  const jar = await cookies();
  jar.delete(cookieName);
}
