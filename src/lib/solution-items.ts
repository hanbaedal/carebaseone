import { images } from "@/lib/site";
import { resolveHeroImageSrc } from "@/lib/home-hero";

export const SOLUTION_ITEM_KEYS = [
  "vascular",
  "sports",
  "senior",
  "beauty",
  "wellness",
] as const;

export type SolutionItemKey = (typeof SOLUTION_ITEM_KEYS)[number];

export const SOLUTION_ITEM_FALLBACK_IMAGES: Record<SolutionItemKey, string> = {
  vascular: images.vascular,
  sports: images.sports,
  senior: images.senior,
  beauty: images.beauty,
  wellness: images.wellness,
};

export function solutionItemImagePath(key: SolutionItemKey) {
  return `solution.items.${key}.image`;
}

export function resolveSolutionItemImageSrc(
  key: SolutionItemKey,
  raw: string | undefined,
) {
  const value = (raw ?? "").trim();
  if (!value) return SOLUTION_ITEM_FALLBACK_IMAGES[key];
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return resolveHeroImageSrc(value);
}
