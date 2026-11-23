import catalog from "@/data/product-catalog.json";
import { resolveHubBlockImageSrc } from "@/lib/hub-media";
import type { ProductLineCategory } from "@/lib/product-categories";

export function productCatalogImagePath(slug: string) {
  return `product.catalog.${slug}.image`;
}

export function productCatalogTitlePath(slug: string) {
  return `product.catalog.${slug}.title`;
}

export function productCatalogSummaryPath(slug: string) {
  return `product.catalog.${slug}.summary`;
}

export const PRODUCT_BEONE_NOTE_PATH = "product.beoneNote";

export function resolveProductCatalogImageSrc(fallback: string, raw: string | undefined) {
  return resolveHubBlockImageSrc(fallback, raw);
}

export function resolveProductCatalogText(override: string | undefined, fallback: string) {
  const value = (override ?? "").trim();
  return value.length > 0 ? value : fallback;
}

export function catalogLinesForCategory(category: ProductLineCategory) {
  return catalog.lines.filter((line) => line.category === category);
}
