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
export const HOME_LEDE_BASE_REM = 1.0625;

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

/** 공개 홈 한 화면 — 뷰포트에 맞춘 글자 크기 (CMS % 반영) */
export function homeKickerFontSizeFluid(scalePercent: number) {
  const f = scalePercent / 100;
  return `clamp(${9 * f}px, ${1.2 * f}vh + ${7 * f}px, ${14 * f}px)`;
}

export function homeHeadlineFontSizeFluid(scalePercent: number) {
  const f = scalePercent / 100;
  return `clamp(${1.1 * f}rem, ${3.5 * f}vh + ${0.35 * f}rem, ${2.65 * f}rem)`;
}

export function homeLedeFontSizeFluid(scalePercent: number) {
  const f = scalePercent / 100;
  return `clamp(${0.875 * f}rem, ${1.2 * f}vh + ${0.45 * f}rem, ${1.2 * f}rem)`;
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
export const HOME_LEDE_COLOR_DEFAULT: HomeTextColorId = "white";

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
  if (textPath === "home.lede") return "home.ledeColor";
  return null;
}

export function defaultColorForTextPath(textPath: string): HomeTextColorId {
  if (textPath === "home.kicker") return HOME_KICKER_COLOR_DEFAULT;
  if (textPath === "home.lede") return HOME_LEDE_COLOR_DEFAULT;
  return HOME_HEADLINE_COLOR_DEFAULT;
}

export const HOME_FONTS = [
  {
    id: "gothic",
    label: "고딕",
    family: '"Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
  },
  {
    id: "gyeon-gothic",
    label: "견고딕",
    family: '"HY견고딕", "Malgun Gothic", "Noto Sans KR", sans-serif',
  },
  {
    id: "myeongjo",
    label: "명조",
    family: '"Batang", "BatangChe", "AppleMyungjo", "Noto Serif KR", serif',
  },
  {
    id: "shin-myeongjo",
    label: "신명조",
    family: '"신명조", "Batang", "Noto Serif KR", serif',
  },
  {
    id: "gyeon-myeongjo",
    label: "견명조",
    family: '"HY견명조", "Batang", "Noto Serif KR", serif',
  },
  {
    id: "gungsuh",
    label: "궁서",
    family: '"Gungsuh", "GungSeo", "Batang", serif',
  },
  {
    id: "headline-m",
    label: "헤드라인M",
    family: '"Headline M", "Malgun Gothic", "Noto Sans KR", sans-serif',
  },
] as const;

export type HomeFontId = (typeof HOME_FONTS)[number]["id"];

const FONT_IDS = new Set<string>(HOME_FONTS.map((f) => f.id));

export const HOME_KICKER_FONT_DEFAULT: HomeFontId = "gothic";
export const HOME_HEADLINE_FONT_DEFAULT: HomeFontId = "gothic";
export const HOME_LEDE_FONT_DEFAULT: HomeFontId = "myeongjo";

export function parseHomeFont(value: string | undefined, fallback: HomeFontId): HomeFontId {
  const raw = (value ?? "").trim();
  if (FONT_IDS.has(raw)) return raw as HomeFontId;
  return fallback;
}

export function resolveHomeFontFamily(value: string | undefined, fallback: HomeFontId): string {
  const id = parseHomeFont(value, fallback);
  return HOME_FONTS.find((f) => f.id === id)?.family ?? HOME_FONTS[0].family;
}

export function fontPathFor(textPath: string) {
  if (textPath === "home.kicker") return "home.kickerFont";
  if (textPath === "home.headline") return "home.headlineFont";
  if (textPath === "home.lede") return "home.ledeFont";
  return null;
}

export function defaultFontForTextPath(textPath: string): HomeFontId {
  if (textPath === "home.kicker") return HOME_KICKER_FONT_DEFAULT;
  if (textPath === "home.lede") return HOME_LEDE_FONT_DEFAULT;
  return HOME_HEADLINE_FONT_DEFAULT;
}

export function homeFontLabel(value: string | undefined, fallback: HomeFontId): string {
  const id = parseHomeFont(value, fallback);
  return HOME_FONTS.find((f) => f.id === id)?.label ?? HOME_FONTS[0].label;
}