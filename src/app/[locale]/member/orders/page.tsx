import { redirect } from "next/navigation";
import { getApprovedMember } from "@/lib/member-session";
import { listOrdersForMember } from "@/lib/orders";
import { resolveLocale } from "@/lib/locale";

const labels: Record<string, string> = {
  received: "접수",
  preparing: "준비",
  shipped: "발송",
  done: "완료",
  cancelled: "취소",
};

export default async function MemberOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const member = await getApprovedMember();
  if (!member) redirect("/member/login");
  const orders = await listOrdersForMember(member.username);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-brand-ink">내 주문</h1>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {orders.map((order) => (
          <li key={order.orderNo} className="py-4 text-sm">
            <p className="font-semibold text-brand-ink">{order.orderNo}</p>
            <p className="mt-1 text-brand-ink/65">
              {order.items.map((i) => `${i.title} x${i.qty}`).join(", ")}
            </p>
            <p className="mt-1 text-brand-ink/50">
              {labels[order.status] ?? order.status} ·{" "}
              {new Date(order.createdAt).toLocaleString("ko-KR")}
            </p>
          </li>
        ))}
      </ul>
      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-brand-ink/55">주문 내역이 없습니다.</p>
      ) : null}
    </div>
  );
}
