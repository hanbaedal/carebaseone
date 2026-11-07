import { getCollection } from "@/lib/mongodb";

const collections = [
  "users",
  "members",
  "posts",
  "media",
  "orders",
  "contents",
  "pageviews",
  "activity",
  "inquiries",
  "products",
] as const;

export async function getDbCollectionCounts() {
  const rows: { name: string; count: number }[] = [];
  for (const name of collections) {
    const col = await getCollection(name);
    rows.push({ name, count: await col.countDocuments({}) });
  }
  return rows;
}
