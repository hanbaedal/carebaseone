import { redirect } from "next/navigation";
import { AdminBrand } from "@/components/admin/AdminBrand";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/session";
import { getSiteBrand } from "@/lib/site-brand";
import { bootstrapStaffIfEmpty } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  let configHint: string | null = null;
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    configHint = "SESSION_SECRET(32자 이상)이 서버에 설정되어야 로그인할 수 있습니다.";
  } else if (!process.env.MONGODB_URI) {
    configHint = "MONGODB_URI가 서버에 설정되어야 로그인할 수 있습니다.";
  } else {
    try {
      await bootstrapStaffIfEmpty();
      const hasSeed =
        Boolean(process.env.SEED_ADMIN_USERNAME) || Boolean(process.env.SEED_SUPERVISOR_USERNAME);
      if (!hasSeed) {
        configHint =
          "최초 관리자 계정용 SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD 환경 변수를 설정한 뒤 배포해 주세요.";
      }
    } catch {
      configHint = "데이터베이스에 연결할 수 없습니다. MONGODB_URI를 확인해 주세요.";
    }
  }

  const brand = await getSiteBrand();

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-8">
      <AdminBrand siteName={brand.siteName} tagline={brand.tagline} />
      <h1 className="mt-6 text-lg">홈페이지 관리 로그인</h1>
      <p className="mt-2 text-xs leading-5 text-ink/60">
        운영자·관리자(xinxinedu, 슈퍼바이저) 전용입니다. 상단 「회원」로그인과 다릅니다.
      </p>
      {configHint ? (
        <p className="mt-3 text-xs leading-5 text-red-800">{configHint}</p>
      ) : null}
      <div className="mt-4 border border-ink/10 bg-white p-4">
        <LoginForm />
      </div>
    </main>
  );
}
