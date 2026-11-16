import { redirect } from "next/navigation";
import { AdminConsoleFrame } from "@/components/admin/AdminConsoleFrame";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { LOGIN_PATH } from "@/lib/login-path";
import { getSession, clearSession } from "@/lib/session";
import { getSiteBrand } from "@/lib/site-brand";
import { findUser } from "@/lib/users";

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

  return (
    <div className="min-h-full">
      <AdminTopBar
        role={user.role}
        username={user.username}
        siteName={brand.siteName}
        tagline={brand.tagline}
      />
      <AdminConsoleFrame role={user.role}>{children}</AdminConsoleFrame>
    </div>
  );
}
