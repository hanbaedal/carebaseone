import { listInquiries } from "@/lib/inquiries";
import { removeInquiry } from "@/app/admin/ops-actions";
import { formatKoreaDateTime } from "@/lib/korea-time";
import { HomepageOpsShell, OpsSection } from "@/components/admin/HomepageOpsShell";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const rows = await listInquiries();
  const statusMsg = query.status === "saved" ? "삭제했습니다." : undefined;

  return (
    <HomepageOpsShell
      title="문의 접수"
      description="사이트 문의 폼으로 들어온 내용 목록 · 삭제. 문의 페이지 안내 문구는 CMS 「문의 페이지」에서 수정합니다."
      status={statusMsg}
    >
      <OpsSection title={`목록 (${rows.length}건)`}>
        <div className="overflow-x-auto text-xs">
          <table className="w-full min-w-[48rem]">
            <thead>
              <tr className="text-ink/50">
                <th className="px-2 py-2 text-left font-normal">일시</th>
                <th className="px-2 py-2 text-left font-normal">유형</th>
                <th className="px-2 py-2 text-left font-normal">이름</th>
                <th className="px-2 py-2 text-left font-normal">이메일</th>
                <th className="px-2 py-2 text-left font-normal">내용</th>
                <th className="px-2 py-2 text-left font-normal">삭제</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row._id)} className="border-t border-ink/10 align-top">
                  <td className="whitespace-nowrap px-2 py-2">{formatKoreaDateTime(row.createdAt)}</td>
                  <td className="px-2 py-2">{row.audience}</td>
                  <td className="px-2 py-2">{row.name}</td>
                  <td className="px-2 py-2">{row.email}</td>
                  <td className="max-w-xs px-2 py-2 whitespace-pre-wrap">{row.message}</td>
                  <td className="px-2 py-2">
                    <form action={removeInquiry}>
                      <input type="hidden" name="id" value={String(row._id)} />
                      <button type="submit" className="text-red-800">
                        삭제
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OpsSection>
    </HomepageOpsShell>
  );
}