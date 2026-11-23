import { adminMenuGroups } from "@/lib/admin-menu";
import { headerNav, type HeaderNavItem } from "@/lib/site";
import { editHrefForNavKey, labelForNavKey } from "@/lib/cms-site-map";

export type CmsAdminNavChip = {
  key: string;
  label: string;
  href: string;
  heading?: boolean;
};

export type CmsAdminNavContext = {
  parent: CmsAdminNavChip;
  siblings: CmsAdminNavChip[];
  activeKey: string;
  onHub: boolean;
  /** 홈페이지관리 전체 서브메뉴 (칩 바) */
  allLinks: CmsAdminNavChip[];
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

/** 홈페이지관리 메뉴 전체 — 헤딩 포함 */
export function homepageAdminAllChips(): CmsAdminNavChip[] {
  const group = adminMenuGroups.find((g) => g.key === "homepage");
  if (!group) return [];
  return group.items
    .filter((item) => item.heading || Boolean(item.href))
    .map((item, index) => ({
      key: item.heading ? `heading-${item.label}-${index}` : item.href || `item-${index}`,
      label: item.label,
      href: item.href || "#",
      heading: item.heading,
    }));
}

function activeChipKey(pathname: string, search: URLSearchParams): string {
  const path = pathname.split("?")[0] ?? pathname;
  if (path === "/admin/cms") {
    const page = search.get("page") ?? "home";
    return page === "home" ? "/admin/cms" : `/admin/cms?page=${page}`;
  }
  if (path === "/admin/media") {
    const focus = search.get("focus");
    return focus ? `/admin/media?focus=${focus}` : "/admin/media";
  }
  if (path === "/admin/posts") {
    const type = search.get("type");
    return type ? `/admin/posts?type=${type}` : "/admin/posts";
  }
  if (path === "/admin/notices") return "/admin/notices";
  if (path === "/admin/inquiries") return "/admin/inquiries";
  return path;
}

/** 홈페이지관리 화면 — 공개 헤더 하위와 동일한 편집 칩 + 전체 서브메뉴 */
export function cmsAdminNavContext(
  pathname: string,
  search: URLSearchParams,
): CmsAdminNavContext | null {
  const path = pathname.split("?")[0] ?? pathname;
  const onHomepageAdmin =
    path === "/admin/cms" ||
    path === "/admin/media" ||
    path === "/admin/notices" ||
    path === "/admin/posts" ||
    path === "/admin/inquiries";

  if (!onHomepageAdmin) return null;

  const activeKey = navKeyFromAdmin(pathname, search) ?? "home";
  const allLinks = homepageAdminAllChips();
  const parent = parentForNavKey(activeKey);
  const siblings = parent?.children?.map((c) => chip(c.key)) ?? [];
  const onHub = Boolean(parent && parent.key === activeKey);

  return {
    parent: parent ? chip(parent.key) : { key: "home", label: "메인 홈", href: "/admin/cms" },
    siblings,
    activeKey,
    onHub,
    allLinks: allLinks.map((link) =>
      link.heading
        ? link
        : {
            ...link,
            // 활성 비교용 — href 기준
            key: link.href,
          },
    ),
  };
}

export function cmsAdminActiveHref(pathname: string, search: URLSearchParams) {
  return activeChipKey(pathname, search);
}

export function cmsAdminNavMatchesHref(
  href: string,
  pathname: string,
  search: URLSearchParams,
): boolean {
  const [path, qs] = href.split("?");
  if ((pathname.split("?")[0] ?? pathname) !== path) return false;
  if (!qs) {
    // /admin/cms without query matches only when no page or page=home
    if (path === "/admin/cms") {
      const page = search.get("page");
      return !page || page === "home";
    }
    return !search.toString();
  }
  const expected = new URLSearchParams(qs);
  for (const [key, value] of expected) {
    if (search.get(key) !== value) return false;
  }
  return true;
}
