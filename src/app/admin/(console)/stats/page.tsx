import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDashboard } from "@/lib/stats";

export const dynamic = "force-dynamic";

const actionLabel = {
  login: "로그인",
  "login-failed": "로그인 실패",
  "save-content": "내용 저장",
  "create-admin": "관리자 생성",
  "update-admin": "관리자 수정",
} as const;

function countOf(rows: { _id: string; count: number }[], id: string) {
  return rows.find((row) => row._id === id)?.count ?? 0;
}

export default async function StatsPage() {
  const session = await getSession();
  if (session?.role !== "supervisor") redirect("/admin");

  const stats = await getDashboard();
  const peak = Math.max(...stats.daily.map((row) => row.count), 1);

  return (
    <div className="grid gap-4">
      <h1 className="text-sm">접속 통계</h1>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          ["오늘 일반", stats.guestToday],
          ["7일 일반", stats.guestWeek],
          ["오늘 관리자 로그인", stats.loginsToday],
          ["7일 관리자 열람", stats.staffWeek],
        ].map(([label, value]) => (
          <div key={label} className="border border-ink/10 bg-white px-3 py-2">
            <p className="text-[11px] text-ink/50">{label}</p>
            <p className="text-lg">{value}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="border border-ink/10 bg-white p-3">
          <h2 className="text-xs">일반 방문</h2>
          <p className="mt-2 text-[11px] text-ink/60">
            한국어 {countOf(stats.byLocale, "ko")} · English{" "}
            {countOf(stats.byLocale, "en")} · 中文 {countOf(stats.byLocale, "zh")}
          </p>
          <p className="text-[11px] text-ink/60">
            PC {countOf(stats.byDevice, "pc")} · 모바일 {countOf(stats.byDevice, "mobile")}
          </p>
          <div className="mt-3 grid gap-1">
            {stats.daily.map((row) => (
              <div key={row._id} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2 text-[11px]">
                <span>{row._id}</span>
                <span className="h-1.5 bg-mist">
                  <span
                    className="block h-1.5 bg-forest"
                    style={{ width: `${Math.max(4, (row.count / peak) * 100)}%` }}
                  />
                </span>
                <span className="text-right">{row.count}</span>
              </div>
            ))}
          </div>
          <ul className="mt-3 grid gap-1 text-[11px]">
            {stats.topPages.map((row) => (
              <li key={row._id} className="flex justify-between gap-3">
                <span className="truncate">{row._id}</span>
                <span>{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-ink/10 bg-white p-3">
          <h2 className="text-xs">관리자 활동</h2>
          <ul className="mt-2 grid gap-2">
            {stats.recent.map((item) => (
              <li key={`${item.createdAt.toISOString()}-${item.username}-${item.action}`} className="text-[11px] leading-5">
                <span className="text-ink/45">
                  {item.createdAt.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
                </span>
                <br />
                {item.username} · {actionLabel[item.action]}
                {item.detail ? ` · ${item.detail}` : ""}
              </li>
            ))}
            {stats.recent.length === 0 ? (
              <li className="text-[11px] text-ink/45">아직 기록이 없습니다.</li>
            ) : null}
          </ul>
        </div>
      </section>
    </div>
  );
}
