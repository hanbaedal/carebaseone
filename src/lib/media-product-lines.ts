import type { MediaChannels, MediaDoc } from "@/lib/db";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";

/** 제품 카드 그리드 — 한 줄에 2개 (`ProductCatalogCards` sm:grid-cols-2) */
export const PRODUCT_LINE_GRID_COLUMNS = 2;

export const PRODUCT_LINE_LABELS: Record<ProductLineCategory, string> = {
  healthFood: "건강식품",
  generalFood: "일반식품",
  cosmetics: "화장품",
  patch: "패치",
  healthPlatform: "건강관리플랫폼",
};

export type MediaProductLines = Record<ProductLineCategory, boolean>;

export function emptyProductLines(): MediaProductLines {
  return {
    healthFood: false,
    generalFood: false,
    cosmetics: false,
    patch: false,
    healthPlatform: false,
  };
}

export function resolveProductLines(
  channels: MediaChannels | undefined,
): MediaProductLines {
  const base = emptyProductLines();
  if (!channels?.productLines) return base;
  for (const key of PRODUCT_LINE_CATEGORIES) {
    base[key] = Boolean(channels.productLines[key]);
  }
  return base;
}

export function mergeProductLines(
  current: MediaProductLines,
  patch: Partial<MediaProductLines> | undefined,
): MediaProductLines {
  if (!patch) return current;
  const next = { ...current };
  for (const key of PRODUCT_LINE_CATEGORIES) {
    if (patch[key] !== undefined) next[key] = Boolean(patch[key]);
  }
  return next;
}

export function productLineKeysEnabled(lines: MediaProductLines) {
  return PRODUCT_LINE_CATEGORIES.filter((key) => lines[key]);
}

/** 제품 페이지 노출: 게시 + 해당 라인 체크 + 이미지 */
export function showOnProductLine(
  doc: Pick<MediaDoc, "published" | "channels">,
  category: ProductLineCategory,
) {
  if (!doc.published) return false;
  return resolveProductLines(doc.channels)[category];
}

export function productLinesQuery(category: ProductLineCategory) {
  return {
    published: true,
    category: "gallery" as const,
    [`channels.productLines.${category}`]: true,
  };
}