import { redirect } from "next/navigation";
import { getApprovedMember } from "@/lib/member-session";
import { MemberProfileForm } from "@/components/member/MemberProfileForm";
import { resolveLocale } from "@/lib/locale";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const member = await getApprovedMember();
  if (!member) redirect("/member/login");

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-3xl text-brand-ink">회원 정보</h1>
      <p className="mt-2 text-sm text-brand-ink/60">
        이름·아이디는 변경할 수 없습니다.
      </p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <MemberProfileForm member={member} />
      </div>
    </div>
  );
}
