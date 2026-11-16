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

/** 컴팩트 사이드바 — anyangmp 스타일(메인 CMS + 공지 분리) */
export const adminMenuGroups: AdminMenuGroup[] = [
  {
    key: "cms",
    label: "홈페이지 관리",
    items: [
      { href: "/admin/cms", label: "사이트 구성 (공개와 동일)" },
      { href: "/admin/notices", label: "공지사항" },
      { href: "/admin/inquiries", label: "문의" },
      { href: "/admin/media", label: "자료 파일" },
      { href: "/admin/posts", label: "갤러리·자료" },
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
