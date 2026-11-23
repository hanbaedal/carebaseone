"use client";

import Image from "next/image";
import catalog from "@/data/product-catalog.json";
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

function ring(active: boolean) {
  return active
    ? "rounded-md ring-2 ring-[#1a3a6e] ring-offset-2"
    : "rounded-md hover:ring-2 hover:ring-[#1a3a6e]/35 hover:ring-offset-2";
}

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

/** 회사특징과 동일: 히어로(배경·키커·제목·소개) + 본문 소개 + 카드 그리드 */
export function ProductCategoryCmsBody({
  category,
  values,
  activeSlot,
  onSelectSlot,
}: {
  category: ProductLineCategory;
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  const textPath = `product.categories.${category}.text`;
  const itemsPath = `product.categories.${category}.items`;
  const lines = catalog.lines.filter((line) => line.category === category);
  const itemLabels = (values[itemsPath] ?? "")
    .split(/[·•|,/]/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
      <button
        type="button"
        onClick={() => onSelectSlot(textPath)}
        className={`block max-w-4xl border-0 bg-transparent p-0 text-left ${ring(activeSlot === textPath)}`}
      >
        <p className="text-base leading-8 text-brand-ink/70">
          {cmsPreviewText(values[textPath] ?? "", "소개 문구")}
        </p>
      </button>

      <button
        type="button"
        onClick={() => onSelectSlot(itemsPath)}
        className={`mt-6 block max-w-4xl border-0 bg-transparent p-0 text-left ${ring(activeSlot === itemsPath)}`}
      >
        <p className="text-sm text-brand-ink/55">
          {cmsPreviewText(values[itemsPath] ?? "", "대표 품목")}
        </p>
      </button>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {lines.length > 0
          ? lines.map((line, index) => (
              <article
                key={line.slug}
                className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-brand-ink/5">
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 45vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-lg font-semibold text-brand-ink">
                    {itemLabels[index] ?? line.slug}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                    공개 페이지 제품 카드 미리보기
                  </p>
                </div>
              </article>
            ))
          : (
              <button
                type="button"
                onClick={() => onSelectSlot(itemsPath)}
                className={`col-span-full rounded-2xl border border-dashed border-brand/25 bg-brand/5 px-4 py-8 text-left ${ring(activeSlot === itemsPath)}`}
              >
                <p className="text-sm text-brand-ink/60">
                  {cmsPreviewText(values[itemsPath] ?? "", "대표 품목을 입력하세요")}
                </p>
              </button>
            )}
      </div>
    </section>
  );
}
