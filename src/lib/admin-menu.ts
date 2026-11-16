import type { Role } from "@/lib/session";

const cmsSections = [
  { key: "home", label: "홈" },
  { key: "meta", label: "로고·회사명" },
  { key: "nav", label: "메뉴" },
  { key: "footer", label: "하단" },
  { key: "cta", label: "버튼" },
  { key: "about", label: "회사소개" },
  { key: "technology", label: "기술" },
  { key: "solution", label: "솔루션" },
  { key: "product", label: "제품" },
  { key: "global", label: "글로벌" },
  { key: "business", label: "사업협력" },
  { key: "news", label: "소식" },
  { key: "contact", label: "문의" },
] as const;

export type AdminMenuItem = {
  href: string;
  label: string;
};

export type AdminMenuGroup = {
  key: string;
  label: string;
  supervisorOnly?: boolean;
  items: AdminMenuItem[];
};

/** 컴팩트 사이드바 — anyangmp 스타일(메인 CMS + 공지 분리) */
export const adminMenuGroups: AdminMenuGroup[] = [
  {
    key: "cms",
    label: "홈페이지",
    items: [
      { href: "/admin/cms", label: "메인·페이지 구성" },
      { href: "/admin/notices", label: "공지사항" },
      { href: "/admin/inquiries", label: "문의" },
      { href: "/admin/media", label: "자료 파일" },
    ],
  },
  {
    key: "members",
    label: "회원",
    items: [{ href: "/admin/members", label: "목록·승인" }],
  },
  {
    key: "orders",
    label: "주문",
    items: [{ href: "/admin/orders", label: "주문 목록" }],
  },
  {
    key: "solapi",
    label: "솔라피",
    items: [
      { href: "/admin/solapi", label: "SOLAPI 관리" },
      { href: "/admin/downloads", label: "문서 다운로드" },
    ],
  },
  {
    key: "account",
    label: "내 정보",
    items: [{ href: "/admin/staff-self-edit", label: "관리자 정보 수정" }],
  },
  {
    key: "supervisor",
    label: "슈퍼바이저",
    supervisorOnly: true,
    items: [
      { href: "/admin/users?focus=create", label: "관리자 등록" },
      { href: "/admin/users?focus=list", label: "관리자 리스트" },
      { href: "/admin/stats", label: "접속·이용 통계" },
      { href: "/admin/stats/db", label: "DB 통계" },
    ],
  },
];

export function menuGroupsForRole(role: Role) {
  return adminMenuGroups.filter((group) => !group.supervisorOnly || role === "supervisor");
}

/** /admin/cms — 페이지·공통 묶음 (중복 카드 제거) */
export const cmsSectionGroups = [
  {
    title: "메인·공통",
    keys: ["home", "meta", "nav", "footer", "cta"] as const,
  },
  {
    title: "페이지",
    keys: [
      "about",
      "technology",
      "solution",
      "product",
      "global",
      "business",
      "news",
      "contact",
    ] as const,
  },
] as const;

export function cmsSectionLinks() {
  const byKey = new Map(cmsSections.map((s) => [s.key, s]));
  return cmsSectionGroups.map((group) => ({
    title: group.title,
    items: group.keys
      .map((key) => byKey.get(key))
      .filter((s): s is (typeof cmsSections)[number] => Boolean(s))
      .map((s) => ({
        label: s.label,
        href: `/admin/content?section=${s.key}`,
      })),
  }));
}

export const cmsExtraLinks = [
  { label: "갤러리·자료 게시", href: "/admin/posts" },
] as const;