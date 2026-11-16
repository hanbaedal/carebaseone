"use server";

import { redirect } from "next/navigation";
import { authenticateMember, findMemberByUsername } from "@/lib/members";
import { users } from "@/lib/db";
import { authenticate, findUser, recordActivity } from "@/lib/users";
import { clearMemberSession, setMemberSession } from "@/lib/member-session";
import { clearSession, setSession } from "@/lib/session";

export type UnifiedLoginResult = { error?: string; ok?: boolean; kind?: "staff" | "member" };

/** 운영자(users) 먼저, 이어 회원(members) 조회 */
export async function unifiedLogin(
  _prev: UnifiedLoginResult,
  formData: FormData,
): Promise<UnifiedLoginResult> {
  const rawUsername = String(formData.get("username") ?? "").trim();
  const staffUsername = rawUsername.toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  if (!rawUsername || !password) {
    return { error: "아이디와 비밀번호를 입력해 주세요." };
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return { error: "서버 로그인 설정이 필요합니다." };
  }

  try {
    const staffUser = await authenticate(staffUsername, password);
    if (staffUser) {
      await clearMemberSession();
      await recordActivity({
        username: staffUser.username,
        role: staffUser.role,
        action: "login",
        detail: "unified",
      });
      await setSession({ username: staffUser.username, role: staffUser.role });
      return { ok: true, kind: "staff" };
    }

    const existingStaff = await findUser(staffUsername);
    if (existingStaff) {
      if (existingStaff.disabled) {
        return { error: "비활성화된 운영자 계정입니다. 슈퍼바이저에게 문의해 주세요." };
      }
      return {
        error:
          "운영자 비밀번호가 맞지 않습니다. 입력값이 users.passwordPlain 과 같으면 한 번 더 시도해 주세요.",
      };
    }

    const memberResult = await authenticateMember(rawUsername, password);
    if (memberResult && !("error" in memberResult)) {
      await clearSession();
      await setMemberSession(memberResult.member.username);
      return { ok: true, kind: "member" };
    }

    if (memberResult && "error" in memberResult) {
      if (memberResult.status === "pending") {
        return { error: "회원 승인 대기 중입니다." };
      }
      if (memberResult.status === "held") {
        return { error: "가입이 보류되었습니다. 문의해 주세요." };
      }
    }

    const member = await findMemberByUsername(rawUsername);
    if (member && member.status === "approved") {
      return { error: "회원 비밀번호가 맞지 않습니다." };
    }
    if (member && member.status !== "approved") {
      return { error: "회원 승인 대기 중입니다." };
    }

    const userCount = await (await users()).countDocuments({});
    if (userCount === 0) {
      return {
        error: "계정이 없습니다. SEED_* 설정 후 다시 시도하거나 회원가입을 이용해 주세요.",
      };
    }

    return {
      error: "아이디 또는 비밀번호가 맞지 않습니다. 회원은 가입·승인 후 이용할 수 있습니다.",
    };
  } catch {
    return { error: "데이터베이스에 연결할 수 없습니다." };
  }
}

export async function unifiedLogoutStaff() {
  await clearSession();
  await clearMemberSession();
  redirect("/ko");
}

export async function unifiedLogoutMember() {
  await clearMemberSession();
  await clearSession();
  redirect("/ko");
}