import { listInquiries } from "@/lib/inquiries";
import { removeInquiry } from "@/app/admin/ops-actions";
import { formatKoreaDateTime } from "@/lib/korea-time";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const rows = await listInquiries();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm">문의</h1>
        {query.status === "saved" ? (
          <p className="mt-1 text-xs text-forest">삭제했습니다.</p>
        ) : null}
      </div>
      <div className="overflow-x-auto border border-ink/10 bg-white text-xs">
        <table className="w-full min-w-[48rem]">
          <thead>
            <tr className="text-ink/50">
              <th className="px-2 py-2 text-left font-normal">일시</th>
              <th className="px-2 py-2 text-left font-normal">유형</th>
              <th className="px-2 py-2 text-left font-normal">이름</th>
              <th className="px-2 py-2 text-left font-normal">이메일</th>
              <th className="px-2 py-2 text-left font-normal">내용</th>
              <th className="px-2 py-2 text-left font-normal">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row._id)} className="border-t border-ink/10 align-top">
                <td className="whitespace-nowrap px-2 py-2">{formatKoreaDateTime(row.createdAt)}</td>
                <td className="px-2 py-2">{row.audience}</td>
                <td className="px-2 py-2">{row.name}</td>
                <td className="px-2 py-2">{row.email}</td>
                <td className="max-w-xs px-2 py-2">
                  <p className="line-clamp-4 whitespace-pre-wrap">{row.message}</p>
                  {row.organization ? (
                    <p className="mt-1 text-ink/50">{row.organization}</p>
                  ) : null}
                </td>
                <td className="px-2 py-2">
                  <form action={removeInquiry}>
                    <input type="hidden" name="id" value={String(row._id)} />
                    <button className="text-red-800">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-3 py-6 text-ink/50">접수된 문의가 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}
