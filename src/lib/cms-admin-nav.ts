import { headerNav, type HeaderNavItem } from "@/lib/site";
import { editHrefForNavKey, labelForNavKey } from "@/lib/cms-site-map";

export type CmsAdminNavChip = {
  key: string;
  label: string;
  href: string;
};

export type CmsAdminNavContext = {
  parent: CmsAdminNavChip;
  siblings: CmsAdminNavChip[];
  activeKey: string;
  onHub: boolean;
};

function parseAdminLocation(pathname: string, search: URLSearchParams): string | null {
  const path = pathname.split("?")[0] ?? pathname;

  if (path === "/admin/cms") {
    const page = search.get("page");
    if (!page || page === "home") return "home";
    return page;
  }
  if (path === "/admin/media") {
    const focus = search.get("focus");
    // 배경 이미지 갤러리는 커뮤니티 '갤러리' 게시와 별개 — 칩 네비에 묶지 않음
    if (focus === "patents") return "patents";
    if (focus === "certifications") return "certifications";
    if (focus === "research") return "research";
    return null;
  }
  if (path === "/admin/notices") return "notice";
  if (path === "/admin/posts") {
    const type = search.get("type");
    if (type === "archive") return "archive";
    if (type === "gallery") return "gallery";
    return null;
  }
  if (path === "/admin/inquiries") return "contact";
  if (path === "/admin/content") {
    const section = search.get("section");
    return section;
  }
  return null;
}

/** CMS page key → 공개 nav child key (제품 라인 등) */
const CMS_PAGE_TO_NAV_KEY: Record<string, string> = {
  home: "home",
  about: "about",
  greeting: "greeting",
  features: "features",
  solution: "solution",
  global: "global",
  business: "business",
  product: "product",
  healthFood: "healthFood",
  generalFood: "generalFood",
  cosmetics: "cosmetics",
  patch: "patch",
  healthPlatform: "healthPlatform",
  technology: "technology",
  community: "community",
  contact: "contact",
};

function navKeyFromAdmin(pathname: string, search: URLSearchParams): string | null {
  const path = pathname.split("?")[0] ?? pathname;
  if (path === "/admin/cms") {
    const page = search.get("page") ?? "home";
    return CMS_PAGE_TO_NAV_KEY[page] ?? page;
  }
  return parseAdminLocation(pathname, search);
}

function parentForNavKey(key: string): HeaderNavItem | null {
  if (key === "home") return null;
  for (const parent of headerNav) {
    if (parent.key === key) return parent;
    if (parent.children?.some((c) => c.key === key)) return parent;
  }
  return null;
}

function chip(key: string): CmsAdminNavChip {
  return {
    key,
    label: labelForNavKey(key),
    href: editHrefForNavKey(key),
  };
}

/** 홈페이지관리 화면 — 공개 헤더 하위와 동일한 편집 칩 */
export function cmsAdminNavContext(
  pathname: string,
  search: URLSearchParams,
): CmsAdminNavContext | null {
  const activeKey = navKeyFromAdmin(pathname, search);
  if (!activeKey || activeKey === "home") return null;

  const parent = parentForNavKey(activeKey);
  if (!parent) return null;

  const siblings = parent.children?.map((c) => chip(c.key)) ?? [];
  const onHub = parent.key === activeKey;

  return {
    parent: chip(parent.key),
    siblings,
    activeKey,
    onHub,
  };
}

export function cmsAdminNavMatchesHref(
  href: string,
  pathname: string,
  search: URLSearchParams,
): boolean {
  const [path, qs] = href.split("?");
  if ((pathname.split("?")[0] ?? pathname) !== path) return false;
  if (!qs) return true;
  const expected = new URLSearchParams(qs);
  for (const [key, value] of expected) {
    if (search.get(key) !== value) return false;
  }
  return true;
}