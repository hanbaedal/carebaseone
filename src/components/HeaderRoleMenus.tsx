"use client";

import { Link } from "@/i18n/navigation";
import {
  memberHeaderGroup,
  staffHeaderGroups,
  type HeaderRoleGroup,
} from "@/lib/header-role-nav";
import type { Role } from "@/lib/session";

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

  return (
    <div className="group relative">
      {isAdminHref(topHref) ? (
        <a href={topHref} className={`inline-flex items-center gap-0.5 ${navLinkClass(false)}`}>
          {group.label}
          <span className="text-[10px] text-brand-ink/35" aria-hidden>
            ▾
          </span>
        </a>
      ) : (
        <Link href={topHref} className={`inline-flex items-center gap-0.5 ${navLinkClass(false)}`}>
          {group.label}
          <span className="text-[10px] text-brand-ink/35" aria-hidden>
            ▾
          </span>
        </Link>
      )}
      <div className="invisible absolute left-0 top-full z-50 min-w-[11rem] rounded-xl border border-line bg-white py-2 pt-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {group.links.map((link) =>
          isAdminHref(link.href) ? (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-[13px] text-brand-ink/80 hover:bg-brand/5 hover:text-brand"
              onClick={onNavigate}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-[13px] text-brand-ink/80 hover:bg-brand/5 hover:text-brand"
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          ),
        )}
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
              <div className="mt-2 flex flex-col gap-2 border-l border-line pl-3">
                {group.links.map((link) =>
                  isAdminHref(link.href) ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="text-[14px] text-brand-ink/75"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
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
