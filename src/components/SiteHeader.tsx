"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navItems } from "@/lib/site";

export function SiteHeader({ showAdmin = false }: { showAdmin?: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const accountHref = showAdmin ? "/admin" : "/admin/login";
  const accountLabel = showAdmin ? t("admin") : t("login");
  return (
    <header className="absolute inset-x-0 top-0 z-50 text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5">
        <Link href="/" className="shrink-0 font-display text-xl tracking-[0.18em]">
          CAREBASE
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`text-[11px] tracking-[0.18em] transition-colors ${
                  active ? "text-cream" : "text-cream/60 hover:text-cream"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <a
            href={accountHref}
            className="whitespace-nowrap border border-cream/50 px-2 py-1 text-[11px] tracking-[0.14em] text-cream hover:bg-cream hover:text-navy"
          >
            {accountLabel}
          </a>
          <div className="hidden sm:block">
            <LanguageSwitcher light />
          </div>
          <button
            type="button"
            className="whitespace-nowrap text-[11px] tracking-[0.14em] lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t("close") : t("menu")}
          </button>
        </div>
      </div>
      {open ? (
        <div
          className="border-t border-cream/15 bg-navy/95 px-6 py-6 text-cream lg:hidden"
        >
          <div className="flex flex-col gap-4">
            <div className="sm:hidden">
              <LanguageSwitcher light />
            </div>
            <a
              href={accountHref}
              className="w-fit border border-cream/50 px-3 py-1.5 text-sm tracking-[0.16em]"
            >
              {accountLabel}
            </a>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.16em]"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
