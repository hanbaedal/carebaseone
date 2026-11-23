import { ensureIndexes, media } from "@/lib/db";
import {
  PRODUCT_LINE_LABELS,
  PRODUCT_LINES_PER_CATEGORY,
  type MediaProductLines,
} from "@/lib/media-product-lines";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";

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
  if (excludeSlug) filter.slug = { $ne: excludeSlug };
  return col.countDocuments(filter);
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