import { images } from "@/lib/site";
import { resolveHeroImageSrc } from "@/lib/home-hero";

export const BUSINESS_SIDE_IMAGE_PATH = "business.sideImage";
export const BUSINESS_SIDE_IMAGE_FALLBACK = images.lab;

export function resolveBusinessSideImageSrc(raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return resolveHeroImageSrc(value);
}

export function businessSideImageOrFallback(raw: string | undefined) {
  return resolveBusinessSideImageSrc(raw) || BUSINESS_SIDE_IMAGE_FALLBACK;
}
