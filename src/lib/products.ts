import catalog from "@/data/product-catalog.json";
import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { ensureIndexes, products } from "@/lib/db";
import { mongoCreated, mongoUpdated } from "@/lib/korea-time";

type CatalogLines = Record<string, { title: string; summary: string }>;

function lineTexts(slug: string) {
  const k = (ko.productCatalog.lines as CatalogLines)[slug];
  const e = (en.productCatalog.lines as CatalogLines)[slug];
  const z = (zh.productCatalog.lines as CatalogLines)[slug];
  return {
    title: { ko: k?.title ?? slug, en: e?.title ?? slug, zh: z?.title ?? slug },
    summary: {
      ko: k?.summary ?? "",
      en: e?.summary ?? "",
      zh: z?.summary ?? "",
    },
  };
}

const storeLines = catalog.lines.filter((line) =>
  ["patch", "beverage"].includes(line.category),
);

export async function ensureProductSeed() {
  await ensureIndexes();
  const col = await products();
  for (const item of storeLines) {
    const text = lineTexts(item.slug);
    const insert = mongoCreated();
    await col.updateOne(
      { slug: item.slug },
      {
        $set: {
          title: text.title,
          summary: text.summary,
          active: true,
          ...mongoUpdated(),
        },
        $setOnInsert: {
          price: 0,
          ...insert,
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
