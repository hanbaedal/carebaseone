export const siteUrl = "https://carebaseone.com";

/** 로컬 정적 이미지 — Unsplash 원본 삭제 시 404 방지 */
export const images = {
  hero: "/images/site/hero.jpg",
  leaves: "/images/site/leaves.jpg",
  vein: "/images/site/vein.jpg",
  close: "/images/site/close.jpg",
  vascular: "/images/site/vascular.jpg",
  sports: "/images/site/sports.jpg",
  senior: "/images/site/senior.jpg",
  beauty: "/images/site/beauty.jpg",
  wellness: "/images/site/wellness.jpg",
  breakfast: "/images/site/breakfast.jpg",
  drink: "/images/site/drink.jpg",
  korea: "/images/site/korea.jpg",
  china: "/images/site/china.jpg",
  usa: "/images/site/usa.jpg",
  lab: "/images/site/lab.jpg",
} as const;

export type NavLink = { href: string; key: string };

/** 메인 화면·헤더·사이트맵 공통 메뉴 */
export type HeaderNavItem = NavLink & {
  children?: NavLink[];
};

/** 헤더 메뉴 = 사이트맵 카드 구성의 단일 기준 */
export const headerNav: HeaderNavItem[] = [
  { href: "/about", key: "about" },
  {
    href: "/technology",
    key: "technology",
    children: [
      { href: "/patents", key: "patents" },
      { href: "/certifications", key: "certifications" },
      { href: "/research", key: "research" },
    ],
  },
  { href: "/product", key: "product" },
  { href: "/solution", key: "solution" },
  { href: "/global", key: "global" },
  { href: "/business", key: "business" },
  {
    href: "/community",
    key: "community",
    children: [
      { href: "/community/notice", key: "notice" },
      { href: "/community/archive", key: "archive" },
      { href: "/community/gallery", key: "gallery" },
      { href: "/contact", key: "contact" },
    ],
  },
];

export const navItems = headerNav
  .flatMap((item) => [item, ...(item.children ?? [])])
  .filter(
    (item, index, arr) => arr.findIndex((x) => x.href === item.href) === index,
  );

export const evidenceNavItems = [
  { href: "/patents", key: "patents" },
  { href: "/certifications", key: "certifications" },
  { href: "/research", key: "research" },
] as const;

export const communityNavItems = [
  { href: "/community", key: "community" },
  { href: "/community/notice", key: "notice" },
  { href: "/community/archive", key: "archive" },
  { href: "/community/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export const footerExtraItems = [
  ...evidenceNavItems,
  ...communityNavItems,
  { href: "/store", key: "store" },
] as const;
