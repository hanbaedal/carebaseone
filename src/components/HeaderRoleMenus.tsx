"use client";

import { Link } from "@/i18n/navigation";
import {
  memberHeaderGroup,
  staffHeaderGroups,
  type HeaderRoleGroup,
} from "@/lib/header-role-nav";
import type { Role } from "@/lib/session";
import { HEADER_SUBMENU_LINK, HEADER_SUBMENU_PANEL } from "@/lib/guest-layout";

function isAdminHref(href: string) {
  return href.startsWith("/admin");
}

function RoleDropdown({
  group,
  navLinkClass,
  onNavigate,
}: {
  group: HeaderRoleGroup;
  navLinkClass: (active: boolean) => string;
  onNavigate?: () => void;
}) {
  const topHref = group.href;
  const isHomepage = group.key === "homepage";
  const panelClass = isHomepage
    ? "invisible absolute left-0 top-full z-50 grid w-[min(92vw,52rem)] grid-cols-2 gap-x-2 gap-y-0.5 rounded-xl border border-line bg-white p-3 pt-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 sm:grid-cols-3 lg:grid-cols-4"
    : `invisible absolute left-0 top-full z-50 max-h-[min(80vh,36rem)] overflow-y-auto rounded-xl border border-line bg-white py-2 pt-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${HEADER_SUBMENU_PANEL}`;

  return (
    <div className="group relative shrink-0">
      {isAdminHref(topHref) ? (
        <a
          href={topHref}
          className={`inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap ${navLinkClass(false)}`}
        >
          {group.label}
          <span className="text-[10px] text-brand-ink/35" aria-hidden>
            ▾
          </span>
        </a>
      ) : (
        <Link
          href={topHref}
          className={`inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap ${navLinkClass(false)}`}
        >
          {group.label}
          <span className="text-[10px] text-brand-ink/35" aria-hidden>
            ▾
          </span>
        </Link>
      )}
      <div className={panelClass}>
        {group.links.map((link) => {
          if ("heading" in link && link.heading) {
            return (
              <p
                key={`heading-${link.label}`}
                className={`col-span-full mt-2 px-2 pb-0.5 pt-1 text-[10px] font-semibold tracking-wide text-ink/45 first:mt-0 ${
                  isHomepage ? "border-t border-line/70 pt-2 first:border-t-0 first:pt-1" : ""
                }`}
              >
                {link.label}
              </p>
            );
          }
          return isAdminHref(link.href) ? (
            <a
              key={`${link.label}-${link.href}`}
              href={link.href}
              className={`${HEADER_SUBMENU_LINK} text-brand-ink/80 hover:bg-brand/5 hover:text-brand ${
                isHomepage ? "rounded-md px-2 py-1.5" : ""
              }`}
              onClick={onNavigate}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className={`${HEADER_SUBMENU_LINK} text-brand-ink/80 hover:bg-brand/5 hover:text-brand ${
                isHomepage ? "rounded-md px-2 py-1.5" : ""
              }`}
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function HeaderRoleMenusDesktop({
  memberName,
  staffRole,
  navLinkClass,
}: {
  memberName?: string | null;
  staffRole?: Role | null;
  navLinkClass: (active: boolean) => string;
}) {
  if (staffRole) {
    return (
      <>
        {staffHeaderGroups(staffRole).map((group) => (
          <RoleDropdown key={group.key} group={group} navLinkClass={navLinkClass} />
        ))}
      </>
    );
  }
  if (memberName) {
    return <RoleDropdown group={memberHeaderGroup} navLinkClass={navLinkClass} />;
  }
  return null;
}

export function HeaderRoleMenusMobile({
  memberName,
  staffRole,
  expanded,
  setExpanded,
  onClose,
}: {
  memberName?: string | null;
  staffRole?: Role | null;
  expanded: string | null;
  setExpanded: (key: string | null) => void;
  onClose: () => void;
}) {
  const groups: HeaderRoleGroup[] = staffRole
    ? staffHeaderGroups(staffRole)
    : memberName
      ? [memberHeaderGroup]
      : [];

  if (groups.length === 0) return null;

  return (
    <div className="mt-2 border-t border-line pt-3">
      <p className="mb-2 text-[11px] font-semibold tracking-wide text-brand">
        {staffRole === "supervisor" ? "슈퍼바이저 메뉴" : staffRole ? "관리자 메뉴" : "회원 메뉴"}
      </p>
      {groups.map((group) => {
        const open = expanded === `role-${group.key}`;
        const isHomepage = group.key === "homepage";
        return (
          <div key={group.key} className="border-b border-line pb-2">
            <div className="flex items-center justify-between gap-2">
              {isAdminHref(group.href) ? (
                <a
                  href={group.href}
                  onClick={onClose}
                  className="text-[15px] font-medium text-brand-ink"
                >
                  {group.label}
                </a>
              ) : (
                <Link
                  href={group.href}
                  onClick={onClose}
                  className="text-[15px] font-medium text-brand-ink"
                >
                  {group.label}
                </Link>
              )}
              <button
                type="button"
                className="px-2 text-xs text-brand-ink/50"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : `role-${group.key}`)}
              >
                {open ? "−" : "+"}
              </button>
            </div>
            {open ? (
              <div
                className={`mt-2 border-l border-line pl-3 ${
                  isHomepage ? "grid grid-cols-2 gap-x-3 gap-y-1.5" : "flex flex-col gap-2"
                }`}
              >
                {group.links.map((link) =>
                  link.heading ? (
                    <p
                      key={`heading-${link.label}`}
                      className={`mt-2 text-[11px] font-semibold text-ink/45 first:mt-0 ${
                        isHomepage ? "col-span-2" : ""
                      }`}
                    >
                      {link.label}
                    </p>
                  ) : isAdminHref(link.href) ? (
                    <a
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      onClick={onClose}
                      className="text-[14px] text-brand-ink/75"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      onClick={onClose}
                      className="text-[14px] text-brand-ink/75"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
