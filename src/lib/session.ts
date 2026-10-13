import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Role = "supervisor" | "admin";

export type Session = {
  username: string;
  role: Role;
  exp: number;
};

const cookieName = "cb_session";

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

export function createToken(session: Session) {
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string): Session | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const actual = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted)) {
    return null;
  }
  const data = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
  if (data.exp < Date.now()) return null;
  if (data.role !== "admin" && data.role !== "supervisor") return null;
  if (!data.username) return null;
  return data;
}

export async function getSession() {
  try {
    const jar = await cookies();
    const token = jar.get(cookieName)?.value;
    if (!token) return null;
    return readToken(token);
  } catch {
    return null;
  }
}

export async function setSession(session: Omit<Session, "exp">) {
  const token = createToken({
    ...session,
    exp: Date.now() + 1000 * 60 * 60 * 12,
  });
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(cookieName);
}
