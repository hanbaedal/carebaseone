"use client";

import Image from "next/image";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  SOLUTION_ITEM_KEYS,
  resolveSolutionItemImageSrc,
  solutionItemImagePath,
} from "@/lib/solution-items";

export function SolutionCmsBody({
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
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-20`}>
      <div className="grid gap-16">
        {SOLUTION_ITEM_KEYS.map((key, index) => {
          const titlePath = `solution.items.${key}.title`;
          const textPath = `solution.items.${key}.text`;
          const imagePath = solutionItemImagePath(key);
          const imageSrc = resolveSolutionItemImageSrc(key, values[imagePath]);
          return (
            <article key={key} className="grid items-center gap-10 md:grid-cols-2">
              <button
                type="button"
                onClick={() => onPickImage(imagePath)}
                aria-label="이미지 편집"
                className={`relative aspect-[4/3] overflow-hidden border-0 bg-transparent p-0 text-left ${
                  index % 2 === 1 ? "md:order-2" : ""
                } ${cmsSlotRing(activeSlot === imagePath)}`}
              >
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized={heroImageUnoptimized(imageSrc)}
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-[11px] font-medium text-white">
                  이미지 클릭하여 변경
                </span>
              </button>
              <div>
                <p className="text-[11px] tracking-[0.28em] text-sage">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectSlot(titlePath)}
                  className={`mt-3 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === titlePath)}`}
                >
                  <span className="font-display text-4xl text-brand-ink">
                    {cmsPreviewText(values[titlePath] ?? "", "제목")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSlot(textPath)}
                  className={`mt-5 block w-full max-w-md border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === textPath)}`}
                >
                  <span className="text-base leading-8 text-ink/70">
                    {cmsPreviewText(values[textPath] ?? "", "설명")}
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
