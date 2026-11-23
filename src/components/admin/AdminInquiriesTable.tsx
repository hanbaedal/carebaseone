import { removeInquiry, removeInquiryReply, saveInquiryReply } from "@/app/admin/ops-actions";
import { formatKoreaDate, formatKoreaDateTime } from "@/lib/korea-time";
import type { InquiryDoc, InquiryReply } from "@/lib/db";

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
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-[#e8f2f8] text-[12px] font-semibold tracking-wide text-brand-ink/65">
            <th className="w-[4.5rem] px-4 py-3.5 text-center sm:w-20">번호</th>
            <th className="px-4 py-3.5">제목 · 핵심 내용</th>
            <th className="w-24 px-4 py-3.5 text-center">상태</th>
            <th className="w-32 px-4 py-3.5 text-right">접수일</th>
            <th className="w-20 px-4 py-3.5 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => {
            const id = String(row._id);
            const displayNo = items.length - index;
            const replies = row.replies ?? [];
            const title = [row.name, row.audience].filter(Boolean).join(" · ") || "문의";
            const meta = [row.email, row.organization, row.partnerType, row.country]
              .filter(Boolean)
              .join(" · ");
            const body = excerpt(row.message);
            const answered = replies.length > 0;

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
                        문의·답변 관리 ({replies.length}건)
                      </summary>
                      <div className="mt-2 space-y-3 rounded-lg border border-line bg-paper/80 px-3 py-3 text-[12px] leading-relaxed text-brand-ink/75">
                        <div>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">문의 내용</p>
                          <p className="whitespace-pre-wrap text-[13px] text-brand-ink/80">{row.message}</p>
                          <p className="pt-1 text-brand-ink/45">접수: {formatKoreaDateTime(row.createdAt)}</p>
                        </div>

                        <div className="space-y-2 border-t border-line pt-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink/45">답변</p>
                          {replies.length === 0 ? (
                            <p className="text-brand-ink/50">아직 등록된 답변이 없습니다.</p>
                          ) : (
                            replies.map((reply) => (
                              <ReplyEditor key={reply.id} inquiryId={id} reply={reply} />
                            ))
                          )}
                        </div>

                        <form action={saveInquiryReply} className="space-y-2 border-t border-line pt-3">
                          <input type="hidden" name="inquiryId" value={id} />
                          <label className="block text-[11px] font-semibold text-brand-ink/55">새 답변 등록</label>
                          <textarea
                            name="body"
                            required
                            rows={3}
                            placeholder="답변 내용을 입력하세요"
                            className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-[13px] text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                          />
                          <button
                            type="submit"
                            className="rounded bg-forest px-3 py-1.5 text-xs text-cream hover:opacity-90"
                          >
                            답변 등록
                          </button>
                        </form>
                      </div>
                    </details>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {answered ? (
                    <span className="inline-block rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      답변 {replies.length}
                    </span>
                  ) : (
                    <span className="inline-block rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                      미답변
                    </span>
                  )}
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

function ReplyEditor({ inquiryId, reply }: { inquiryId: string; reply: InquiryReply }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <form action={saveInquiryReply} className="space-y-2">
        <input type="hidden" name="inquiryId" value={inquiryId} />
        <input type="hidden" name="replyId" value={reply.id} />
        <textarea
          name="body"
          required
          rows={3}
          defaultValue={reply.body}
          className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-[13px] text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-brand-ink/45">
            {reply.createdBy} · {formatKoreaDateTime(reply.createdAt)}
            {reply.updatedAt ? ` · 수정 ${formatKoreaDateTime(reply.updatedAt)}` : ""}
          </p>
          <div className="flex gap-2">
            <button type="submit" className="rounded border border-ink/15 px-2.5 py-1 text-[11px] hover:bg-ink/5">
              수정 저장
            </button>
          </div>
        </div>
      </form>
      <form action={removeInquiryReply} className="mt-2">
        <input type="hidden" name="inquiryId" value={inquiryId} />
        <input type="hidden" name="replyId" value={reply.id} />
        <button type="submit" className="text-[11px] text-red-800 hover:underline">
          답변 삭제
        </button>
      </form>
    </div>
  );
}