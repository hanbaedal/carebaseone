import type { HomeFontId, HomeTextColorId } from "@/lib/home-hero";

const TYPO_SLOTS = new Set(["kicker", "title", "lede", "headline", "body"]);

export function cmsTypoSlot(path: string) {
  const last = path.split(".").pop() ?? "";
  return TYPO_SLOTS.has(last) ? last : null;
}

export function isCmsTypoTextPath(path: string) {
  return cmsTypoSlot(path) !== null;
}

export type CmsTypoKind = "Scale" | "Font" | "Color";

export function cmsTypoMetaPath(textPath: string, kind: CmsTypoKind) {
  if (!isCmsTypoTextPath(textPath)) return null;
  return `${textPath}${kind}`;
}

export function resolveCmsTypoTextSlot(path: string): string | null {
  if (isCmsTypoTextPath(path)) return path;
  const match = path.match(/^(.+\.(?:kicker|title|lede|headline|body))(Scale|Font|Color)$/);
  return match ? match[1] : null;
}

export function sectionHeroImagePath(section: string) {
  return `${section}.heroImage`;
}

export function defaultColorForCmsTextPath(textPath: string): HomeTextColorId {
  const slot = cmsTypoSlot(textPath);
  if (slot === "kicker") return "blue";
  if (slot === "lede") return "white";
  return "black";
}

export function defaultFontForCmsTextPath(textPath: string): HomeFontId {
  const slot = cmsTypoSlot(textPath);
  if (slot === "lede" || slot === "body") return "myeongjo";
  return "gothic";
}