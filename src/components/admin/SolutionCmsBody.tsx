"use client";

import Image from "next/image";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";

const SOLUTION_ITEMS = [
  { key: "vascular", image: images.vascular },
  { key: "sports", image: images.sports },
  { key: "senior", image: images.senior },
  { key: "beauty", image: images.beauty },
  { key: "wellness", image: images.wellness },
] as const;

export function SolutionCmsBody({
  values,
  activeSlot,
  onSelectSlot,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-20`}>
      <div className="grid gap-16">
        {SOLUTION_ITEMS.map((item, index) => {
          const titlePath = `solution.items.${item.key}.title`;
          const textPath = `solution.items.${item.key}.text`;
          return (
            <article key={item.key} className="grid items-center gap-10 md:grid-cols-2">
              <div
                className={`relative aspect-[4/3] overflow-hidden ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
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
