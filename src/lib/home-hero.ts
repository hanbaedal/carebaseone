import { images } from "@/lib/site";

/** CMS `home.heroImage` — slug, `/api/media/…`, `/images/…` */
export function resolveHeroImageSrc(heroImage: string | undefined) {
  const raw = (heroImage ?? "").trim();
  if (!raw) return images.hero;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }
  return `/api/media/${raw}`;
}

export function parseHomeScale(value: string | undefined, fallback = 100) {
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(200, Math.max(0, n));
}

export const HOME_SCALE_STEPS = Array.from({ length: 21 }, (_, i) => i * 10);

/** 공개 홈·CMS 미리보기 동일 — 배경 선명도 */
export const HOME_HERO_IMAGE_CLASS =
  "object-cover object-center contrast-[1.05] saturate-[1.08]";

export const homeHeroOverlayClass = {
  horizontal: "absolute inset-0 bg-gradient-to-r from-white/82 via-white/38 to-transparent",
  vertical: "absolute inset-0 bg-gradient-to-t from-white/88 via-white/15 to-transparent",
} as const;

export function heroImageUnoptimized(src: string) {
  return src.startsWith("/api/") || src.startsWith("/images/");
}