import type { ReactNode } from "react";
import { BusinessCmsBody } from "@/components/admin/BusinessCmsBody";
import { FeaturesCmsBody } from "@/components/admin/FeaturesCmsBody";
import { GlobalCmsBody } from "@/components/admin/GlobalCmsBody";
import { HubCmsBody } from "@/components/admin/HubCmsBody";
import {
  ProductCategoryCmsBody,
  ProductHubCmsBody,
} from "@/components/admin/ProductCmsBody";
import { SolutionCmsBody } from "@/components/admin/SolutionCmsBody";
import type { CmsPageDef } from "@/lib/cms-pages";
import {
  ABOUT_HUB_BLOCKS,
  COMMUNITY_HUB_BLOCKS,
  TECHNOLOGY_HUB_BLOCKS,
} from "@/lib/section-hub";

const PUBLIC_HERO_PAGE_KEYS = new Set([
  "about",
  "greeting",
  "features",
  "solution",
  "global",
  "business",
  "product",
  "technology",
  "community",
  "healthFood",
  "generalFood",
  "cosmetics",
  "patch",
  "healthPlatform",
  "contact",
]);

export function cmsUsesPublicHero(pageKey: string) {
  return PUBLIC_HERO_PAGE_KEYS.has(pageKey);
}

export function resolveCmsVisualBody({
  page,
  values,
  activeSlot,
  onSelectSlot,
  onPickImage,
}: {
  page: CmsPageDef;
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
  onPickImage: (path: string) => void;
}): ReactNode {
  const props = { values, activeSlot, onSelectSlot };

  if (page.key === "about") {
    return (
      <HubCmsBody
        section="about"
        blocks={ABOUT_HUB_BLOCKS}
        cardMeta={{
          greeting: { label: "인사말" },
          features: { label: "회사특징" },
          solution: { label: "솔루션" },
          global: { label: "글로벌" },
          business: { label: "사업협력" },
        }}
        {...props}
        onPickImage={onPickImage}
      />
    );
  }
  if (page.key === "technology") {
    return (
      <HubCmsBody
        section="technology"
        blocks={TECHNOLOGY_HUB_BLOCKS}
        cardMeta={{
          patents: { label: "지식재산권" },
          certifications: { label: "인증·규제" },
          research: { label: "연구·임상" },
        }}
        {...props}
        onPickImage={onPickImage}
      />
    );
  }
  if (page.key === "community") {
    return (
      <HubCmsBody
        section="community"
        blocks={COMMUNITY_HUB_BLOCKS}
        cardMeta={{
          notice: {
            label: "공지사항",
            titlePath: "community.sections.notice",
            excerptPath: "community.noticeLede",
          },
          archive: {
            label: "자료실",
            titlePath: "community.sections.archive",
            excerptPath: "community.archiveLede",
          },
          gallery: {
            label: "갤러리",
            titlePath: "community.sections.gallery",
            excerptPath: "community.galleryLede",
          },
          contact: { label: "문의" },
        }}
        {...props}
        onPickImage={onPickImage}
      />
    );
  }
  if (page.key === "features") return <FeaturesCmsBody {...props} />;
  if (page.key === "solution") {
    return <SolutionCmsBody {...props} onPickImage={onPickImage} />;
  }
  if (page.key === "global") {
    return <GlobalCmsBody {...props} onPickImage={onPickImage} />;
  }
  if (page.key === "business") {
    return <BusinessCmsBody {...props} onPickImage={onPickImage} />;
  }
  if (page.key === "product") {
    return <ProductHubCmsBody {...props} onPickImage={onPickImage} />;
  }
  if (page.productCategory) {
    return (
      <ProductCategoryCmsBody
        category={page.productCategory}
        {...props}
        onPickImage={onPickImage}
      />
    );
  }
  return undefined;
}
