import { headerNav, type HeaderNavItem, type NavLink } from "@/lib/site";

export type SectionNavContext = {
  parent: HeaderNavItem;
  siblings: NavLink[];
  current: NavLink | null;
  currentIndex: number;
  prev: NavLink | null;
  next: NavLink | null;
  onHub: boolean;
};

/** i18n pathname — locale prefix 없음 */
export function normalizePublicPath(pathname: string) {
  const raw = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function sectionNavForPath(pathname: string): SectionNavContext | null {
  const path = normalizePublicPath(pathname);

  for (const parent of headerNav) {
    if (!parent.children?.length) continue;

    if (path === parent.href) {
      return {
        parent,
        siblings: parent.children,
        current: null,
        currentIndex: -1,
        prev: null,
        next: parent.children[0] ?? null,
        onHub: true,
      };
    }

    const idx = parent.children.findIndex(
      (child) => path === child.href || path.startsWith(`${child.href}/`),
    );
    if (idx >= 0) {
      const current = parent.children[idx]!;
      return {
        parent,
        siblings: parent.children,
        current,
        currentIndex: idx,
        prev: idx > 0 ? parent.children[idx - 1]! : null,
        next: idx < parent.children.length - 1 ? parent.children[idx + 1]! : null,
        onHub: false,
      };
    }
  }
  return null;
}

export function truncateExcerpt(text: string, max = 220) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max).trimEnd()}…`;
}