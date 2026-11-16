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

/** 관리자·슈퍼바이저 메뉴 (홈페이지 관리 제거) */
export const adminMenuGroups: AdminMenuGroup[] = [
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
