import { menuGroupsForRole } from "@/lib/admin-menu";
import type { Role } from "@/lib/session";

export type HubLink = {
  href: string;
  label: string;
  heading?: boolean;
};

export type HubGroup = {
  key: string;
  title: string;
  links: HubLink[];
};

export const memberHubGroups: HubGroup[] = [
  {
    key: "member",
    title: "회원",
    links: [
      { href: "/store", label: "스토어·주문" },
      { href: "/member/orders", label: "내 주문" },
      { href: "/member/profile", label: "프로필" },
      { href: "/community/notice", label: "공지사항" },
      { href: "/community/archive", label: "자료실" },
    ],
  },
];

export function staffHubGroups(role: Role): HubGroup[] {
  return menuGroupsForRole(role).map((group) => ({
    key: group.key,
    title: group.label,
    links: group.items.map((item) => ({
      href: item.href,
      label: item.label,
      heading: item.heading,
    })),
  }));
}