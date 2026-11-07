import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
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
  if (!session) redirect("/admin/login");

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
    redirect("/admin/login");
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
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 lg:flex-row">
        <Suspense fallback={<aside className="hidden lg:block lg:w-44" />}>
          <AdminSidebar role={user.role} />
        </Suspense>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
