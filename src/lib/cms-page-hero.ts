import { images } from "@/lib/site";
import type { CmsPageDef } from "@/lib/cms-pages";
import type { ProductLineCategory } from "@/lib/product-categories";

const HERO_IMAGE_BY_KEY: Record<string, string> = {
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
  return !["aboutGreeting", "contact"].includes(section);
}

export function isCmsMetaFieldPath(path: string) {
  return (
    path.endsWith("footerBg") ||
    path.endsWith("footerText") ||
    path.endsWith("Scale") ||
    path.endsWith("Color") ||
    path.endsWith("Font") ||
    path.endsWith("heroImage")
  );
}

export function cmsContentFieldPaths(paths: string[], hero: CmsHeroSlots) {
  const heroSet = new Set(
    [hero.kicker, hero.title, hero.lede].filter((p): p is string => Boolean(p)),
  );
  return paths.filter((path) => !isCmsMetaFieldPath(path) && !heroSet.has(path));
}

export type { ProductLineCategory };