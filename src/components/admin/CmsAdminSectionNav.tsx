"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { cmsAdminNavContext } from "@/lib/cms-admin-nav";

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

  const { parent, siblings, activeKey, onHub } = ctx;

  return (
    <nav
      aria-label="섹션별 편집 메뉴"
      className="sticky top-[var(--guest-header-total)] z-40 border-b border-line bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6 [&::-webkit-scrollbar]:h-0">
        <a href={parent.href} className={chipClass(onHub)}>
          {parent.label}
        </a>
        <span className="shrink-0 text-ink/25" aria-hidden>
          |
        </span>
        {siblings.map((child) => {
          const active = child.key === activeKey && !onHub;
          return (
            <a key={child.key} href={child.href} className={chipClass(active)}>
              {child.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}