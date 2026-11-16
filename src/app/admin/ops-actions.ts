"use server";

import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/login-path";
import { getSession } from "@/lib/session";
import { findUser } from "@/lib/users";
import { setMemberStatus, deleteMember } from "@/lib/members";
import { updateOrderStatus } from "@/lib/orders";
import type { MemberTier } from "@/lib/db";

async function requireStaff() {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);
  const user = await findUser(session.username);
  if (!user || user.disabled) redirect(LOGIN_PATH);
  return session;
}

export async function manageMember(formData: FormData) {
  const session = await requireStaff();
  const username = String(formData.get("username") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const tier = String(formData.get("tier") ?? "") as MemberTier;

  if (intent === "delete") {
    await deleteMember(username);
  } else if (intent === "approve") {
    await setMemberStatus({
      username,
      status: "approved",
      tier: tier || "general",
      actor: session.username,
    });
  } else if (intent === "hold") {
    await setMemberStatus({ username, status: "held", actor: session.username });
  } else if (intent === "pending") {
    await setMemberStatus({ username, status: "pending", actor: session.username });
  }
  redirect("/admin/members?status=saved");
}

export async function updateOrder(formData: FormData) {
  await requireStaff();
  const orderNo = String(formData.get("orderNo") ?? "");
  const status = String(formData.get("status") ?? "");
  await updateOrderStatus(orderNo, status);
  redirect("/admin/orders?status=saved");
}
