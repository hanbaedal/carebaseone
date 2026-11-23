import type { HomeFontId, HomeTextColorId } from "@/lib/home-hero";

export type CmsTypoKindName = "kicker" | "title" | "lede" | "headline" | "body";

const TITLE_KEYS = new Set(["title", "headline", "sign"]);
const LEDE_KEYS = new Set([
  "lede",
  "text",
  "summary",
  "note",
  "items",
  "invite",
  "beoneNote",
  "center",
  "body",
]);

function isImagePath(path: string) {
  return path.endsWith("heroImage") || path.endsWith("sideImage") || path.endsWith(".image");
}

/** 이미지·메타·풋터가 아닌 CMS 본문 텍스트 경로 */
export function isCmsTypoTextPath(path: string) {
  return cmsTypoKind(path) !== null;
}

export function cmsTypoKind(path: string): CmsTypoKindName | null {
  if (!path) return null;
  if (isImagePath(path)) return null;
  if (/(?:Scale|Color|Font|footerBg|footerText)$/.test(path)) return null;

  const last = path.split(".").pop() ?? "";
  if (last === "kicker") return "kicker";
  if (last === "headline") return "headline";
  if (last === "body") return "body";
  if (TITLE_KEYS.has(last)) return "title";
  if (LEDE_KEYS.has(last)) return "lede";
  // business.nodes.technology 등 짧은 라벨·기타 문구
  return "lede";
}

/** @deprecated use cmsTypoKind — 기존 호출 호환 */
export function cmsTypoSlot(path: string) {
  return cmsTypoKind(path);
}

export type CmsTypoKind = "Scale" | "Font" | "Color";

export function cmsTypoMetaPath(textPath: string, kind: CmsTypoKind) {
  if (!isCmsTypoTextPath(textPath)) return null;
  return `${textPath}${kind}`;
}

export function resolveCmsTypoTextSlot(path: string): string | null {
  if (isCmsTypoTextPath(path)) return path;
  const match = path.match(/^(.+)(Scale|Font|Color)$/);
  if (!match) return null;
  return isCmsTypoTextPath(match[1]) ? match[1] : null;
}

export function sectionHeroImagePath(section: string) {
  return `${section}.heroImage`;
}

export function defaultColorForCmsTextPath(textPath: string): HomeTextColorId {
  const last = textPath.split(".").pop() ?? "";
  if (last === "kicker") return "blue";
  // 히어로 소개(섹션 루트 lede)만 밝은 글자 — 본문 text/summary 등은 검정
  if (last === "lede") return "white";
  return "black";
}

export function defaultFontForCmsTextPath(textPath: string): HomeFontId {
  const kind = cmsTypoKind(textPath);
  if (kind === "lede" || kind === "body") return "myeongjo";
  return "gothic";
}

/** 텍스트 경로에 대응하는 Font/Scale/Color 메타가 허용되는지 */
export function isCmsTypoMetaPath(path: string, allowedTextPaths: Set<string>) {
  const match = path.match(/^(.+)(Font|Scale|Color)$/);
  if (!match) return false;
  return allowedTextPaths.has(match[1]) || isCmsTypoTextPath(match[1]);
}
