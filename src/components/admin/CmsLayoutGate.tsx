"use client";

import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { AdminConsoleFrame } from "@/components/admin/AdminConsoleFrame";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { SiteHeader } from "@/components/SiteHeader";
import type { Role } from "@/lib/session";
import type { AbstractIntlMessages } from "next-intl";
import { isHomepageAdminPath } from "@/lib/homepage-admin-paths";

export function CmsLayoutGate({
  children,
  role,
  username,
  siteName,
  tagline,
  memberName,
  staffRole,
  messages,
}: {
  children: React.ReactNode;
  role: Role;
  username: string;
  siteName: string;
  tagline?: string;
  memberName: string | null;
  staffRole: Role | null;
  messages: AbstractIntlMessages;
}) {
  const pathname = usePathname() ?? "";

  if (isHomepageAdminPath(pathname)) {
    return (
      <NextIntlClientProvider locale="ko" messages={messages}>
        <div className="flex min-h-dvh flex-col bg-paper text-brand-ink">
          <SiteHeader memberName={memberName} staffRole={staffRole} />
          <main className="flex-1">{children}</main>
        </div>
      </NextIntlClientProvider>
    );
  }

  return (
    <div className="min-h-full">
      <AdminTopBar role={role} username={username} siteName={siteName} tagline={tagline} />
      <AdminConsoleFrame role={role}>{children}</AdminConsoleFrame>
    </div>
  );
}