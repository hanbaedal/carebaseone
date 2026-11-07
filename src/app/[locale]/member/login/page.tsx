import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { MemberLoginForm } from "@/components/member/MemberLoginForm";
import { getApprovedMember } from "@/lib/member-session";
import { kakaoAuthUrl, googleAuthUrl } from "@/lib/oauth";
import { siteUrl } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function MemberLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const member = await getApprovedMember();
  if (member) redirect("/store");

  const kakao = kakaoAuthUrl(siteUrl);
  const google = googleAuthUrl(siteUrl);

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl text-brand-ink">회원 로그인</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <MemberLoginForm />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {kakao ? (
          <a href={kakao} className="rounded-full border border-line px-4 py-2">
            카카오
          </a>
        ) : (
          <span className="text-brand-ink/45">카카오 (키 설정 후 사용)</span>
        )}
        {google ? (
          <a href={google} className="rounded-full border border-line px-4 py-2">
            Google
          </a>
        ) : (
          <span className="text-brand-ink/45">Google (키 설정 후 사용)</span>
        )}
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
