import { images } from "@/lib/site";

export type CmsGalleryImageDef = {
  /** media.slug */
  slug: string;
  /** public URL under /images/... */
  publicPath: string;
  titleKo: string;
  titleEn: string;
  titleZh: string;
  fileName: string;
  mime: string;
};

const SITE_TITLES: Record<keyof typeof images, { ko: string; en: string; zh: string }> = {
  hero: { ko: "메인 히어로", en: "Home hero", zh: "首页主图" },
  leaves: { ko: "잎사귀", en: "Leaves", zh: "叶片" },
  vein: { ko: "혈관·순환", en: "Vein", zh: "血管" },
  close: { ko: "클로즈업", en: "Close-up", zh: "特写" },
  vascular: { ko: "혈관 건강", en: "Vascular", zh: "血管健康" },
  sports: { ko: "스포츠", en: "Sports", zh: "运动" },
  senior: { ko: "시니어", en: "Senior", zh: "银发" },
  beauty: { ko: "뷰티", en: "Beauty", zh: "美容" },
  wellness: { ko: "웰니스", en: "Wellness", zh: "康养" },
  breakfast: { ko: "건강식품", en: "Health food", zh: "健康食品" },
  drink: { ko: "음료·식품", en: "Drink", zh: "饮品" },
  korea: { ko: "한국", en: "Korea", zh: "韩国" },
  china: { ko: "중국", en: "China", zh: "中国" },
  usa: { ko: "미국", en: "USA", zh: "美国" },
  lab: { ko: "연구실", en: "Lab", zh: "实验室" },
};

const PRODUCT_IMAGES: CmsGalleryImageDef[] = [
  {
    slug: "gallery-product-jaryeon-cushion",
    publicPath: "/images/products/jaryeon-cushion.jpg",
    titleKo: "제품 · 자련 쿠션",
    titleEn: "Product · Jaryeon cushion",
    titleZh: "产品 · 慈莲气垫",
    fileName: "jaryeon-cushion.jpg",
    mime: "image/jpeg",
  },
  {
    slug: "gallery-product-jaryeon-cushion-open",
    publicPath: "/images/products/jaryeon-cushion-open.jpg",
    titleKo: "제품 · 자련 쿠션 구성",
    titleEn: "Product · Jaryeon cushion open",
    titleZh: "产品 · 慈莲气垫开盒",
    fileName: "jaryeon-cushion-open.jpg",
    mime: "image/jpeg",
  },
  {
    slug: "gallery-product-jaryeon-cushion-box",
    publicPath: "/images/products/jaryeon-cushion-box.jpg",
    titleKo: "제품 · 자련 쿠션 박스",
    titleEn: "Product · Jaryeon cushion box",
    titleZh: "产品 · 慈莲气垫盒",
    fileName: "jaryeon-cushion-box.jpg",
    mime: "image/jpeg",
  },
  {
    slug: "gallery-product-patch-line",
    publicPath: "/images/products/patch-line-promo.png",
    titleKo: "제품 · 패치 라인",
    titleEn: "Product · Patch line",
    titleZh: "产品 · 贴剂线",
    fileName: "patch-line-promo.png",
    mime: "image/png",
  },
  {
    slug: "gallery-product-us-recoverx",
    publicPath: "/images/products/us-recoverx-line.jpg",
    titleKo: "제품 · 미국 패치",
    titleEn: "Product · US patch line",
    titleZh: "产品 · 美国贴剂",
    fileName: "us-recoverx-line.jpg",
    mime: "image/jpeg",
  },
  {
    slug: "gallery-product-patent-garlic",
    publicPath: "/images/products/patent-garlic-sample.jpg",
    titleKo: "제품 · 마늘 특허 자료",
    titleEn: "Product · Garlic patent",
    titleZh: "产品 · 大蒜专利",
    fileName: "patent-garlic-sample.jpg",
    mime: "image/jpeg",
  },
];

/** 홈페이지·솔루션·글로벌 등에서 쓰는 정적 이미지 → 갤러리 등록 목록 */
export function cmsGalleryImageDefs(): CmsGalleryImageDef[] {
  const site = (Object.keys(images) as (keyof typeof images)[]).map((key) => {
    const publicPath = images[key];
    const titles = SITE_TITLES[key];
    const fileName = publicPath.split("/").pop() ?? `${key}.jpg`;
    const mime = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
    return {
      slug: `gallery-site-${key}`,
      publicPath,
      titleKo: `사이트 · ${titles.ko}`,
      titleEn: `Site · ${titles.en}`,
      titleZh: `站点 · ${titles.zh}`,
      fileName,
      mime,
    };
  });
  return [...site, ...PRODUCT_IMAGES];
}

export function cmsGalleryFallbackOptions() {
  return cmsGalleryImageDefs().map((item) => ({
    slug: item.slug,
    src: item.publicPath,
    title: item.titleKo,
  }));
}
