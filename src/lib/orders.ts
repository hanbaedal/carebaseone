import { randomBytes } from "node:crypto";
import { ensureIndexes, orders, type OrderStatus } from "@/lib/db";
import { listActiveProducts, ensureProductSeed } from "@/lib/products";

function orderNo() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `CB${stamp}${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createOrder(input: {
  memberUsername: string;
  productSlug: string;
  qty: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
}) {
  await ensureProductSeed();
  const product = (await listActiveProducts()).find((p) => p.slug === input.productSlug);
  if (!product) return "상품을 찾을 수 없습니다.";
  const qty = Math.max(1, Math.min(99, input.qty));
  const price = product.price;
  const total = price * qty;
  const now = new Date();
  await ensureIndexes();
  await (await orders()).insertOne({
    orderNo: orderNo(),
    memberUsername: input.memberUsername,
    items: [
      {
        productSlug: product.slug,
        title: product.title.ko,
        qty,
        price,
      },
    ],
    total,
    status: "received",
    shippingName: input.shippingName.trim(),
    shippingPhone: input.shippingPhone.trim(),
    shippingAddress: input.shippingAddress.trim(),
    note: input.note.trim(),
    createdAt: now,
    updatedAt: now,
  });
  return null;
}

export async function listOrdersForMember(username: string) {
  await ensureIndexes();
  return (await orders())
    .find({ memberUsername: username })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function listAllOrders() {
  await ensureIndexes();
  return (await orders()).find({}).sort({ createdAt: -1 }).toArray();
}

export async function updateOrderStatus(orderNo: string, status: string) {
  await ensureIndexes();
  const allowed: OrderStatus[] = ["received", "preparing", "shipped", "done", "cancelled"];
  if (!allowed.includes(status as OrderStatus)) return "상태값이 올바르지 않습니다.";
  await (await orders()).updateOne(
    { orderNo },
    { $set: { status: status as OrderStatus, updatedAt: new Date() } },
  );
  return null;
}
