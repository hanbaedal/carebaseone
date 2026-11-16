import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/login-path";
import { clearSession, getSession, type Role } from "@/lib/session";
import { findUser } from "@/lib/users";

export function requireStaffRole(session: { role: Role } | null, allowed: Role[] = ["admin", "supervisor"]) {
  if (!session || !allowed.includes(session.role)) return false;
  return true;
}

export async function requireStaffSession() {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);
  const user = await findUser(session.username);
  if (!user || user.disabled) {
    await clearSession();
    redirect(LOGIN_PATH);
  }
  return { username: user.username, role: user.role };
}