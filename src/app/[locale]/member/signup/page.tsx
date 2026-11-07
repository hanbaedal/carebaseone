import { Link } from "@/i18n/navigation";
import { MemberSignupForm } from "@/components/member/MemberSignupForm";
import { resolveLocale } from "@/lib/locale";

export default async function MemberSignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-3xl text-brand-ink">회원가입</h1>
      <p className="mt-2 text-sm text-brand-ink/65">
        신청 후 관리자 승인이 필요합니다.
      </p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <MemberSignupForm />
      </div>
      <p className="mt-6 text-sm text-brand-ink/60">
        이미 계정이 있으신가요?{" "}
        <Link href="/member/login" className="text-brand">
          로그인
        </Link>
      </p>
    </div>
  );
}
