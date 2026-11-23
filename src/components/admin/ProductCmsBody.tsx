"use client";

import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";

export function ProductHubCmsBody({
  values,
  activeSlot,
  onSelectSlot,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
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
          return (
            <article
              key={key}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
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
}: {
  category: ProductLineCategory;
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  const titlePath = `product.categories.${category}.title`;
  const textPath = `product.categories.${category}.text`;
  const itemsPath = `product.categories.${category}.items`;

  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
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
