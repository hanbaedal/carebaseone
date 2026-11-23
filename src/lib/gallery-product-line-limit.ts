import { ensureIndexes, media, type MediaDoc } from "@/lib/db";
import { galleryFileMissing } from "@/lib/gallery-thumb-src";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";
import { emptyProductLines, resolveProductLines } from "@/lib/media-product-lines";

function countsForProductLine(docs: MediaDoc[], category: ProductLineCategory) {
  return docs.filter((d) => {
    if (!d.published) return false;
    if (galleryFileMissing(d)) return false;
    return Boolean(d.channels?.productLines?.[category]);
  });
}

/** 제품 라인 게시·노출 가능 장수 (관리 화면 표시용) */
export async function countProductLinePublished(
  category: ProductLineCategory,
  excludeSlug?: string,
) {
  if (!process.env.MONGODB_URI) return 0;
  await ensureIndexes();
  const col = await media();
  const docs = (await col
    .find({
      category: "gallery",
      published: true,
      [`channels.productLines.${category}`]: true,
    })
    .toArray()) as MediaDoc[];
  const eligible = countsForProductLine(docs, category);
  if (!excludeSlug) return eligible.length;
  return eligible.filter((d) => d.slug !== excludeSlug).length;
}

/** 파일 없는 항목은 제품 라인 체크 해제 */
export async function repairProductLineFileMissing() {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const { resolveMediaChannels } = await import("@/lib/media-channels");

  const imageDocs = (await col
    .find({
      category: "gallery",
      published: true,
      $or: PRODUCT_LINE_CATEGORIES.map((key) => ({
        [`channels.productLines.${key}`]: true,
      })),
    })
    .toArray()) as MediaDoc[];

  for (const doc of imageDocs) {
    if (!galleryFileMissing(doc)) continue;
    const ch = resolveMediaChannels(doc);
    let cleared = false;
    for (const key of PRODUCT_LINE_CATEGORIES) {
      if (resolveProductLines(ch)[key]) cleared = true;
    }
    if (!cleared) continue;
    await col.updateOne(
      { slug: doc.slug },
      { $set: { channels: { ...ch, productLines: emptyProductLines() } } },
    );
  }
}