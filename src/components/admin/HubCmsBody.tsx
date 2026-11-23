"use client";

import Image from "next/image";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  hubCardImagePath,
  resolveHubBlockImageSrc,
} from "@/lib/hub-media";
import type { HubBlockDef } from "@/lib/section-hub";

export type HubCmsCardMeta = {
  label: string;
  titlePath?: string;
  excerptPath?: string;
};

export function HubCmsBody({
  section,
  blocks,
  cardMeta,
  values,
  activeSlot,
  onSelectSlot,
  onPickImage,
}: {
  section: string;
  blocks: HubBlockDef[];
  cardMeta: Record<string, HubCmsCardMeta>;
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
  onPickImage: (path: string) => void;
}) {
  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-10 md:py-14`}>
      {blocks.map((block) => {
        const meta = cardMeta[block.navKey] ?? { label: block.navKey };
        const imagePath = hubCardImagePath(section, block.navKey);
        const imageSrc = resolveHubBlockImageSrc(block.image, values[imagePath]);
        const titlePath = meta.titlePath;
        const excerptPath = meta.excerptPath;
        return (
          <article
            key={block.navKey}
            className="border-b border-line py-10 last:border-b-0 md:py-14"
          >
            {titlePath ? (
              <button
                type="button"
                onClick={() => onSelectSlot(titlePath)}
                className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === titlePath)}`}
              >
                <span className="font-display text-2xl text-brand-ink md:text-3xl">
                  {cmsPreviewText(values[titlePath] ?? "", meta.label)}
                </span>
              </button>
            ) : (
              <p className="font-display text-2xl text-brand-ink md:text-3xl">{meta.label}</p>
            )}
            <div className="mt-6 overflow-hidden rounded-2xl border border-brand/10 bg-sky-50/80">
              <div className="grid items-center gap-6 p-5 md:grid-cols-[minmax(0,11rem)_1fr] md:p-7">
                <button
                  type="button"
                  onClick={() => onPickImage(imagePath)}
                  aria-label={`${meta.label} 이미지 편집`}
                  className={`relative mx-auto aspect-[4/5] w-full max-w-[11rem] overflow-hidden rounded-xl border-0 bg-white p-0 shadow-sm ${cmsSlotRing(activeSlot === imagePath)}`}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="176px"
                    unoptimized={heroImageUnoptimized(imageSrc)}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1.5 text-[10px] font-medium text-white">
                    이미지 클릭하여 변경
                  </span>
                </button>
                {excerptPath ? (
                  <button
                    type="button"
                    onClick={() => onSelectSlot(excerptPath)}
                    className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === excerptPath)}`}
                  >
                    <span className="whitespace-pre-line text-[15px] leading-8 text-brand-ink/80">
                      {cmsPreviewText(values[excerptPath] ?? "", "소개")}
                    </span>
                  </button>
                ) : (
                  <p className="text-[13px] leading-7 text-brand-ink/50">
                    카드 이미지를 클릭해 변경할 수 있습니다. 제목·본문은 해당 하위 페이지에서 편집합니다.
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
