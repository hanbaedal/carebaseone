"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  cmsAdminNavContext,
  cmsAdminNavMatchesHref,
} from "@/lib/cms-admin-nav";

function chipClass(active: boolean) {
  return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
    active
      ? "border-brand bg-brand text-white"
      : "border-line bg-white text-brand-ink/75 hover:border-brand/40 hover:text-brand"
  }`;
}

export function CmsAdminSectionNav() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const ctx = cmsAdminNavContext(pathname, searchParams);

  if (!ctx) return null;

  const { allLinks } = ctx;

  return (
    <nav
      aria-label="홈페이지관리 전체 메뉴"
      className="sticky top-[var(--guest-header-total)] z-40 border-b border-line bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-1.5 px-4 py-2.5 sm:gap-2 sm:px-6">
        {allLinks.map((item) => {
          if (item.heading) {
            return (
              <span
                key={item.key}
                className="ml-1 shrink-0 px-1 text-[10px] font-semibold tracking-wide text-ink/40 first:ml-0 sm:text-[11px]"
              >
                {item.label}
              </span>
            );
          }
          const active = cmsAdminNavMatchesHref(item.href, pathname, searchParams);
          return (
            <a key={item.key} href={item.href} className={chipClass(active)}>
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
