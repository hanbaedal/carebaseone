import catalog from "@/data/product-catalog.json";
import { ensureIndexes, products } from "@/lib/db";

function emptyLocale(text: string) {
  return { ko: text, en: text, zh: text };
}

const storeLines = catalog.lines.filter((line) =>
  ["patch", "beverage"].includes(line.category),
);

export async function ensureProductSeed() {
  await ensureIndexes();
  const col = await products();
  const now = new Date();
  for (const item of storeLines) {
    await col.updateOne(
      { slug: item.slug },
      {
        $set: {
          title: emptyLocale(item.titleKo),
          summary: emptyLocale(item.summaryKo),
          active: true,
          updatedAt: now,
        },
        $setOnInsert: {
          price: 0,
          createdAt: now,
        },
      },
      { upsert: true },
    );
  }
}

export async function listActiveProducts() {
  await ensureProductSeed();
  return (await products()).find({ active: true }).sort({ createdAt: 1 }).toArray();
}

export async function listAllProducts() {
  await ensureProductSeed();
  return (await products()).find({}).sort({ createdAt: 1 }).toArray();
}
