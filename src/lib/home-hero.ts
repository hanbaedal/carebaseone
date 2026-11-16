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