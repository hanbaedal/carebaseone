import type { Role } from "@/lib/session";

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

/** 관리자·슈퍼바이저 공통 + 슈퍼바이저 전용 그룹 */
export const adminMenuGroups: AdminMenuGroup[] = [
  {
    key: "site",
    label: "홈페이지 관리",
    items: [
      { href: "/admin/site", label: "구성 한눈에 보기" },
      { href: "/admin/content?section=nav", label: "메뉴" },
      { href: "/admin/content?section=meta", label: "로고·회사명" },
      { href: "/admin/content?section=home", label: "홈" },
      { href: "/admin/posts", label: "공지·자료실·갤러리" },
      { href: "/admin/inquiries", label: "문의 게시판" },
      { href: "/admin/media", label: "자료 파일" },
    ],
  },
  {
    key: "members",
    label: "회원 관리",
    items: [{ href: "/admin/members", label: "회원 목록·승인" }],
  },
  {
    key: "orders",
    label: "주문 관리",
    items: [{ href: "/admin/orders", label: "주문 목록" }],
  },
  {
    key: "supervisor",
    label: "슈퍼바이저",
    supervisorOnly: true,
    items: [
      { href: "/admin/users?focus=create", label: "관리자 등록" },
      { href: "/admin/users?focus=list", label: "관리자 리스트" },
      { href: "/admin/stats", label: "접속·이용 통계" },
      { href: "/admin/stats/db", label: "디비사용 통계" },
      { href: "/admin/stats/solapi", label: "SOLAPI 이용 현황" },
      { href: "/admin/downloads", label: "문서 다운로드" },
    ],
  },
];

export function menuGroupsForRole(role: Role) {
  return adminMenuGroups.filter((group) => !group.supervisorOnly || role === "supervisor");
}

/** 홈페이지 관리 — 사이트맵과 같은 카드 묶음 */
export const adminSiteHubGroups = [
  {
    key: "about",
    title: "회사소개",
    shell: "border-slate-200/90 bg-slate-50",
    links: [
      { label: "회사소개", href: "/admin/content?section=about" },
      { label: "솔루션", href: "/admin/content?section=solution" },
      { label: "글로벌", href: "/admin/content?section=global" },
      { label: "사업협력", href: "/admin/content?section=business" },
    ],
  },
  {
    key: "technology",
    title: "기술",
    shell: "border-sky-200/80 bg-sky-50",
    links: [
      { label: "기술", href: "/admin/content?section=technology" },
      { label: "지식재산권", href: "/admin/media" },
      { label: "인증·규제", href: "/admin/media" },
      { label: "연구·임상", href: "/admin/media" },
    ],
  },
  {
    key: "product",
    title: "제품",
    shell: "border-emerald-200/80 bg-emerald-50",
    links: [{ label: "제품", href: "/admin/content?section=product" }],
  },
  {
    key: "community",
    title: "커뮤니티",
    shell: "border-teal-200/80 bg-teal-50",
    links: [
      { label: "커뮤니티 소개", href: "/admin/content?section=news" },
      { label: "공지사항", href: "/admin/posts" },
      { label: "자료실", href: "/admin/posts" },
      { label: "갤러리", href: "/admin/posts" },
      { label: "문의", href: "/admin/inquiries" },
      { label: "문의 페이지", href: "/admin/content?section=contact" },
    ],
  },
] as const;

export const adminSiteHubExtra = [
  { label: "메뉴", href: "/admin/content?section=nav" },
  { label: "로고·회사명", href: "/admin/content?section=meta" },
  { label: "홈", href: "/admin/content?section=home" },
  { label: "하단", href: "/admin/content?section=footer" },
  { label: "버튼", href: "/admin/content?section=cta" },
] as const;
