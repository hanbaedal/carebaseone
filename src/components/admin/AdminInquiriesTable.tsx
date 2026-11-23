import { removeInquiry } from "@/app/admin/ops-actions";
import { formatKoreaDate, formatKoreaDateTime } from "@/lib/korea-time";
import type { InquiryDoc } from "@/lib/db";

function excerpt(text: string, max = 140) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return "—";
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

type InquiryRow = InquiryDoc & { _id?: { toString(): string } };

export function AdminInquiriesTable({ items }: { items: InquiryRow[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-ink/55">접수된 문의가 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_40px_-18px_rgba(37,50,38,0.18)]">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-[#e8f2f8] text-[12px] font-semibold tracking-wide text-brand-ink/65">
            <th className="w-[4.5rem] px-4 py-3.5 text-center sm:w-20">번호</th>
            <th className="px-4 py-3.5">제목 · 핵심 내용</th>
            <th className="w-32 px-4 py-3.5 text-right">접수일</th>
            <th className="w-20 px-4 py-3.5 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => {
            const id = String(row._id);
            const displayNo = items.length - index;
            const title = [row.name, row.audience].filter(Boolean).join(" · ") || "문의";
            const meta = [row.email, row.organization, row.partnerType, row.country]
              .filter(Boolean)
              .join(" · ");
            const body = excerpt(row.message);

            return (
              <tr key={id} className="border-b border-line/80 last:border-0 align-top transition hover:bg-brand/[0.03]">
                <td className="px-4 py-4 text-center tabular-nums text-brand-ink/45">{displayNo}</td>
                <td className="px-4 py-4">
                  <div className="max-w-3xl space-y-1.5">
                    <p className="text-[15px] font-semibold leading-snug text-brand-ink sm:text-base">{title}</p>
                    {meta ? <p className="text-[12px] text-brand-ink/50">{meta}</p> : null}
                    <p className="text-[13px] leading-relaxed text-brand-ink/60">{body}</p>
                    <details className="pt-1">
                      <summary className="cursor-pointer text-[12px] font-medium text-brand hover:underline">
                        전체 내용
                      </summary>
                      <div className="mt-2 space-y-1 rounded-lg border border-line bg-paper/80 px-3 py-2 text-[12px] leading-relaxed text-brand-ink/75">
                        <p className="whitespace-pre-wrap">{row.message}</p>
                        <p className="pt-1 text-brand-ink/45">접수: {formatKoreaDateTime(row.createdAt)}</p>
                      </div>
                    </details>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-[13px] text-brand-ink/55">
                  {formatKoreaDate(row.createdAt)}
                </td>
                <td className="px-4 py-4 text-center">
                  <form action={removeInquiry}>
                    <input type="hidden" name="id" value={id} />
                    <button type="submit" className="text-xs text-red-800 hover:underline">
                      삭제
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}