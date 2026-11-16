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

/** CMS 100% = 디자인 기준(코드 반응형·clamp 없음) */
export const HOME_SCALE_MIN = 50;
export const HOME_SCALE_MAX = 300;
export const HOME_SCALE_STEP = 10;
export const HOME_SCALE_DEFAULT = 100;

/** 키커·헤드라인 기준 크기 (100%일 때) */
export const HOME_KICKER_BASE_PX = 12;
export const HOME_HEADLINE_BASE_REM = 2.25;

export function parseHomeScale(value: string | undefined, fallback = HOME_SCALE_DEFAULT) {
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(HOME_SCALE_MAX, Math.max(HOME_SCALE_MIN, n));
}

export function clampHomeScale(percent: number) {
  const stepped = Math.round(percent / HOME_SCALE_STEP) * HOME_SCALE_STEP;
  return Math.min(HOME_SCALE_MAX, Math.max(HOME_SCALE_MIN, stepped));
}

export const HOME_SCALE_STEPS = Array.from(
  { length: (HOME_SCALE_MAX - HOME_SCALE_MIN) / HOME_SCALE_STEP + 1 },
  (_, i) => HOME_SCALE_MIN + i * HOME_SCALE_STEP,
);

export function homeKickerFontSize(scalePercent: number) {
  return `${(HOME_KICKER_BASE_PX * scalePercent) / 100}px`;
}

export function homeHeadlineFontSize(scalePercent: number) {
  return `${(HOME_HEADLINE_BASE_REM * scalePercent) / 100}rem`;
}

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