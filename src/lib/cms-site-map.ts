import { headerNav, type HeaderNavItem } from "@/lib/site";

export type CmsHubLink = {
  key: string;
  label: string;
  publicHref: string;
  editHref: string;
};

export type CmsHubCard = {
  key: string;
  label: string;
  publicHref: string;
  links: CmsHubLink[];
};

const LABELS: Record<string, string> = {
  home: "홈",
  meta: "로고·회사명",
  nav: "메뉴 라벨",
  footer: "하단",
  cta: "버튼 문구",
  about: "회사소개",
  greeting: "인사말",
  features: "회사특징",
  solution: "솔루션",
  global: "글로벌",
  business: "사업협력",
  product: "제품",
  healthFood: "건강식품",
  generalFood: "일반식품",
  cosmetics: "화장품",
  patch: "패치",
  healthPlatform: "건강관리플랫폼",
  technology: "기술",
  patents: "지식재산권",
  certifications: "인증·규제",
  research: "연구·임상",
  community: "커뮤니티",
  notice: "공지사항",
  archive: "자료실",
  gallery: "갤러리",
  contact: "문의",
  common: "공통",
};

/** 공개 메뉴 key → 편집 경로 (헤더 홈페이지관리 · CMS 하위 메뉴와 동일) */
const editByKey: Record<string, string> = {
  home: "/admin/cms",
  meta: "/admin/content?section=meta",
  nav: "/admin/content?section=nav",
  footer: "/admin/content?section=footer",
  cta: "/admin/content?section=cta",
  about: "/admin/cms?page=about",
  greeting: "/admin/cms?page=greeting",
  features: "/admin/cms?page=features",
  solution: "/admin/cms?page=solution",
  global: "/admin/cms?page=global",
  business: "/admin/cms?page=business",
  product: "/admin/cms?page=product",
  healthFood: "/admin/cms?page=healthFood",
  generalFood: "/admin/cms?page=generalFood",
  cosmetics: "/admin/cms?page=cosmetics",
  patch: "/admin/cms?page=patch",
  healthPlatform: "/admin/cms?page=healthPlatform",
  technology: "/admin/cms?page=technology",
  patents: "/admin/media?focus=patents",
  certifications: "/admin/media?focus=certifications",
  research: "/admin/media?focus=research",
  community: "/admin/cms?page=community",
  notice: "/admin/notices",
  archive: "/admin/posts?type=archive",
  gallery: "/admin/gallery",
  contact: "/admin/cms?page=contact",
};

function labelOf(key: string) {
  return LABELS[key] ?? key;
}

export function labelForNavKey(key: string) {
  return labelOf(key);
}

export function editHrefForNavKey(key: string) {
  return editByKey[key] ?? `/admin/content?section=${key}`;
}

function publicPath(href: string) {
  if (href === "/") return "/ko";
  return `/ko${href}`;
}

function linkOf(key: string, publicHref: string): CmsHubLink {
  return {
    key,
    label: labelOf(key),
    publicHref: publicPath(publicHref),
    editHref: editByKey[key] ?? `/admin/content?section=${key}`,
  };
}

/** 하위만 나열 (카드 제목과 부모 이름 중복 없음) — 공개 사이트맵과 동일 */
function childLinks(item: HeaderNavItem): CmsHubLink[] {
  if (!item.children?.length) {
    return [linkOf(item.key, item.href)];
  }
  return item.children.map((child) => linkOf(child.key, child.href));
}

/**
 * anyangmp /manage/cms 형식:
 * 1) 공통(홈·로고·메뉴·하단·버튼)
 * 2) 공개 헤더와 1:1 메뉴 카드
 */
export function publicSiteCmsHub(): { common: CmsHubCard; pages: CmsHubCard[] } {
  const common: CmsHubCard = {
    key: "common",
    label: labelOf("common"),
    publicHref: publicPath("/"),
    links: [
      linkOf("home", "/"),
      linkOf("meta", "/"),
      linkOf("nav", "/"),
      linkOf("footer", "/"),
      linkOf("cta", "/"),
    ],
  };

  const pages = headerNav.map((item) => ({
    key: item.key,
    label: labelOf(item.key),
    publicHref: publicPath(item.href),
    links: childLinks(item),
  }));

  return { common, pages };
}

export { LABELS as cmsLabels };
