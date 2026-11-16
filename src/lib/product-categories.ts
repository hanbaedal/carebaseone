/** 제품 페이지·홈 표시 순서 */
export const PRODUCT_LINE_CATEGORIES = [
  "healthFood",
  "generalFood",
  "cosmetics",
  "patch",
  "healthPlatform",
] as const;

export type ProductLineCategory = (typeof PRODUCT_LINE_CATEGORIES)[number];