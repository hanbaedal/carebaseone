"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Role } from "@/lib/session";
import { menuGroupsForRole } from "@/lib/admin-menu";

function itemActive(pathname: string, searchParams: URLSearchParams, href: string) {
  const [path, query = ""] = href.split("?");
  const want = new URLSearchParams(query);

  if (pathname === path || (path === "/admin/content" && pathname.startsWith("/admin/content"))) {
    if (want.size === 0) {
      if (path === "/admin/stats" && pathname.startsWith("/admin/stats/")) return false;
      if (path === "/admin/users" && searchParams.has("focus")) return false;
      return pathname === path;
    }
    for (const [key, value] of want.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  }

  return false;
}

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groups = menuGroupsForRole(role);

  return (
    <aside className="w-full shrink-0 lg:w-44">
      <nav className="flex flex-col gap-3">
        {groups.map((group) => {
          const navy = group.supervisorOnly;
          return (
            <div
              key={group.key}
              className={
                navy
                  ? "rounded-md bg-navy px-2 py-2 text-cream shadow-sm"
                  : "rounded-md border border-ink/10 bg-white px-2 py-2"
              }
            >
              <p
                className={`px-1 text-[11px] font-semibold tracking-wide ${
                  navy ? "text-cream/90" : "text-forest"
                }`}
              >
                {group.label}
              </p>
              <ul className="mt-1 flex flex-col">
                {group.items.map((item) => {
                  const active = itemActive(pathname, searchParams, item.href);
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`block rounded px-2 py-1 text-[11px] leading-snug ${
                          active
                            ? navy
                              ? "bg-white/15 font-medium"
                              : "bg-forest/10 font-medium text-forest"
                            : navy
                              ? "text-cream/80 hover:bg-white/10 hover:text-cream"
                              : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
