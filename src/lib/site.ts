export const siteUrl = "https://carebaseone.com";

export const images = {
  hero: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80",
  leaves: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80",
  vein: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80",
  close: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80",
  vascular: "https://images.unsplash.com/photo-1529333166437-7750a6dd5d70?auto=format&fit=crop&w=1600&q=80",
  sports: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1600&q=80",
  senior: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
  beauty: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80",
  wellness: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
  breakfast: "https://images.unsplash.com/photo-1493770348161-369560ae630e?auto=format&fit=crop&w=1600&q=80",
  drink: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80",
  korea: "https://images.unsplash.com/photo-1548115184-bc6544d3b13d?auto=format&fit=crop&w=1600&q=80",
  china: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=1600&q=80",
  usa: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=80",
  lab: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80",
} as const;

export type NavLink = { href: string; key: string };

/** 메인 화면·헤더 상단 6개 메뉴 (첨부 디자인 기준) */
export type HeaderNavItem = NavLink & {
  children?: NavLink[];
};

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
];

export type NavGroup = {
  /** home.pillars.{groupKey} 또는 nav.groups.{groupKey} */
  groupKey: string;
  children: NavLink[];
};

/** 사이트맵: 01~05 필러 + 커뮤니티·회원 */
export const navGroups: NavGroup[] = [
  {
    groupKey: "technology",
    children: [
      { href: "/technology", key: "technology" },
      { href: "/patents", key: "patents" },
      { href: "/certifications", key: "certifications" },
      { href: "/research", key: "research" },
    ],
  },
  {
    groupKey: "product",
    children: [{ href: "/product", key: "product" }],
  },
  {
    groupKey: "solution",
    children: [{ href: "/solution", key: "solution" }],
  },
  {
    groupKey: "global",
    children: [{ href: "/global", key: "global" }],
  },
  {
    groupKey: "business",
    children: [{ href: "/business", key: "business" }],
  },
  {
    groupKey: "community",
    children: [
      { href: "/community", key: "community" },
      { href: "/community/notice", key: "notice" },
      { href: "/community/archive", key: "archive" },
      { href: "/community/gallery", key: "gallery" },
      { href: "/contact", key: "contact" },
    ],
  },
  {
    groupKey: "member",
    children: [
      { href: "/store", key: "store" },
      { href: "/member/login", key: "memberLogin" },
      { href: "/member/signup", key: "memberSignup" },
    ],
  },
];

export const navItems = [
  ...headerNav.flatMap((item) => [item, ...(item.children ?? [])]),
  ...navGroups.flatMap((g) => g.children),
].filter(
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
] as const;

export const footerExtraItems = [
  ...evidenceNavItems,
  ...communityNavItems,
  { href: "/store", key: "store" },
  { href: "/contact", key: "contact" },
] as const;
