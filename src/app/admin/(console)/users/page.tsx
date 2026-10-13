import { redirect } from "next/navigation";
import { manageUser } from "@/app/admin/actions";
import { getSession } from "@/lib/session";
import { listUsers } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const session = await getSession();
  if (session?.role !== "supervisor") redirect("/admin");

  const query = await searchParams;
  const accounts = await listUsers();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm">관리자 계정</h1>
        <p className="mt-1 text-[11px] text-ink/50">
          슈퍼바이저만 관리자 아이디를 만들 수 있습니다.
        </p>
        {query.message ? (
          <p className="mt-2 text-xs text-red-800">{query.message}</p>
        ) : null}
        {query.status === "saved" ? (
          <p className="mt-2 text-xs text-forest">계정을 저장했습니다.</p>
        ) : null}
      </div>

      <form
        action={manageUser}
        className="grid gap-2 border border-ink/10 bg-white p-3 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <input type="hidden" name="intent" value="create" />
        <label className="grid gap-1 text-[11px]">
          아이디
          <input
            name="username"
            required
            className="border border-ink/15 px-2 py-1.5 text-sm outline-none focus:border-forest"
          />
        </label>
        <label className="grid gap-1 text-[11px]">
          비밀번호
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="border border-ink/15 px-2 py-1.5 text-sm outline-none focus:border-forest"
          />
        </label>
        <button className="bg-forest px-3 py-2 text-xs text-cream">만들기</button>
      </form>

      <div className="overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[32rem] text-left text-xs">
          <thead className="text-[11px] text-ink/50">
            <tr>
              <th className="px-2 py-2 font-normal">아이디</th>
              <th className="px-2 py-2 font-normal">권한</th>
              <th className="px-2 py-2 font-normal">상태</th>
              <th className="px-2 py-2 font-normal">관리</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.username} className="border-t border-ink/10">
                <td className="px-2 py-2">{account.username}</td>
                <td className="px-2 py-2">
                  {account.role === "supervisor" ? "슈퍼바이저" : "관리자"}
                </td>
                <td className="px-2 py-2">{account.disabled ? "중지" : "사용"}</td>
                <td className="px-2 py-2">
                  {account.role === "admin" ? (
                    <form action={manageUser} className="flex flex-wrap items-center gap-1">
                      <input type="hidden" name="username" value={account.username} />
                      <input
                        name="password"
                        type="password"
                        placeholder="새 비밀번호"
                        className="w-28 border border-ink/15 px-1.5 py-1 text-[11px] outline-none focus:border-forest"
                      />
                      <button
                        name="intent"
                        value={account.disabled ? "enable" : "disable"}
                        className="border border-ink/15 px-1.5 py-1"
                      >
                        {account.disabled ? "복구" : "중지"}
                      </button>
                      <button name="intent" value="password" className="px-1.5 py-1 text-forest">
                        변경
                      </button>
                    </form>
                  ) : (
                    <span className="text-ink/40">기본 계정</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
