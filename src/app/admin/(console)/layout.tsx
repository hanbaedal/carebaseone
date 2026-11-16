import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CmsLayoutGate } from "@/components/admin/CmsLayoutGate";
import { LOGIN_PATH } from "@/lib/login-path";
import { getCmsMessages } from "@/lib/content";
import { getApprovedMember } from "@/lib/member-session";
import { getSession, clearSession } from "@/lib/session";
import { getSiteBrand } from "@/lib/site-brand";
import { findUser } from "@/lib/users";
import type { AbstractIntlMessages } from "next-intl";

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);

  let user;
  try {
    user = await findUser(session.username);
  } catch {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 text-sm">
        데이터베이스에 연결할 수 없습니다.
      </main>
    );
  }
  if (!user || user.disabled) {
    await clearSession();
    redirect(LOGIN_PATH);
  }

  const brand = await getSiteBrand();
  setRequestLocale("ko");
  const messages = (await getCmsMessages("ko")) as AbstractIntlMessages;
  const member = await getApprovedMember();

  return (
    <CmsLayoutGate
      role={user.role}
      username={user.username}
      siteName={brand.siteName}
      tagline={brand.tagline}
      memberName={member?.name ?? null}
      staffRole={user.role}
      messages={messages}
    >
      {children}
    </CmsLayoutGate>
  );
}
