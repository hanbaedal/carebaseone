import type { Role } from "@/lib/session";

export type AdminMenuItem = {
  href: string;
  label: string;
  /** 드롭다운 구분 제목 (링크 없음) */
  heading?: boolean;
};

export type AdminMenuGroup = {
  key: string;
  label: string;
  /** 헤더 상위 링크 (없으면 첫 소메뉴) */
  href?: string;
  supervisorOnly?: boolean;
  items: AdminMenuItem[];
};

/** 관리자·슈퍼바이저 메뉴 — 헤더에서 공개 커뮤니티 다음에 표시 */
export const adminMenuGroups: AdminMenuGroup[] = [
  {
    key: "homepage",
    label: "홈페이지관리",
    href: "/admin/cms",
    items: [
      { href: "/admin/cms", label: "메인 홈" },
      { href: "", label: "회사소개", heading: true },
      { href: "/admin/cms?page=about", label: "회사소개(허브)" },
      { href: "/admin/cms?page=greeting", label: "인사말" },
      { href: "/admin/cms?page=features", label: "회사특징" },
      { href: "/admin/cms?page=solution", label: "솔루션" },
      { href: "/admin/cms?page=global", label: "글로벌" },
      { href: "/admin/cms?page=business", label: "사업협력" },
      { href: "", label: "제품", heading: true },
      { href: "/admin/cms?page=product", label: "제품(허브)" },
      { href: "/admin/cms?page=healthFood", label: "건강식품" },
      { href: "/admin/cms?page=generalFood", label: "일반식품" },
      { href: "/admin/cms?page=cosmetics", label: "화장품" },
      { href: "/admin/cms?page=patch", label: "패치" },
      { href: "/admin/cms?page=healthPlatform", label: "건강관리플랫폼" },
      { href: "", label: "기술", heading: true },
      { href: "/admin/cms?page=technology", label: "기술(허브)" },
      { href: "/admin/media?focus=patents", label: "지식재산권" },
      { href: "/admin/media?focus=certifications", label: "인증·규제" },
      { href: "/admin/media?focus=research", label: "연구·임상" },
      { href: "", label: "커뮤니티", heading: true },
      { href: "/admin/cms?page=community", label: "커뮤니티(허브)" },
      { href: "/admin/notices", label: "공지사항" },
      { href: "/admin/posts?type=archive", label: "자료실" },
      { href: "/admin/posts?type=gallery", label: "갤러리" },
      { href: "/admin/cms?page=contact", label: "문의 페이지" },
      { href: "/admin/inquiries", label: "문의 접수" },
    ],
  },
  {
    key: "members",
    label: "회원 관리",
    items: [{ href: "/admin/members", label: "목록·승인" }],
  },
  {
    key: "orders",
    label: "주문 관리",
    items: [{ href: "/admin/orders", label: "주문 목록" }],
  },
  {
    key: "account",
    label: "정보 관리",
    items: [
      { href: "/admin/staff-self-edit", label: "관리자 정보 수정" },
      { href: "/admin/solapi", label: "솔라피" },
      { href: "/admin/downloads", label: "문서 다운로드" },
    ],
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
