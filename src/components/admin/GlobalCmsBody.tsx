"use client";

import Image from "next/image";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";

const GLOBAL_NODES = [
  { key: "korea", image: images.korea },
  { key: "china", image: images.china },
  { key: "usa", image: images.usa },
  { key: "future", image: images.close },
] as const;

export function GlobalCmsBody({
  values,
  activeSlot,
  onSelectSlot,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  return (
    <section
      className={`mx-auto grid w-full ${GUEST_CONTENT_MAX} gap-10 px-guest-gutter py-20 md:grid-cols-2`}
    >
      {GLOBAL_NODES.map((node) => {
        const titlePath = `global.nodes.${node.key}.title`;
        const textPath = `global.nodes.${node.key}.text`;
        return (
          <article key={node.key}>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={node.image}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <button
              type="button"
              onClick={() => onSelectSlot(titlePath)}
              className={`mt-5 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === titlePath)}`}
            >
              <span className="font-display text-3xl text-brand-ink">
                {cmsPreviewText(values[titlePath] ?? "", "제목")}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSelectSlot(textPath)}
              className={`mt-2 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === textPath)}`}
            >
              <span className="text-ink/70">
                {cmsPreviewText(values[textPath] ?? "", "설명")}
              </span>
            </button>
          </article>
        );
      })}
    </section>
  );
}
