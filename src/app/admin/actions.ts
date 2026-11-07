"use server";

import { redirect } from "next/navigation";
import { saveSection } from "@/lib/content";
import { clearSession, getSession, setSession } from "@/lib/session";
import { users } from "@/lib/db";
import { getCompanyProfile, saveCompanyProfile, type CompanyProfileInput } from "@/lib/company-profile";
import {
  authenticate,
  createAdmin,
  findUser,
  recordActivity,
  updateAdmin,
  updateStaffSelfPassword,
} from "@/lib/users";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const user = await findUser(session.username);
  if (!user || user.disabled) {
    await clearSession();
    redirect("/admin/login");
  }
  return { username: user.username, role: user.role };
}

export async function login(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해 주세요." };
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return { error: "서버 로그인 설정이 필요합니다." };
  }

  try {
    const existing = await findUser(username);
    const user = await authenticate(username, password);
    if (!user) {
      await recordActivity({
        username,
        role: "unknown",
        action: "login-failed",
        detail: "",
      });
      const userCount = await (await users()).countDocuments({});
      if (userCount === 0) {
        return {
          error: "관리자 계정이 없습니다. Render SEED_* 설정 후 /admin/login 을 다시 열어 주세요.",
        };
      }
      if (!existing) {
        return {
          error:
            "운영자 계정이 없습니다. 아이디는 소문자로 users 컬렉션에 있어야 합니다. 회원(members)과는 별도입니다.",
        };
      }
      if (existing.disabled) {
        return { error: "비활성화된 계정입니다. 슈퍼바이저에게 문의해 주세요." };
      }
      return {
        error:
          "비밀번호가 맞지 않습니다. 입력값이 Compass users.passwordPlain 과 같으면 한 번 더 시도해 주세요(해시 자동 복구).",
      };
    }
    await recordActivity({
      username: user.username,
      role: user.role,
      action: "login",
      detail: "",
    });
    await setSession({ username: user.username, role: user.role });
    return { ok: true as const };
  } catch {
    return { error: "데이터베이스에 연결할 수 없습니다." };
  }
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveContent(formData: FormData) {
  const session = await requireSession();
  const section = String(formData.get("section") ?? "");
  const values: Record<string, { ko: string; en: string; zh: string }> = {};

  for (const [key, raw] of formData.entries()) {
    if (typeof raw !== "string") continue;
    const match = /^(ko|en|zh):(.*)$/.exec(key);
    if (!match) continue;
    const path = decodeURIComponent(match[2]);
    values[path] ??= { ko: "", en: "", zh: "" };
    values[path][match[1] as "ko" | "en" | "zh"] = raw;
  }

  let status = "saved";
  let message = "";
  try {
    const result = await saveSection({
      section,
      username: session.username,
      role: session.role,
      values,
    });
    if (result.error === "partial") status = "partial";
    else if (result.error) {
      status = "error";
      message = result.error;
    }
  } catch {
    status = "error";
    message = "저장하지 못했습니다.";
  }

  redirect(
    `/admin/content?section=${encodeURIComponent(section)}&status=${status}&message=${encodeURIComponent(message)}`,
  );
}

function profileFromForm(formData: FormData): CompanyProfileInput {
  const pick = (name: keyof CompanyProfileInput) => String(formData.get(name) ?? "").trim();
  return {
    companyName: pick("companyName"),
    representativeName: pick("representativeName"),
    companyPhone: pick("companyPhone"),
    companyFax: pick("companyFax"),
    companyEmail: pick("companyEmail"),
    representativePhone: pick("representativePhone"),
    website: pick("website"),
    businessRegistrationNumber: pick("businessRegistrationNumber"),
    businessType: pick("businessType"),
    businessItem: pick("businessItem"),
    snsFacebook: pick("snsFacebook"),
    snsInstagram: pick("snsInstagram"),
    snsNaverCafe: pick("snsNaverCafe"),
    snsYoutube: pick("snsYoutube"),
    snsKakao: pick("snsKakao"),
  };
}

export async function saveStaffSelfEdit(formData: FormData) {
  const session = await requireSession();
  if (session.role !== "admin" && session.role !== "supervisor") {
    redirect("/admin/site");
  }

  const password = String(formData.get("password") ?? "").trim();
  if (password) {
    const pwError = await updateStaffSelfPassword({
      username: session.username,
      password,
      role: session.role,
    });
    if (pwError) {
      redirect(
        `/admin/staff-self-edit?status=error&message=${encodeURIComponent(pwError)}`,
      );
    }
  }

  try {
    await saveCompanyProfile({
      values: profileFromForm(formData),
      username: session.username,
      role: session.role,
    });
  } catch {
    redirect("/admin/staff-self-edit?status=error&message=저장하지%20못했습니다.");
  }

  redirect("/admin/staff-self-edit?status=saved");
}

export async function manageUser(formData: FormData) {
  const session = await requireSession();
  if (session.role !== "supervisor") redirect("/admin/site");

  const intent = String(formData.get("intent") ?? "");
  let message = "";
  try {
    if (intent === "create") {
      message =
        (await createAdmin({
          username: String(formData.get("username") ?? ""),
          password: String(formData.get("password") ?? ""),
          createdBy: session.username,
        })) ?? "";
    } else {
      const password = String(formData.get("password") ?? "");
      if (intent === "password" && password.length < 8) {
        message = "비밀번호는 8자 이상이어야 합니다.";
      } else {
        message =
          (await updateAdmin({
            username: String(formData.get("username") ?? ""),
            password: password || undefined,
            disabled:
              intent === "disable" ? true : intent === "enable" ? false : undefined,
            actor: session.username,
          })) ?? "";
      }
    }
  } catch {
    message = "계정을 저장하지 못했습니다.";
  }

  redirect(
    `/admin/users?status=${message ? "error" : "saved"}&message=${encodeURIComponent(message)}`,
  );
}
