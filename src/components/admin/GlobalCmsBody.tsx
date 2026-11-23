"use client";

import Image from "next/image";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  GLOBAL_NODE_KEYS,
  globalNodeImagePath,
  resolveGlobalNodeImageSrc,
} from "@/lib/global-nodes";

export function GlobalCmsBody({
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
    <section
      className={`mx-auto grid w-full ${GUEST_CONTENT_MAX} gap-10 px-guest-gutter py-20 md:grid-cols-2`}
    >
      {GLOBAL_NODE_KEYS.map((key) => {
        const titlePath = `global.nodes.${key}.title`;
        const textPath = `global.nodes.${key}.text`;
        const imagePath = globalNodeImagePath(key);
        const imageSrc = resolveGlobalNodeImageSrc(key, values[imagePath]);
        return (
          <article key={key}>
            <button
              type="button"
              onClick={() => onPickImage(imagePath)}
              aria-label="이미지 편집"
              className={`relative aspect-[16/10] w-full overflow-hidden border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === imagePath)}`}
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
