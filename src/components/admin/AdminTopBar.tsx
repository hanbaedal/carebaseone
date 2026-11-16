"use client";

import { logout } from "@/app/admin/actions";
import { AdminBrand } from "@/components/admin/AdminBrand";
import type { Role } from "@/lib/session";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname() ?? "";
  const cmsMode = pathname === "/admin/cms" || pathname.startsWith("/admin/cms?");
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur-md">
      <div
        className={`mx-auto flex items-center gap-3 px-3 py-2.5 ${
          cmsMode ? "max-w-[96rem]" : "max-w-6xl"
        }`}
      >
        <AdminBrand siteName={siteName} tagline={tagline} />
        <p className="ml-auto hidden text-[11px] text-ink/50 sm:block">
          {username} · {role === "supervisor" ? "슈퍼바이저" : "관리자"}
        </p>
        <a href="/ko/sitemap" className="text-[11px] text-brand hover:underline">
          사이트맵
        </a>
        <form action={logout}>
          <button type="submit" className="text-[11px] text-ink/60">
            로그아웃
          </button>
        </form>
      </div>
    </header>
  );
}
