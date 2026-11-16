import { HOME_TEXT_COLORS } from "@/lib/home-hero";

export const PAGE_FOOTER_OPACITIES = [
  { key: "100", label: "100%", alpha: 1 },
  { key: "75", label: "75%", alpha: 0.75 },
  { key: "50", label: "50%", alpha: 0.5 },
  { key: "25", label: "25%", alpha: 0.25 },
  { key: "0", label: "투명", alpha: 0 },
] as const;

type OpacityKey = (typeof PAGE_FOOTER_OPACITIES)[number]["key"];

const TEXT_COLOR_IDS = new Set<string>(HOME_TEXT_COLORS.map((c) => c.id));

function footerColorHex(colorId: string) {
  return HOME_TEXT_COLORS.find((c) => c.id === colorId)?.hex ?? "#ffffff";
}

function footerColorLabel(colorId: string) {
  return HOME_TEXT_COLORS.find((c) => c.id === colorId)?.label ?? "흰색";
}

/** CMS에 저장되는 id (예: blue, blue-50, black-0) */
export type PageFooterBgId = string;

const FOOTER_BG_IDS = new Set<string>();
for (const c of HOME_TEXT_COLORS) {
  for (const o of PAGE_FOOTER_OPACITIES) {
    FOOTER_BG_IDS.add(o.alpha === 1 ? c.id : `${c.id}-${o.key}`);
  }
}

export const PAGE_FOOTER_BG_DEFAULT: PageFooterBgId = "white";

export function parseFooterBgParts(value: string | undefined) {
  const raw = (value ?? "").trim() || PAGE_FOOTER_BG_DEFAULT;
  const dash = raw.lastIndexOf("-");
  if (dash > 0) {
    const suffix = raw.slice(dash + 1);
    const colorId = raw.slice(0, dash);
    if (
      PAGE_FOOTER_OPACITIES.some((o) => o.key === suffix) &&
      TEXT_COLOR_IDS.has(colorId)
    ) {
      return { colorId, opacityKey: suffix as OpacityKey };
    }
  }
  if (TEXT_COLOR_IDS.has(raw)) {
    return { colorId: raw, opacityKey: "100" as OpacityKey };
  }
  return { colorId: "white", opacityKey: "100" as OpacityKey };
}

export function composeFooterBgId(colorId: string, opacityKey: OpacityKey): PageFooterBgId {
  if (opacityKey === "100") return colorId;
  return `${colorId}-${opacityKey}`;
}

export function parsePageFooterBg(
  value: string | undefined,
  fallback = PAGE_FOOTER_BG_DEFAULT,
): PageFooterBgId {
  const raw = (value ?? "").trim();
  if (FOOTER_BG_IDS.has(raw)) return raw;
  const { colorId, opacityKey } = parseFooterBgParts(raw);
  const id = composeFooterBgId(colorId, opacityKey);
  if (FOOTER_BG_IDS.has(id)) return id;
  return fallback;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** 공개·미리보기용 CSS background 값 */
export function resolvePageFooterBackground(
  value: string | undefined,
  fallback = PAGE_FOOTER_BG_DEFAULT,
): string {
  const id = parsePageFooterBg(value, fallback);
  const { colorId, opacityKey } = parseFooterBgParts(id);
  const hex = footerColorHex(colorId);
  const opacity = PAGE_FOOTER_OPACITIES.find((o) => o.key === opacityKey)?.alpha ?? 1;
  if (opacity <= 0) return "transparent";
  if (opacity >= 1) return hex;
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/** @deprecated resolvePageFooterBackground 사용 */
export function resolvePageFooterBgHex(value: string | undefined, fallback = PAGE_FOOTER_BG_DEFAULT) {
  return resolvePageFooterBackground(value, fallback);
}

export function pageFooterBgLabel(value: string | undefined, fallback = PAGE_FOOTER_BG_DEFAULT) {
  const id = parsePageFooterBg(value, fallback);
  const { colorId, opacityKey } = parseFooterBgParts(id);
  const color = footerColorLabel(colorId);
  const opacity = PAGE_FOOTER_OPACITIES.find((o) => o.key === opacityKey)?.label ?? "100%";
  return opacityKey === "100" ? color : `${color} ${opacity}`;
}

function luminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** 배경(흰 바탕 기준 혼합) 대비 글자색 */
export function pageFooterTextColor(bgCss: string) {
  if (bgCss === "transparent") return "#123a7a";
  const rgbaMatch = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/.exec(bgCss);
  if (rgbaMatch) {
    const r = Number(rgbaMatch[1]);
    const g = Number(rgbaMatch[2]);
    const b = Number(rgbaMatch[3]);
    const a = Number(rgbaMatch[4]);
    const er = r * a + 255 * (1 - a);
    const eg = g * a + 255 * (1 - a);
    const eb = b * a + 255 * (1 - a);
    return luminance(er, eg, eb) > 0.55 ? "#123a7a" : "#f4f0e6";
  }
  const { r, g, b } = hexToRgb(bgCss);
  return luminance(r, g, b) > 0.55 ? "#123a7a" : "#f4f0e6";
}

export function pageFooterPaths(section: string) {
  return {
    bg: `${section}.footerBg`,
    text: `${section}.footerText`,
  } as const;
}