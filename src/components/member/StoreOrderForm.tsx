"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/[locale]/member/actions";
import type { MemberPublic } from "@/lib/members";
import type { ProductDoc } from "@/lib/db";

export function StoreOrderForm({
  products,
  member,
}: {
  products: ProductDoc[];
  member: MemberPublic;
}) {
  const [state, action, pending] = useActionState(placeOrder, {});

  if (products.length === 0) {
    return <p className="mt-8 text-sm text-brand-ink/60">등록된 상품이 없습니다.</p>;
  }

  const shippingAddress = [member.zipcode, member.address, member.addressDetail]
    .filter(Boolean)
    .join(" ");

  return (
    <form action={action} className="mt-10 grid gap-4 rounded-2xl border border-line bg-white p-6">
      <label className="grid gap-1 text-sm">
        상품
        <select
          name="productSlug"
          required
          className="border border-line px-3 py-2"
          defaultValue={products[0]?.slug}
        >
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title.ko}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        수량
        <input name="qty" type="number" min={1} max={99} defaultValue={1} className="border border-line px-3 py-2" />
      </label>
      <input type="hidden" name="shippingName" value={member.name} />
      <input type="hidden" name="shippingPhone" value={member.phone} />
      <input type="hidden" name="shippingAddress" value={shippingAddress} />
      <label className="grid gap-1 text-sm">
        요청사항
        <textarea name="note" rows={3} className="border border-line px-3 py-2" defaultValue="" />
      </label>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="text-sm text-brand">주문을 접수했습니다.</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "접수 중…" : "주문 신청"}
      </button>
    </form>
  );
}
