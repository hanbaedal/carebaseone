import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
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
      <AdminNav
        role={user.role}
        username={user.username}
        siteName={brand.siteName}
        tagline={brand.tagline}
      />
      <div className="mx-auto max-w-5xl px-3 py-4">{children}</div>
    </div>
  );
}
