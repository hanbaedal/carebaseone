import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { clearSession, getSession } from "@/lib/session";
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

  return (
    <div className="min-h-full">
      <AdminNav role={user.role} username={user.username} />
      <div className="mx-auto max-w-5xl px-3 py-4">{children}</div>
    </div>
  );
}
