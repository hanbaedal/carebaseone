import { resolveHeroImageSrc } from "@/lib/home-hero";

/** CMS slug / URL → 공개·미리보기용 src. 비어 있으면 fallback. */
export function resolveHubBlockImageSrc(fallback: string, raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return fallback;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return resolveHeroImageSrc(value);
}

export function hubCardImagePath(section: string, navKey: string) {
  return `${section}.hubCards.${navKey}.image`;
}

export function productCategoryImagePath(category: string) {
  return `product.categories.${category}.image`;
}
