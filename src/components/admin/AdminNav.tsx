"use client";

import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import type { Role } from "@/lib/session";

const links = [
  { href: "/admin", label: "콘텐츠", match: (path: string) => path === "/admin" },
  {
    href: "/admin/users",
    label: "계정",
    supervisor: true,
    match: (path: string) => path.startsWith("/admin/users"),
  },
  {
    href: "/admin/stats",
    label: "통계",
    supervisor: true,
    match: (path: string) => path.startsWith("/admin/stats"),
  },
];

export function AdminNav({ role, username }: { role: Role; username: string }) {
  const pathname = usePathname();
  const items = links.filter((item) => !item.supervisor || role === "supervisor");

  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2">
        <a href="/ko" className="text-xs tracking-[0.16em] text-forest">
          CAREBASE
        </a>
        <nav className="flex flex-1 gap-1 overflow-x-auto text-xs">
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`shrink-0 px-2 py-1 ${
                  active ? "bg-forest text-cream" : "text-ink/70"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <p className="hidden text-[11px] text-ink/50 sm:block">
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
