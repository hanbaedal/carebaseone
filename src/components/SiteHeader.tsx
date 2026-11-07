"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MemberHeaderAuth } from "@/components/MemberHeaderAuth";
import { headerNav } from "@/lib/site";

const ADMIN_MENU_LABEL = "홈페이지 관리";

function linkActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function itemActive(pathname: string, item: (typeof headerNav)[number]) {
  if (linkActive(pathname, item.href)) return true;
  return item.children?.some((c) => linkActive(pathname, c.href)) ?? false;
}

export function SiteHeader({ memberName = null }: { memberName?: string | null }) {
  const t = useTranslations("nav") as (key: string) => string;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const navLinkClass = (active: boolean) =>
    `text-[14px] font-medium transition-colors ${
      active ? "text-brand" : "text-brand-ink/70 hover:text-brand"
    }`;

  const utilityLinkClass = (active: boolean) =>
    `hidden whitespace-nowrap text-[13px] font-medium md:inline ${
      active ? "text-brand" : "text-brand-ink/50 hover:text-brand"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 text-brand-ink backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:py-4">
        <BrandLogo />
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {headerNav.map((item) => {
            const active = itemActive(pathname, item);
            if (!item.children?.length) {
              return (
                <Link key={item.key} href={item.href} className={navLinkClass(active)}>
                  {t(item.key)}
                </Link>
              );
            }
            return (
              <div key={item.key} className="group relative">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-0.5 ${navLinkClass(active)}`}
                >
                  {t(item.key)}
                  <span className="text-[10px] text-brand-ink/35" aria-hidden>
                    ▾
                  </span>
                </Link>
                <div className="invisible absolute left-0 top-full z-50 min-w-[10.5rem] rounded-xl border border-line bg-white py-2 pt-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      className={`block px-4 py-2 text-[13px] hover:bg-brand/5 ${
                        linkActive(pathname, child.href) ? "text-brand" : "text-brand-ink/80"
                      }`}
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <a href="/admin" className={navLinkClass(pathname.startsWith("/admin"))}>
            {ADMIN_MENU_LABEL}
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {memberName ? (
            <Link
              href="/member/profile"
              className={`${utilityLinkClass(pathname.startsWith("/member/profile"))} max-w-[10rem] truncate`}
              title={memberName}
            >
              {memberName}
            </Link>
          ) : null}
          <Link href="/sitemap" className={utilityLinkClass(pathname === "/sitemap")}>
            {t("sitemap")}
          </Link>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-[12px] font-medium lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t("close") : t("menu")}
          </button>
          <MemberHeaderAuth loggedIn={Boolean(memberName)} />
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-white px-4 py-5 lg:hidden sm:px-6">
          <div className="flex flex-col gap-2">
            <div className="sm:hidden pb-2">
              <LanguageSwitcher />
            </div>
            {memberName ? (
              <Link
                href="/member/profile"
                onClick={() => setOpen(false)}
                className="mb-2 text-[14px] font-medium text-brand"
              >
                {memberName}
              </Link>
            ) : null}
            <Link
              href="/sitemap"
              onClick={() => setOpen(false)}
              className="mb-2 text-[14px] font-medium text-brand-ink/70 hover:text-brand"
            >
              {t("sitemap")}
            </Link>
            {headerNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const expandedOpen = expanded === item.key;
              return (
                <div key={item.key} className="border-b border-line pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-[15px] font-medium text-brand-ink"
                    >
                      {t(item.key)}
                    </Link>
                    {hasChildren ? (
                      <button
                        type="button"
                        className="px-2 text-xs text-brand-ink/50"
                        aria-expanded={expandedOpen}
                        onClick={() => setExpanded(expandedOpen ? null : item.key)}
                      >
                        {expandedOpen ? "−" : "+"}
                      </button>
                    ) : null}
                  </div>
                  {hasChildren && expandedOpen ? (
                    <div className="mt-2 flex flex-col gap-2 border-l border-line pl-3">
                      {item.children!.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="text-[14px] text-brand-ink/75"
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className="border-b border-line pb-2 text-[15px] font-medium text-brand"
            >
              {ADMIN_MENU_LABEL}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
