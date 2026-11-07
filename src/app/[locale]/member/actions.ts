"use server";

import { redirect } from "next/navigation";
import {
  authenticateMember,
  isUsernameTaken,
  registerMember,
  updateMemberProfile,
} from "@/lib/members";
import {
  clearMemberSession,
  getApprovedMember,
  setMemberSession,
} from "@/lib/member-session";
import { createOrder } from "@/lib/orders";

export async function signupMember(
  _prev: { error?: string; ok?: boolean },
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  if (password !== password2) return { error: "비밀번호 확인이 일치하지 않습니다." };
  const username = String(formData.get("username") ?? "").trim();
  if (await isUsernameTaken(username)) return { error: "이미 사용 중인 아이디입니다." };
  const error = await registerMember({
    username,
    password,
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    zipcode: String(formData.get("zipcode") ?? ""),
    address: String(formData.get("address") ?? ""),
    addressDetail: String(formData.get("addressDetail") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  if (error) return { error };
  return { ok: true };
}

export async function loginMember(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const result = await authenticateMember(username, password);
  if (!result) return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  if ("error" in result) {
    if (result.status === "pending") return { error: "관리자 승인 대기 중입니다." };
    if (result.status === "held") return { error: "가입이 보류되었습니다. 문의해 주세요." };
    return { error: "로그인할 수 없습니다." };
  }
  await setMemberSession(result.member.username);
  redirect("/store");
}

export async function logoutMember() {
  await clearMemberSession();
  redirect("/member/login");
}

export async function updateProfile(
  _prev: { error?: string; ok?: boolean },
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const member = await getApprovedMember();
  if (!member) return { error: "로그인이 필요합니다." };
  const error = await updateMemberProfile(member.username, {
    password: String(formData.get("password") ?? "") || undefined,
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    zipcode: String(formData.get("zipcode") ?? ""),
    address: String(formData.get("address") ?? ""),
    addressDetail: String(formData.get("addressDetail") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  if (error) return { error };
  return { ok: true };
}

export async function placeOrder(
  _prev: { error?: string; ok?: boolean },
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const member = await getApprovedMember();
  if (!member) return { error: "승인된 회원만 주문할 수 있습니다." };
  const error = await createOrder({
    memberUsername: member.username,
    productSlug: String(formData.get("productSlug") ?? ""),
    qty: Number(formData.get("qty") ?? 1),
    shippingName: String(formData.get("shippingName") ?? member.name),
    shippingPhone: String(formData.get("shippingPhone") ?? member.phone),
    shippingAddress: String(formData.get("shippingAddress") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  if (error) return { error };
  return { ok: true };
}
