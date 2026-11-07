import { listAllOrders } from "@/lib/orders";
import { updateOrder } from "@/app/admin/ops-actions";

export const dynamic = "force-dynamic";

const statuses = ["received", "preparing", "shipped", "done", "cancelled"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const orders = await listAllOrders();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm">주문 관리</h1>
        {query.status === "saved" ? (
          <p className="mt-1 text-xs text-forest">저장했습니다.</p>
        ) : null}
      </div>
      <div className="overflow-x-auto border border-ink/10 bg-white text-xs">
        <table className="w-full min-w-[48rem]">
          <thead>
            <tr className="text-ink/50">
              <th className="px-2 py-2 text-left font-normal">주문번호</th>
              <th className="px-2 py-2 text-left font-normal">회원</th>
              <th className="px-2 py-2 text-left font-normal">내용</th>
              <th className="px-2 py-2 text-left font-normal">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNo} className="border-t border-ink/10">
                <td className="px-2 py-2">{order.orderNo}</td>
                <td className="px-2 py-2">{order.memberUsername}</td>
                <td className="px-2 py-2">
                  {order.items.map((i) => `${i.title}x${i.qty}`).join(", ")}
                </td>
                <td className="px-2 py-2">
                  <form action={updateOrder} className="flex items-center gap-1">
                    <input type="hidden" name="orderNo" value={order.orderNo} />
                    <select name="status" defaultValue={order.status} className="border border-ink/15 px-1">
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button className="text-forest">변경</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
