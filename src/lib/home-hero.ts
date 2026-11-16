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

/** 배경은 필터·오버레이 없이 원본 그대로 */
export const HOME_HERO_IMAGE_CLASS = "object-cover object-center";

export function heroImageUnoptimized(src: string) {
  return true;
}

export const HOME_TEXT_COLORS = [
  { id: "white", label: "흰색", hex: "#ffffff" },
  { id: "yellow", label: "노랑", hex: "#facc15" },
  { id: "sky", label: "하늘", hex: "#38bdf8" },
  { id: "blue", label: "청색", hex: "#2563eb" },
  { id: "purple", label: "보라", hex: "#9333ea" },
  { id: "red", label: "빨강", hex: "#dc2626" },
  { id: "black", label: "검정", hex: "#0f172a" },
] as const;

export type HomeTextColorId = (typeof HOME_TEXT_COLORS)[number]["id"];

const COLOR_IDS = new Set<string>(HOME_TEXT_COLORS.map((c) => c.id));

export const HOME_KICKER_COLOR_DEFAULT: HomeTextColorId = "blue";
export const HOME_HEADLINE_COLOR_DEFAULT: HomeTextColorId = "black";

export function parseHomeTextColor(
  value: string | undefined,
  fallback: HomeTextColorId,
): HomeTextColorId {
  const raw = (value ?? "").trim();
  if (COLOR_IDS.has(raw)) return raw as HomeTextColorId;
  return fallback;
}

export function resolveHomeTextColorHex(
  value: string | undefined,
  fallback: HomeTextColorId,
): string {
  const id = parseHomeTextColor(value, fallback);
  return HOME_TEXT_COLORS.find((c) => c.id === id)?.hex ?? HOME_TEXT_COLORS[0].hex;
}

export function colorPathFor(textPath: string) {
  if (textPath === "home.kicker") return "home.kickerColor";
  if (textPath === "home.headline") return "home.headlineColor";
  return null;
}

export function defaultColorForTextPath(textPath: string): HomeTextColorId {
  return textPath === "home.kicker" ? HOME_KICKER_COLOR_DEFAULT : HOME_HEADLINE_COLOR_DEFAULT;
}