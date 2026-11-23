import type { ReactNode } from "react";
import { BusinessCmsBody } from "@/components/admin/BusinessCmsBody";
import { FeaturesCmsBody } from "@/components/admin/FeaturesCmsBody";
import { GlobalCmsBody } from "@/components/admin/GlobalCmsBody";
import {
  ProductCategoryCmsBody,
  ProductHubCmsBody,
} from "@/components/admin/ProductCmsBody";
import { SolutionCmsBody } from "@/components/admin/SolutionCmsBody";
import type { CmsPageDef } from "@/lib/cms-pages";

const PUBLIC_HERO_PAGE_KEYS = new Set([
  "greeting",
  "features",
  "solution",
  "global",
  "business",
  "product",
  "healthFood",
  "generalFood",
  "cosmetics",
  "patch",
  "healthPlatform",
]);

export function cmsUsesPublicHero(pageKey: string) {
  return PUBLIC_HERO_PAGE_KEYS.has(pageKey);
}

export function resolveCmsVisualBody({
  page,
  values,
  activeSlot,
  onSelectSlot,
}: {
  page: CmsPageDef;
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}): ReactNode {
  const props = { values, activeSlot, onSelectSlot };

  if (page.key === "features") return <FeaturesCmsBody {...props} />;
  if (page.key === "solution") return <SolutionCmsBody {...props} />;
  if (page.key === "global") return <GlobalCmsBody {...props} />;
  if (page.key === "business") return <BusinessCmsBody {...props} />;
  if (page.key === "product") return <ProductHubCmsBody {...props} />;
  if (page.productCategory) {
    return <ProductCategoryCmsBody category={page.productCategory} {...props} />;
  }
  return undefined;
}
