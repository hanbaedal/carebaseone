"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { normalizePublicPath, sectionNavForPath } from "@/lib/section-nav";
import { GUEST_STICKY_SUBNAV_TOP } from "@/lib/guest-layout";

function chipClass(active: boolean) {
  return `shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
    active
      ? "border-brand bg-brand text-white"
      : "border-line bg-white text-brand-ink/75 hover:border-brand/40 hover:text-brand"
  }`;
}

export function SectionSubNav() {
  const pathname = usePathname() ?? "";
  const path = normalizePublicPath(pathname);
  const ctx = sectionNavForPath(path);
  const tNav = useTranslations("nav") as (key: string) => string;
  const tSection = useTranslations("sectionNav") as (key: string) => string;

  if (!ctx) return null;

  const { parent, siblings, onHub } = ctx;

  return (
    <nav
      aria-label={tSection("subNavLabel")}
      className={`sticky z-40 border-b border-line bg-white/95 backdrop-blur-md ${GUEST_STICKY_SUBNAV_TOP}`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-guest-gutter py-2 [&::-webkit-scrollbar]:h-0">
        <Link href={parent.href} className={chipClass(onHub)}>
          {tNav(parent.key)}
        </Link>
        <span className="shrink-0 text-ink/25" aria-hidden>
          |
        </span>
        {siblings.map((child) => {
          const active =
            path === child.href || path.startsWith(`${child.href}/`);
          return (
            <Link key={child.href} href={child.href} className={chipClass(active && !onHub)}>
              {tNav(child.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}