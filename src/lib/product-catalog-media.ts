import catalog from "@/data/product-catalog.json";
import { resolveHubBlockImageSrc } from "@/lib/hub-media";
import type { ProductLineCategory } from "@/lib/product-categories";

export function productCatalogImagePath(slug: string) {
  return `product.catalog.${slug}.image`;
}

export function resolveProductCatalogImageSrc(fallback: string, raw: string | undefined) {
  return resolveHubBlockImageSrc(fallback, raw);
}

export function catalogLinesForCategory(category: ProductLineCategory) {
  return catalog.lines.filter((line) => line.category === category);
}

export function allCatalogImageFields(): Record<string, { image: string }> {
  const out: Record<string, { image: string }> = {};
  for (const line of catalog.lines) {
    out[line.slug] = { image: "" };
  }
  return out;
}
