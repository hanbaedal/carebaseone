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

/**
 * 저장 시 라인당 2장 유지 — 슬롯이 찼으면 다른 사진(가장 오래된 순)에서 라인 체크 해제.
 * 반환: 해제된 사진 제목 목록
 */
export async function reclaimProductLineSlotsForSave(
  slug: string,
  nextLines: MediaProductLines,
  published: boolean,
): Promise<{ titles: string[]; lines: string[] }> {
  const titles: string[] = [];
  const lines: string[] = [];
  if (!published || !process.env.MONGODB_URI) return { titles, lines };

  await ensureIndexes();
  const col = await media();
  const { resolveMediaChannels } = await import("@/lib/media-channels");
  const { resolveProductLines } = await import("@/lib/media-product-lines");
  const { mongoUpdated } = await import("@/lib/korea-time");

  for (const category of PRODUCT_LINE_CATEGORIES) {
    if (!nextLines[category]) continue;

    const others = (await col
      .find({
        category: "gallery",
        published: true,
        [`channels.productLines.${category}`]: true,
        slug: { $ne: slug },
      })
      .toArray()) as MediaDoc[];

    const eligible = countsForProductLine(others, category).sort(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    );
    const maxOthers = PRODUCT_LINES_PER_CATEGORY - 1;
    const excess = eligible.length - maxOthers;
    if (excess <= 0) continue;

    const victims = eligible.slice(0, excess);
    for (const doc of victims) {
      const hit = await col.findOne({ slug: doc.slug });
      if (!hit) continue;
      const ch = resolveMediaChannels(hit);
      const merged = { ...resolveProductLines(ch), [category]: false };
      await col.updateOne(
        { slug: doc.slug },
        { $set: { channels: { ...ch, productLines: merged }, ...mongoUpdated() } },
      );
      titles.push(hit.title.ko?.trim() || doc.slug);
      lines.push(PRODUCT_LINE_LABELS[category]);
    }
  }

  return { titles, lines };
}

export async function productLineSlotUsage(): Promise<Record<ProductLineCategory, { used: number; max: number }>> {
  const out = {} as Record<ProductLineCategory, { used: number; max: number }>;
  for (const key of PRODUCT_LINE_CATEGORIES) {
    const used = await countProductLinePublished(key);
    out[key] = { used, max: PRODUCT_LINES_PER_CATEGORY };
  }
  return out;
}