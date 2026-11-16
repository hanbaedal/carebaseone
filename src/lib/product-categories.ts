/** 제품 페이지·홈·헤더 소메뉴 표시 순서 */
export const PRODUCT_LINE_CATEGORIES = [
  "healthFood",
  "generalFood",
  "cosmetics",
  "patch",
  "healthPlatform",
] as const;

export type ProductLineCategory = (typeof PRODUCT_LINE_CATEGORIES)[number];

/** URL slug ↔ 카테고리 */
export const PRODUCT_CATEGORY_PATHS: Record<ProductLineCategory, string> = {
  healthFood: "health-food",
  generalFood: "general-food",
  cosmetics: "cosmetics",
  patch: "patch",
  healthPlatform: "health-platform",
};

export function productCategoryFromPath(
  slug: string,
): ProductLineCategory | null {
  const entry = Object.entries(PRODUCT_CATEGORY_PATHS).find(([, path]) => path === slug);
  return (entry?.[0] as ProductLineCategory | undefined) ?? null;
}

export function productNavChildren() {
  return PRODUCT_LINE_CATEGORIES.map((key) => ({
    href: `/product/${PRODUCT_CATEGORY_PATHS[key]}`,
    key,
  }));
}
