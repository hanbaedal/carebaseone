import { headerNav, type HeaderNavItem } from "@/lib/site";

export type CmsHubLink = {
  labelKey: string;
  /** 공개 페이지 경로 (미리보기) */
  publicHref: string;
  /** 관리 편집 경로 */
  editHref: string;
};

export type CmsHubCard = {
  key: string;
  labelKey: string;
  publicHref: string;
  links: CmsHubLink[];
};

/** 공개 메뉴 key → CMS section / 게시·미디어 편집 */
const editByKey: Record<string, string> = {
  home: "/admin/content?section=home",
  about: "/admin/content?section=about",
  greeting: "/admin/content?section=about",
  features: "/admin/content?section=about",
  solution: "/admin/content?section=solution",
  global: "/admin/content?section=global",
  business: "/admin/content?section=business",
  product: "/admin/content?section=product",
  healthFood: "/admin/content?section=product",
  generalFood: "/admin/content?section=product",
  cosmetics: "/admin/content?section=product",
  patch: "/admin/content?section=product",
  healthPlatform: "/admin/content?section=product",
  technology: "/admin/content?section=technology",
  patents: "/admin/media",
  certifications: "/admin/media",
  research: "/admin/media",
  community: "/admin/content?section=news",
  notice: "/admin/notices",
  archive: "/admin/posts",
  gallery: "/admin/posts",
  contact: "/admin/content?section=contact",
};

function linksForItem(item: HeaderNavItem): CmsHubLink[] {
  const self: CmsHubLink = {
    labelKey: item.key,
    publicHref: item.href,
    editHref: editByKey[item.key] ?? `/admin/content?section=${item.key}`,
  };
  if (!item.children?.length) return [self];
  return [
    self,
    ...item.children.map((child) => ({
      labelKey: child.key,
      publicHref: child.href,
      editHref: editByKey[child.key] ?? `/admin/content?section=${child.key}`,
    })),
  ];
}

/** 공개 헤더·사이트맵과 1:1 카드 + 홈·공통 */
export function publicSiteCmsHub(): CmsHubCard[] {
  const home: CmsHubCard = {
    key: "home",
    labelKey: "home",
    publicHref: "/",
    links: [
      { labelKey: "home", publicHref: "/", editHref: "/admin/content?section=home" },
      { labelKey: "meta", publicHref: "/", editHref: "/admin/content?section=meta" },
      { labelKey: "nav", publicHref: "/", editHref: "/admin/content?section=nav" },
      { labelKey: "footer", publicHref: "/", editHref: "/admin/content?section=footer" },
      { labelKey: "cta", publicHref: "/", editHref: "/admin/content?section=cta" },
    ],
  };

  const fromNav = headerNav.map((item) => ({
    key: item.key,
    labelKey: item.key,
    publicHref: item.href,
    links: linksForItem(item),
  }));

  return [home, ...fromNav];
}
