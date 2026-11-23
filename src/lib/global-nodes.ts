import { images } from "@/lib/site";
import { resolveHeroImageSrc } from "@/lib/home-hero";

export const GLOBAL_NODE_KEYS = ["korea", "china", "usa", "future"] as const;

export type GlobalNodeKey = (typeof GLOBAL_NODE_KEYS)[number];

export const GLOBAL_NODE_FALLBACK_IMAGES: Record<GlobalNodeKey, string> = {
  korea: images.korea,
  china: images.china,
  usa: images.usa,
  future: images.close,
};

export function globalNodeImagePath(key: GlobalNodeKey) {
  return `global.nodes.${key}.image`;
}

export function resolveGlobalNodeImageSrc(key: GlobalNodeKey, raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return GLOBAL_NODE_FALLBACK_IMAGES[key];
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return resolveHeroImageSrc(value);
}
