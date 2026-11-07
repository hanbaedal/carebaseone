"use server";

import { redirect } from "next/navigation";
import { authenticateMember, findMemberByUsername, registerMember, updateMemberProfile } from "@/lib/members";
import { findUser } from "@/lib/users";
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
): Promise<{ error?: string; ok?: boolean }> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해 주세요." };
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return { error: "서버 로그인 설정이 필요합니다. 관리자에게 문의해 주세요." };
  }
  try {
    if (await findUser(username)) {
      return {
        error:
          "홈페이지 관리(운영자) 계정입니다. 회원 로그인이 아닙니다. 주소창에 /admin/login 을 입력하거나 상단 「홈페이지 관리」에서 로그인해 주세요.",
      };
    }
    const result = await authenticateMember(username, password);
    if (!result) {
      const member = await findMemberByUsername(username);
      if (member && member.status === "approved") {
        return {
          error:
            "비밀번호가 맞지 않습니다. 가입 시 설정한 비밀번호를 그대로 입력해 주세요. Compass members.passwordPlain 과 비교할 수 있습니다.",
        };
      }
      if (member && member.status !== "approved") {
        return { error: "관리자 승인 대기 중입니다." };
      }
      return {
        error:
          "회원 계정이 없거나 비밀번호가 맞지 않습니다. 가입 후 관리자 승인이 필요합니다. 운영자는 /admin/login 을 이용해 주세요.",
      };
    }
    if ("error" in result) {
      if (result.status === "pending") return { error: "관리자 승인 대기 중입니다." };
      if (result.status === "held") return { error: "가입이 보류되었습니다. 문의해 주세요." };
      return { error: "로그인할 수 없습니다." };
    }
    await setMemberSession(result.member.username);
    return { ok: true };
  } catch {
    return { error: "데이터베이스에 연결할 수 없습니다." };
  }
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
