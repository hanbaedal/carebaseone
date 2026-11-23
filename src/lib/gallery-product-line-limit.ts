import { ensureIndexes, media, type MediaDoc } from "@/lib/db";
import { galleryFileMissing } from "@/lib/gallery-thumb-src";
import {
  PRODUCT_LINE_LABELS,
  PRODUCT_LINES_PER_CATEGORY,
  type MediaProductLines,
} from "@/lib/media-product-lines";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";

function countsForProductLine(docs: MediaDoc[], category: ProductLineCategory) {
  return docs.filter((d) => {
    if (!d.published) return false;
    if (galleryFileMissing(d)) return false;
    return Boolean(d.channels?.productLines?.[category]);
  });
}

export async function countProductLinePublished(
  category: ProductLineCategory,
  excludeSlug?: string,
) {
  if (!process.env.MONGODB_URI) return 0;
  await ensureIndexes();
  const col = await media();
  const filter: Record<string, unknown> = {
    category: "gallery",
    published: true,
    [`channels.productLines.${category}`]: true,
  };
  const docs = (await col.find(filter).toArray()) as MediaDoc[];
  const eligible = countsForProductLine(docs, category);
  if (!excludeSlug) return eligible.length;
  return eligible.filter((d) => d.slug !== excludeSlug).length;
}

/** 파일 없음·초과 슬롯 보정 — 제품 라인은 실제 노출 가능한 2장만 유지 */
export async function repairProductLineSlots() {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const imageDocs = (await col
    .find({
      category: "gallery",
      published: true,
      $or: PRODUCT_LINE_CATEGORIES.map((key) => ({
        [`channels.productLines.${key}`]: true,
      })),
    })
    .sort({ updatedAt: -1 })
    .toArray()) as MediaDoc[];

  const { resolveMediaChannels } = await import("@/lib/media-channels");
  const { emptyProductLines, resolveProductLines } = await import("@/lib/media-product-lines");

  for (const doc of imageDocs) {
    if (!galleryFileMissing(doc)) continue;
    const ch = resolveMediaChannels(doc);
    const lines = emptyProductLines();
    let cleared = false;
    for (const key of PRODUCT_LINE_CATEGORIES) {
      if (resolveProductLines(ch)[key]) cleared = true;
    }
    if (!cleared) continue;
    await col.updateOne(
      { slug: doc.slug },
      {
        $set: {
          channels: { ...ch, productLines: emptyProductLines() },
        },
      },
    );
  }

  for (const category of PRODUCT_LINE_CATEGORIES) {
    const fresh = (await col
      .find({
        category: "gallery",
        published: true,
        [`channels.productLines.${category}`]: true,
      })
      .toArray()) as MediaDoc[];
    const eligible = countsForProductLine(fresh, category).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
    const overflow = eligible.slice(PRODUCT_LINES_PER_CATEGORY);
    for (const doc of overflow) {
      const hit = await col.findOne({ slug: doc.slug });
      if (!hit) continue;
      const ch = resolveMediaChannels(hit);
      const lines = { ...resolveProductLines(ch), [category]: false };
      await col.updateOne(
        { slug: doc.slug },
        { $set: { channels: { ...ch, productLines: lines } } },
      );
    }
  }
}

export async function validateProductLineToggle(
  slug: string,
  nextLines: MediaProductLines,
  published: boolean,
): Promise<string | null> {
  if (!published) return null;
  for (const category of PRODUCT_LINE_CATEGORIES) {
    if (!nextLines[category]) continue;
    const count = await countProductLinePublished(category, slug);
    if (count >= PRODUCT_LINES_PER_CATEGORY) {
      return `「${PRODUCT_LINE_LABELS[category]}」 라인은 게시 중인 제품 사진이 이미 ${PRODUCT_LINES_PER_CATEGORY}장입니다. 다른 사진의 체크를 해제한 뒤 저장해 주세요.`;
    }
  }
  return null;
}

export async function productLineSlotUsage(): Promise<Record<ProductLineCategory, { used: number; max: number }>> {
  const out = {} as Record<ProductLineCategory, { used: number; max: number }>;
  for (const key of PRODUCT_LINE_CATEGORIES) {
    const used = await countProductLinePublished(key);
    out[key] = { used, max: PRODUCT_LINES_PER_CATEGORY };
  }
  return out;
}