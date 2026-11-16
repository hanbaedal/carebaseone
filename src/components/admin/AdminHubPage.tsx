import { AccountHubGrid } from "@/components/AccountHubGrid";
import { staffHubGroups } from "@/lib/account-hub";
import type { Role } from "@/lib/session";
import { findUser } from "@/lib/users";

export async function AdminHubPage({ username, role }: { username: string; role: Role }) {
  const user = await findUser(username);
  const roleLabel = role === "supervisor" ? "슈퍼바이저" : "관리자";

  return (
    <div className="grid gap-3">
      <div>
        <h1 className="text-sm font-semibold">운영 메뉴 맵</h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          {user?.username ?? username} · {roleLabel} — 카드에서 업무 메뉴로 이동합니다. 공개 사이트
          구조는{" "}
          <a href="/ko/sitemap" className="text-brand hover:underline">
            사이트맵
          </a>
          과 동일합니다.
        </p>
      </div>
      <AccountHubGrid groups={staffHubGroups(role)} title="운영·관리" />
    </div>
  );
}