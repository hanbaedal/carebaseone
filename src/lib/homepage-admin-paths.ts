/** 홈페이지관리 — 공개 헤더 + 풀폭 쉘 (CMS · CRUD) */
const PREFIXES = [
  "/admin/cms",
  "/admin/gallery",
  "/admin/media",
  "/admin/notices",
  "/admin/posts",
  "/admin/inquiries",
] as const;

export function isHomepageAdminPath(pathname: string) {
  const path = pathname.split("?")[0] ?? pathname;
  return PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export const MEDIA_FOCUS_TO_CATEGORY = {
  gallery: "gallery",
  patents: "patent",
  certifications: "certification",
  research: "research",
} as const;

/** 공개 /research 페이지와 동일 — 연구·논문 + 제품·성분 */
export const RESEARCH_PUBLIC_CATEGORIES = ["research", "product"] as const;

export type MediaFocusKey = keyof typeof MEDIA_FOCUS_TO_CATEGORY;

export const MEDIA_FOCUS_LABELS: Record<MediaFocusKey, string> = {
  gallery: "이미지 갤러리",
  patents: "지식재산권",
  certifications: "인증·규제",
  research: "연구·임상",
};