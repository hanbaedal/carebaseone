import { redirect } from "next/navigation";
import { getDbCollectionCounts } from "@/lib/db-stats";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DbStatsPage() {
  const session = await getSession();
  if (session?.role !== "supervisor") redirect("/admin/site");

  const rows = await getDbCollectionCounts();

  return (
    <div className="grid gap-3">
      <h1 className="text-sm">디비사용 통계</h1>
      <p className="text-[11px] text-ink/50">MongoDB carebaseone 컬렉션별 문서 수입니다.</p>
      <div className="overflow-x-auto border border-ink/10 bg-white text-xs">
        <table className="w-full min-w-[16rem]">
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-ink/10">
                <td className="px-3 py-2 font-medium">{row.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
