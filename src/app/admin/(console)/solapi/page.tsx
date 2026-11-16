import { requireStaffSession } from "@/lib/admin-access";

export const dynamic = "force-dynamic";

export default async function AdminSolapiPage() {
  await requireStaffSession();

  const hasKey = Boolean(process.env.SOLAPI_API_KEY);
  const hasSmtp = Boolean(process.env.SMTP_URL);

  return (
    <div className="grid gap-3">
      <h1 className="text-sm font-semibold">SOLAPI 관리</h1>
      <p className="text-[11px] leading-5 text-ink/50">
        SMS·알림톡·메일 발송은 관리자가 운영합니다. 키는 Render 환경 변수로 설정하며, 상세 이용량은
        솔라피 콘솔에서 확인합니다.
      </p>
      <ul className="grid gap-2 text-xs">
        <li className="border border-ink/10 bg-white px-3 py-2">
          SOLAPI_API_KEY: {hasKey ? "설정됨" : "미설정"}
        </li>
        <li className="border border-ink/10 bg-white px-3 py-2">
          KAKAO_ALIMTALK_KEY: {process.env.KAKAO_ALIMTALK_KEY ? "설정됨" : "미설정"}
        </li>
        <li className="border border-ink/10 bg-white px-3 py-2">
          SMTP_URL: {hasSmtp ? "설정됨" : "미설정"}
        </li>
      </ul>
    </div>
  );
}