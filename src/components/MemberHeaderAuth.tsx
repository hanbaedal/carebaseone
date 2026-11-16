"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { logoutMember } from "@/app/[locale]/member/actions";
import { unifiedLogoutStaff } from "@/app/[locale]/login/actions";
import { LOGIN_PATH } from "@/lib/login-path";

const iconClass = "h-[18px] w-[18px]";

function IconUser({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" d="M5 20c0-3.5 3.5-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path strokeLinecap="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

const textLinkClass =
  "hidden whitespace-nowrap text-[12px] font-medium text-brand-ink/55 hover:text-brand md:inline";

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-brand-ink/70 hover:border-brand/30 hover:text-brand md:hidden";

export function MemberHeaderAuth({
  memberName = null,
  staffRole = null,
}: {
  memberName?: string | null;
  staffRole?: "admin" | "supervisor" | null;
}) {
  const t = useTranslations("nav");
  const loggedIn = Boolean(memberName || staffRole);

  if (!loggedIn) {
    return (
      <>
        <a href={LOGIN_PATH} className={textLinkClass}>
          {t("login")}
        </a>
        <a
          href={LOGIN_PATH}
          className={iconButtonClass}
          aria-label={t("login")}
          title={t("login")}
        >
          <IconUser className={iconClass} />
        </a>
      </>
    );
  }

  const logoutAction = staffRole ? unifiedLogoutStaff : logoutMember;
  const roleHint = staffRole
    ? staffRole === "supervisor"
      ? "슈퍼바이저"
      : "관리자"
    : memberName;

  return (
    <>
      {staffRole ? (
        <a href="/admin" className={`${textLinkClass} md:inline`}>
          운영
        </a>
      ) : null}
      {memberName && !staffRole ? (
        <Link href="/member/profile" className={`${textLinkClass} md:inline max-w-[8rem] truncate`}>
          {memberName}
        </Link>
      ) : null}
      <span className="hidden text-[11px] text-brand-ink/40 md:inline" title={String(roleHint)}>
        {staffRole ? roleHint : null}
      </span>
      <form action={logoutAction} className="hidden md:inline">
        <button type="submit" className={`${textLinkClass} cursor-pointer`}>
          {t("logout")}
        </button>
      </form>
      <form action={logoutAction} className="md:hidden">
        <button
          type="submit"
          className={iconButtonClass}
          aria-label={t("logout")}
          title={t("logout")}
        >
          <IconLogout className={iconClass} />
        </button>
      </form>
    </>
  );
}
