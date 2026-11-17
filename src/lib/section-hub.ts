import { images } from "@/lib/site";
import { PRODUCT_CATEGORY_PATHS, PRODUCT_LINE_CATEGORIES } from "@/lib/product-categories";

export type HubMessageNs =
  | "aboutGreeting"
  | "aboutFeatures"
  | "solution"
  | "global"
  | "business"
  | "product"
  | "contact"
  | "patents"
  | "certifications"
  | "researchPage"
  | "community";

export type HubBlockDef = {
  href: string;
  navKey: string;
  image: string;
  messageNs: HubMessageNs;
  titleKey: string;
  excerptKey: string;
};

export const ABOUT_HUB_BLOCKS: HubBlockDef[] = [
  {
    href: "/about/greeting",
    navKey: "greeting",
    image: images.close,
    messageNs: "aboutGreeting",
    titleKey: "title",
    excerptKey: "body",
  },
  {
    href: "/about/features",
    navKey: "features",
    image: images.lab,
    messageNs: "aboutFeatures",
    titleKey: "title",
    excerptKey: "lede",
  },
  {
    href: "/solution",
    navKey: "solution",
    image: images.wellness,
    messageNs: "solution",
    titleKey: "title",
    excerptKey: "lede",
  },
  {
    href: "/global",
    navKey: "global",
    image: images.close,
    messageNs: "global",
    titleKey: "title",
    excerptKey: "lede",
  },
  {
    href: "/business",
    navKey: "business",
    image: images.lab,
    messageNs: "business",
    titleKey: "title",
    excerptKey: "lede",
  },
];

export const PRODUCT_HUB_BLOCKS: HubBlockDef[] = PRODUCT_LINE_CATEGORIES.map((key) => ({
  href: `/product/${PRODUCT_CATEGORY_PATHS[key]}`,
  navKey: key,
  image:
    key === "healthFood"
      ? images.breakfast
      : key === "generalFood"
        ? images.drink
        : key === "cosmetics"
          ? images.beauty
          : key === "patch"
            ? images.leaves
            : images.wellness,
  messageNs: "product",
  titleKey: `categories.${key}.title`,
  excerptKey: `categories.${key}.text`,
}));

export const TECHNOLOGY_HUB_BLOCKS: HubBlockDef[] = [
  {
    href: "/patents",
    navKey: "patents",
    image: images.lab,
    messageNs: "patents",
    titleKey: "title",
    excerptKey: "lede",
  },
  {
    href: "/certifications",
    navKey: "certifications",
    image: images.vein,
    messageNs: "certifications",
    titleKey: "title",
    excerptKey: "lede",
  },
  {
    href: "/research",
    navKey: "research",
    image: images.leaves,
    messageNs: "researchPage",
    titleKey: "title",
    excerptKey: "lede",
  },
];

export const COMMUNITY_HUB_BLOCKS: HubBlockDef[] = [
  {
    href: "/community/notice",
    navKey: "notice",
    image: images.close,
    messageNs: "community",
    titleKey: "sections.notice",
    excerptKey: "noticeLede",
  },
  {
    href: "/community/archive",
    navKey: "archive",
    image: images.lab,
    messageNs: "community",
    titleKey: "sections.archive",
    excerptKey: "archiveLede",
  },
  {
    href: "/community/gallery",
    navKey: "gallery",
    image: images.beauty,
    messageNs: "community",
    titleKey: "sections.gallery",
    excerptKey: "galleryLede",
  },
  {
    href: "/contact",
    navKey: "contact",
    image: images.close,
    messageNs: "contact",
    titleKey: "title",
    excerptKey: "lede",
  },
];