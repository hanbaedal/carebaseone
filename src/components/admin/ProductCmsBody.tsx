"use client";

import Image from "next/image";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  productCategoryImagePath,
  resolveHubBlockImageSrc,
} from "@/lib/hub-media";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";
import { PRODUCT_HUB_BLOCKS } from "@/lib/section-hub";

const PRODUCT_FALLBACK_BY_KEY = Object.fromEntries(
  PRODUCT_HUB_BLOCKS.map((block) => [block.navKey, block.image]),
) as Record<ProductLineCategory, string>;

export function ProductHubCmsBody({
  values,
  activeSlot,
  onSelectSlot,
  onPickImage,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
  onPickImage: (path: string) => void;
}) {
  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
      <button
        type="button"
        onClick={() => onSelectSlot("product.note")}
        className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === "product.note")}`}
      >
        <p className="rounded-xl border border-line bg-brand/5 px-4 py-3 text-sm leading-7 text-brand-ink/75">
          {cmsPreviewText(values["product.note"] ?? "", "제품 안내 노트")}
        </p>
      </button>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-brand-ink/60">
        <button
          type="button"
          onClick={() => onSelectSlot("product.proofLink")}
          className={`border-0 bg-transparent p-1 text-brand ${cmsSlotRing(activeSlot === "product.proofLink")}`}
        >
          {cmsPreviewText(values["product.proofLink"] ?? "", "연구·임상 자료")}
        </button>
        <span className="text-brand-ink/30">·</span>
        <button
          type="button"
          onClick={() => onSelectSlot("product.certLink")}
          className={`border-0 bg-transparent p-1 text-brand ${cmsSlotRing(activeSlot === "product.certLink")}`}
        >
          {cmsPreviewText(values["product.certLink"] ?? "", "인증·규제")}
        </button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {PRODUCT_LINE_CATEGORIES.map((key) => {
          const titlePath = `product.categories.${key}.title`;
          const textPath = `product.categories.${key}.text`;
          const itemsPath = `product.categories.${key}.items`;
          const imagePath = productCategoryImagePath(key);
          const imageSrc = resolveHubBlockImageSrc(
            PRODUCT_FALLBACK_BY_KEY[key],
            values[imagePath],
          );
          return (
            <article
              key={key}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => onPickImage(imagePath)}
                aria-label="카테고리 이미지 편집"
                className={`relative aspect-[16/10] w-full border-0 bg-transparent p-0 ${cmsSlotRing(activeSlot === imagePath)}`}
              >
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 45vw, 100vw"
                  unoptimized={heroImageUnoptimized(imageSrc)}
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-[11px] font-medium text-white">
                  이미지 클릭하여 변경
                </span>
              </button>
              <div className="p-5">
                <button
                  type="button"
                  onClick={() => onSelectSlot(titlePath)}
                  className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === titlePath)}`}
                >
                  <span className="text-lg font-semibold text-brand-ink">
                    {cmsPreviewText(values[titlePath] ?? "", "카테고리 제목")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSlot(textPath)}
                  className={`mt-3 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === textPath)}`}
                >
                  <span className="text-sm leading-7 text-brand-ink/70">
                    {cmsPreviewText(values[textPath] ?? "", "카테고리 소개")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSlot(itemsPath)}
                  className={`mt-3 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === itemsPath)}`}
                >
                  <span className="text-xs text-brand-ink/50">
                    {cmsPreviewText(values[itemsPath] ?? "", "대표 품목")}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ProductCategoryCmsBody({
  category,
  values,
  activeSlot,
  onSelectSlot,
  onPickImage,
}: {
  category: ProductLineCategory;
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
  onPickImage: (path: string) => void;
}) {
  const titlePath = `product.categories.${category}.title`;
  const textPath = `product.categories.${category}.text`;
  const itemsPath = `product.categories.${category}.items`;
  const imagePath = productCategoryImagePath(category);
  const imageSrc = resolveHubBlockImageSrc(
    PRODUCT_FALLBACK_BY_KEY[category],
    values[imagePath],
  );

  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
      <button
        type="button"
        onClick={() => onPickImage(imagePath)}
        aria-label="카테고리 이미지 편집"
        className={`relative mb-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl border-0 bg-transparent p-0 ${cmsSlotRing(activeSlot === imagePath)}`}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 768px) 48rem, 100vw"
          unoptimized={heroImageUnoptimized(imageSrc)}
        />
        <span className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-[11px] font-medium text-white">
          이미지 클릭하여 변경
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectSlot(titlePath)}
        className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === titlePath)}`}
      >
        <span className="text-2xl font-semibold text-brand-ink">
          {cmsPreviewText(values[titlePath] ?? "", "카테고리 제목")}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectSlot(textPath)}
        className={`mt-4 block w-full max-w-2xl border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === textPath)}`}
      >
        <span className="text-base leading-8 text-brand-ink/70">
          {cmsPreviewText(values[textPath] ?? "", "카테고리 소개")}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectSlot(itemsPath)}
        className={`mt-6 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === itemsPath)}`}
      >
        <p className="rounded-xl border border-dashed border-brand/25 bg-brand/5 px-4 py-3 text-sm text-brand-ink/75">
          {cmsPreviewText(values[itemsPath] ?? "", "대표 품목")}
        </p>
      </button>
      <button
        type="button"
        onClick={() => onSelectSlot("product.note")}
        className={`mt-8 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === "product.note")}`}
      >
        <p className="text-sm leading-7 text-brand-ink/60">
          {cmsPreviewText(values["product.note"] ?? "", "제품 안내 노트")}
        </p>
      </button>
    </section>
  );
}
