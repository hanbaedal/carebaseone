import { menuGroupsForRole } from "@/lib/admin-menu";
import type { Role } from "@/lib/session";

export type HeaderRoleLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type HeaderRoleGroup = {
  key: string;
  label: string;
  href: string;
  links: HeaderRoleLink[];
};

/** 회원 로그인 시 헤더에 붙는 메뉴 */
export const memberHeaderGroup: HeaderRoleGroup = {
  key: "memberArea",
  label: "회원",
  href: "/store",
  links: [
    { href: "/store", label: "스토어·주문" },
    { href: "/member/orders", label: "내 주문" },
    { href: "/member/profile", label: "프로필" },
    { href: "/community/notice", label: "공지사항" },
    { href: "/community/archive", label: "자료실" },
  ],
};

/** 관리자·슈퍼바이저 로그인 시 헤더 메뉴 (권한별) — 공개 커뮤니티 바로 다음에 붙음 */
export function staffHeaderGroups(role: Role): HeaderRoleGroup[] {
  return menuGroupsForRole(role).map((group) => ({
    key: group.key,
    label: group.label,
    href: group.href ?? group.items[0]?.href ?? "/admin",
    links: group.items.map((item) => ({
      href: item.href,
      label: item.label,
      external: item.href.startsWith("/admin"),
    })),
  }));
}
