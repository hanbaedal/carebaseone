"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { navItems } from "@/lib/site";

export function SiteHeader({ showAdmin = false }: { showAdmin?: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const accountHref = showAdmin ? "/admin" : "/admin/login";
  const accountLabel = showAdmin ? t("admin") : t("login");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 text-brand-ink backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:py-4">
        <BrandLogo />
        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`text-[14px] font-medium transition-colors ${
                  active ? "text-brand" : "text-brand-ink/70 hover:text-brand"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/contact"
            className="hidden whitespace-nowrap rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(29,111,232,0.25)] hover:bg-brand-deep md:inline-flex"
          >
            {t("inquire")}
          </Link>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Link
            href="/member/login"
            className="hidden whitespace-nowrap px-1 text-[12px] text-brand-ink/45 hover:text-brand md:inline"
          >
            {t("memberLogin")}
          </Link>
          <a
            href={accountHref}
            className="whitespace-nowrap px-1 text-[12px] text-brand-ink/45 hover:text-brand"
          >
            {accountLabel}
          </a>
          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-[12px] font-medium xl:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t("close") : t("menu")}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-white px-4 py-5 xl:hidden sm:px-6">
          <div className="flex flex-col gap-4">
            <div className="sm:hidden">
              <LanguageSwitcher />
            </div>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="w-fit rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white"
            >
              {t("inquire")}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[15px] font-medium text-brand-ink"
              >
                {t(item.key)}
              </Link>
            ))}
            <a href={accountHref} className="text-[13px] text-brand-ink/50">
              {accountLabel}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
