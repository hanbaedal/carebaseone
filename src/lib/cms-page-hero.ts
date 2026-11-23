import { images } from "@/lib/site";
import type { CmsPageDef } from "@/lib/cms-pages";
import type { ProductLineCategory } from "@/lib/product-categories";
import { productCategoryImagePath, resolveHubBlockImageSrc } from "@/lib/hub-media";
import { resolveHeroImageSrc } from "@/lib/home-hero";
import { sectionHeroImagePath } from "@/lib/cms-typography";

const HERO_IMAGE_BY_KEY: Record<string, string> = {
  about: images.close,
  technology: images.leaves,
  community: images.close,
  greeting: images.close,
  features: images.lab,
  solution: images.wellness,
  global: images.close,
  business: images.lab,
  product: images.breakfast,
  healthFood: images.breakfast,
  generalFood: images.drink,
  cosmetics: images.beauty,
  patch: images.leaves,
  healthPlatform: images.wellness,
  contact: images.close,
};

export function cmsPageHeroImage(pageKey: string) {
  return HERO_IMAGE_BY_KEY[pageKey] ?? images.hero;
}

export function resolveCmsPageHeroRaw(
  section: string,
  values: Record<string, string>,
  productCategory?: ProductLineCategory | null,
) {
  if (productCategory) {
    return (values[productCategoryImagePath(productCategory)] ?? "").trim();
  }
  return (values[sectionHeroImagePath(section)] ?? "").trim();
}

export function resolveCmsPageHeroSrc(
  section: string,
  values: Record<string, string>,
  pageKey: string,
  productCategory?: ProductLineCategory | null,
) {
  const raw = resolveCmsPageHeroRaw(section, values, productCategory);
  if (raw) return resolveHeroImageSrc(raw);
  return cmsPageHeroImage(pageKey);
}

export function cmsPageHeroImagePath(
  section: string,
  productCategory?: ProductLineCategory | null,
) {
  if (productCategory) return productCategoryImagePath(productCategory);
  return sectionHeroImagePath(section);
}

/** 히어로에 노출할 슬롯 경로 (없으면 null) */
export type CmsHeroSlots = {
  kicker: string | null;
  title: string | null;
  lede: string | null;
};

export function cmsHeroSlots(page: CmsPageDef): CmsHeroSlots {
  const section = page.section;
  const category = page.productCategory;

  if (category) {
    return {
      kicker: `${section}.kicker`,
      title: `${section}.categories.${category}.title`,
      lede: `${section}.categories.${category}.text`,
    };
  }

  return {
    kicker: `${section}.kicker`,
    title: `${section}.title`,
    lede: messagesHasLede(section) ? `${section}.lede` : null,
  };
}

function messagesHasLede(section: string) {
  // 인사말은 본문(body)만 쓰고 히어로 lede는 숨김. 문의는 공개 페이지와 같이 lede 노출.
  return section !== "aboutGreeting";
}

export function isCmsImageFieldPath(path: string) {
  return (
    path.endsWith("heroImage") ||
    path.endsWith("sideImage") ||
    path.endsWith(".image")
  );
}

export function isCmsMetaFieldPath(path: string) {
  return (
    path.endsWith("footerBg") ||
    path.endsWith("footerText") ||
    path.endsWith("Scale") ||
    path.endsWith("Color") ||
    path.endsWith("Font") ||
    isCmsImageFieldPath(path)
  );
}

export function cmsContentFieldPaths(paths: string[], hero: CmsHeroSlots) {
  const heroSet = new Set(
    [hero.kicker, hero.title, hero.lede].filter((p): p is string => Boolean(p)),
  );
  return paths.filter((path) => !isCmsMetaFieldPath(path) && !heroSet.has(path));
}

export type { ProductLineCategory };