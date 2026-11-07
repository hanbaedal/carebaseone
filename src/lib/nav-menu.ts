import { headerNav } from "@/lib/site";

/** 헤더·사이트맵에 쓰는 nav 키 (관리 화면 그룹용) */
export function headerNavLabelPaths() {
  return headerNav.flatMap((item) => [
    `nav.${item.key}`,
    ...(item.children?.map((child) => `nav.${child.key}`) ?? []),
  ]);
}

export const navMenuGroups = headerNav.map((item) => ({
  key: item.key,
  href: item.href,
  children: item.children ?? [],
}));
