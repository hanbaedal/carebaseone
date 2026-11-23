"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { normalizePublicPath, sectionNavForPath } from "@/lib/section-nav";

export function SectionSiblingNav() {
  const pathname = usePathname() ?? "";
  const path = normalizePublicPath(pathname);
  const ctx = sectionNavForPath(path);
  const tNav = useTranslations("nav") as (key: string) => string;

  if (!ctx) return null;

  const { parent, prev, next, onHub } = ctx;

  if (onHub && !next) return null;
  if (!onHub && !prev && !next) return null;

  return (
    <nav
      aria-label="메뉴 이전·다음"
      className="border-t border-line bg-cream/60"
    >
      <div
        className={`mx-auto flex w-full ${GUEST_CONTENT_MAX} flex-wrap items-stretch justify-between gap-4 px-guest-gutter py-5 text-sm font-medium`}
      >
        <div className="min-w-0 flex-1">
          {onHub ? (
            <span className="text-brand-ink/40">{tNav(parent.key)}</span>
          ) : (
            <Link href={parent.href} className="text-brand hover:underline">
              ← {tNav(parent.key)}
            </Link>
          )}
        </div>
        <div className="min-w-0 flex-1 text-right">
          {next ? (
            <Link href={next.href} className="text-brand hover:underline">
              {tNav(next.key)} →
            </Link>
          ) : (
            <span className="text-brand-ink/35"> </span>
          )}
        </div>
      </div>
      {prev && !onHub ? (
        <div className="mx-auto flex max-w-7xl border-t border-line/80 px-guest-gutter py-3 text-xs text-brand-ink/55 sm:hidden">
          <Link href={prev.href} className="text-brand hover:underline">
            ← {tNav(prev.key)}
          </Link>
        </div>
      ) : null}
    </nav>
  );
}