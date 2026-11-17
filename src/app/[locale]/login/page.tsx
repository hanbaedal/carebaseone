import { redirect, Link } from "@/i18n/navigation";
import { UnifiedLoginForm } from "@/components/UnifiedLoginForm";
import { getApprovedMember } from "@/lib/member-session";
import { getSession } from "@/lib/session";
import { kakaoAuthUrl, googleAuthUrl } from "@/lib/oauth";
import { siteUrl } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function UnifiedLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ oauth?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const loc = resolveLocale(locale);

  const staff = await getSession();
  const member = await getApprovedMember();
  if (staff || member) redirect({ href: "/sitemap", locale: loc });

  const kakao = kakaoAuthUrl(siteUrl);
  const google = googleAuthUrl(siteUrl);

  const oauthMsg =
    query.oauth === "pending"
      ? "소셜 가입이 접수되었습니다. 관리자 승인 후 로그인해 주세요."
      : query.oauth === "error"
        ? "소셜 로그인에 실패했습니다."
        : null;

  return (
    <div className="mx-auto max-w-md px-guest-gutter py-16">
      <h1 className="font-display text-3xl text-brand-ink">로그인</h1>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink/60">
        회원·관리자·슈퍼바이저 모두 이 화면에서 로그인합니다. 운영자 계정을 먼저 확인한 뒤 회원
        계정을 조회합니다.
      </p>
      {oauthMsg ? <p className="mt-3 text-sm text-brand">{oauthMsg}</p> : null}
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <UnifiedLoginForm />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {kakao ? (
          <a href={kakao} className="rounded-full border border-line px-4 py-2">
            카카오
          </a>
        ) : null}
        {google ? (
          <a href={google} className="rounded-full border border-line px-4 py-2">
            Google
          </a>
        ) : null}
      </div>
      <p className="mt-6 text-sm text-brand-ink/60">
        계정이 없으신가요?{" "}
        <Link href="/member/signup" className="text-brand">
          회원가입
        </Link>
      </p>
    </div>
  );
}