import { listMembers } from "@/lib/members";
import { manageMember } from "@/app/admin/ops-actions";

export const dynamic = "force-dynamic";

const tiers = ["general", "silver", "gold", "vip", "vvip"] as const;

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const pending = await listMembers({ status: "pending" });
  const all = await listMembers();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-sm">회원 관리</h1>
        {query.status === "saved" ? (
          <p className="mt-1 text-xs text-forest">반영했습니다.</p>
        ) : null}
      </div>
      <section>
        <h2 className="text-xs font-semibold">가입 신청 ({pending.length})</h2>
        <div className="mt-2 overflow-x-auto border border-ink/10 bg-white text-xs">
          <table className="w-full min-w-[40rem]">
            <tbody>
              {pending.map((m) => (
                <tr key={m.username} className="border-t border-ink/10">
                  <td className="px-2 py-2">{m.username}</td>
                  <td className="px-2 py-2">{m.name}</td>
                  <td className="px-2 py-2">{m.phone}</td>
                  <td className="px-2 py-2">
                    <form action={manageMember} className="flex flex-wrap items-center gap-1">
                      <input type="hidden" name="username" value={m.username} />
                      <select name="tier" defaultValue="general" className="border border-ink/15 px-1 py-0.5">
                        {tiers.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button name="intent" value="approve" className="text-forest">
                        승인
                      </button>
                      <button name="intent" value="hold" className="text-ink/60">
                        보류
                      </button>
                      <button name="intent" value="delete" className="text-red-800">
                        삭제
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xs font-semibold">전체 회원</h2>
        <div className="mt-2 overflow-x-auto border border-ink/10 bg-white text-xs">
          <table className="w-full min-w-[40rem]">
            <tbody>
              {all.map((m) => (
                <tr key={m.username} className="border-t border-ink/10">
                  <td className="px-2 py-2">{m.username}</td>
                  <td className="px-2 py-2">{m.status}</td>
                  <td className="px-2 py-2">{m.tier}</td>
                  <td className="px-2 py-2">{m.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
