import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SolapiStatsPage() {
  const session = await getSession();
  if (session?.role !== "supervisor") redirect("/admin/site");

  const hasKey = Boolean(process.env.SOLAPI_API_KEY);
  const hasSmtp = Boolean(process.env.SMTP_URL);

  return (
    <div className="grid gap-3">
      <h1 className="text-sm">SOLAPI · 알림 이용 현황</h1>
      <p className="text-[11px] leading-5 text-ink/50">
        Render 환경 변수 기준입니다. SMS·알림톡·메일 API 연동 후 이용량은 SOLAPI·솔라피 콘솔에서
        확인합니다.
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
