/** anyangmp /manage/cms 형식 — 미리보기 URL + 편집 섹션 매핑 */

import type { ProductLineCategory } from "@/lib/product-categories";
import { PRODUCT_CATEGORY_PATHS } from "@/lib/product-categories";

export type CmsPageDef = {
  key: string;
  label: string;
  /** 공개 미리보기 경로 */
  preview: string;
  /** contents 섹션 키 */
  section: string;
  tab: "main" | "submenu";
  /** 제품 라인 — `product` 섹션의 카테고리 슬롯만 강조 */
  productCategory?: ProductLineCategory;
  /** 슬롯 경로 → 한글 라벨 */
  fieldLabels?: Record<string, string>;
};

const PRODUCT_LINE_CATEGORY_PAGES: CmsPageDef[] = (
  [
    ["healthFood", "건강식품"],
    ["generalFood", "일반식품"],
    ["cosmetics", "화장품"],
    ["patch", "패치"],
    ["healthPlatform", "건강관리플랫폼"],
  ] as const
).map(([key, label]) => ({
  key,
  label,
  preview: `/ko/product/${PRODUCT_CATEGORY_PATHS[key]}`,
  section: "product",
  tab: "submenu" as const,
  productCategory: key,
  fieldLabels: {
    "product.kicker": "키커",
    [`product.categories.${key}.title`]: "카테고리 제목",
    [`product.categories.${key}.text`]: "카테고리 소개",
    [`product.categories.${key}.items`]: "대표 품목",
  },
}));

export const CMS_PAGES: CmsPageDef[] = [
  {
    key: "home",
    label: "메인 홈",
    preview: "/ko",
    section: "home",
    tab: "main",
    fieldLabels: {
      "home.heroImage": "배경 이미지",
      "home.kicker": "키커",
      "home.kickerFont": "키커 글자 폰트",
      "home.kickerScale": "키커 글자 크기(50~300%)",
      "home.kickerColor": "키커 글자 컬러",
      "home.headline": "메인 헤드라인 (줄바꿈은 Enter)",
      "home.headlineFont": "헤드라인 글자 폰트",
      "home.headlineScale": "헤드라인 글자 크기(50~300%)",
      "home.headlineColor": "헤드라인 글자 컬러",
      "home.lede": "소개 문구",
      "home.ledeFont": "소개 문구 글자 폰트",
      "home.ledeScale": "소개 문구 글자 크기(50~300%)",
      "home.ledeColor": "소개 문구 글자 컬러",
      "home.footerBg": "풋터 배경색",
    },
  },
  {
    key: "greeting",
    label: "인사말",
    preview: "/ko/about/greeting",
    section: "aboutGreeting",
    tab: "submenu",
    fieldLabels: {
      "aboutGreeting.heroImage": "배경 이미지",
      "aboutGreeting.kicker": "키커",
      "aboutGreeting.title": "제목",
      "aboutGreeting.body": "인사말 본문",
      "aboutGreeting.sign": "서명",
      "aboutGreeting.ctaFeatures": "회사특징 버튼",
      "aboutGreeting.ctaContact": "문의 버튼",
    },
  },
  {
    key: "features",
    label: "회사특징",
    preview: "/ko/about/features",
    section: "aboutFeatures",
    tab: "submenu",
  },
  {
    key: "solution",
    label: "솔루션",
    preview: "/ko/solution",
    section: "solution",
    tab: "submenu",
  },
  {
    key: "global",
    label: "글로벌",
    preview: "/ko/global",
    section: "global",
    tab: "submenu",
  },
  {
    key: "business",
    label: "사업협력",
    preview: "/ko/business",
    section: "business",
    tab: "submenu",
  },
  {
    key: "product",
    label: "제품",
    preview: "/ko/product",
    section: "product",
    tab: "submenu",
  },
  ...PRODUCT_LINE_CATEGORY_PAGES,
  {
    key: "contact",
    label: "문의",
    preview: "/ko/contact",
    section: "contact",
    tab: "submenu",
  },
];

export function cmsPageByKey(key: string | undefined | null) {
  return CMS_PAGES.find((p) => p.key === key) ?? CMS_PAGES[0];
}

export function fieldLabelFor(page: CmsPageDef, path: string) {
  if (path.endsWith(".footerBg")) return "풋터 배경색";
  return page.fieldLabels?.[path] ?? path.split(".").slice(1).join(" · ");
}
