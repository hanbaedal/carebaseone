import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-8">
      <p className="text-[11px] tracking-[0.16em] text-forest">CAREBASE</p>
      <h1 className="mt-1 text-lg">관리 로그인</h1>
      <div className="mt-4 border border-ink/10 bg-white p-4">
        <LoginForm />
      </div>
    </main>
  );
}
