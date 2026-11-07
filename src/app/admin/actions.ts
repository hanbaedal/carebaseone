"use server";

import { redirect } from "next/navigation";
import { saveSection } from "@/lib/content";
import { clearSession, getSession, setSession } from "@/lib/session";
import { users } from "@/lib/db";
import {
  authenticate,
  configuredSeedUsernames,
  createAdmin,
  findUser,
  recentFailures,
  recordActivity,
  updateAdmin,
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
  const password = String(formData.get("password") ?? "");
  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해 주세요." };
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return { error: "서버 로그인 설정이 필요합니다." };
  }

  try {
    if ((await recentFailures(username)) >= 8) {
      return { error: "시도가 많습니다. 잠시 후 다시 로그인해 주세요." };
    }
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
          error:
            "관리자 계정이 없습니다. Render에 SEED_ADMIN_USERNAME·SEED_ADMIN_PASSWORD를 설정한 뒤 저장·재배포하세요.",
        };
      }
      const seedName =
        process.env.SEED_ADMIN_USERNAME?.trim().toLowerCase() ??
        process.env.SEED_SUPERVISOR_USERNAME?.trim().toLowerCase();
      if (seedName === username && !process.env.SEED_ADMIN_PASSWORD && !process.env.SEED_SUPERVISOR_PASSWORD) {
        return { error: "SEED 비밀번호 환경 변수가 비어 있습니다." };
      }
      const seedIds = configuredSeedUsernames();
      const hint = [
        seedIds.supervisor ? `슈퍼바이저=${seedIds.supervisor}` : null,
        seedIds.admin ? `관리자=${seedIds.admin}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      return {
        error: hint
          ? `아이디 또는 비밀번호가 맞지 않습니다. Render SEED_* 와 동일해야 합니다. (서버에 등록된 시드 아이디: ${hint})`
          : "아이디 또는 비밀번호가 맞지 않습니다. Render SEED_* 를 설정한 뒤 저장하고 재배포하세요.",
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
    `/admin?section=${encodeURIComponent(section)}&status=${status}&message=${encodeURIComponent(message)}`,
  );
}

export async function manageUser(formData: FormData) {
  const session = await requireSession();
  if (session.role !== "supervisor") redirect("/admin");

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
