"use client";

import { logout } from "@/app/admin/actions";
import { AdminBrand } from "@/components/admin/AdminBrand";
import type { Role } from "@/lib/session";

export function AdminTopBar({
  role,
  username,
  siteName,
  tagline,
}: {
  role: Role;
  username: string;
  siteName: string;
  tagline?: string;
}) {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5">
        <AdminBrand siteName={siteName} tagline={tagline} />
        <p className="ml-auto hidden text-[11px] text-ink/50 sm:block">
          {username} · {role === "supervisor" ? "슈퍼바이저" : "관리자"}
        </p>
        <form action={logout}>
          <button type="submit" className="text-[11px] text-ink/60">
            로그아웃
          </button>
        </form>
      </div>
    </header>
  );
}
