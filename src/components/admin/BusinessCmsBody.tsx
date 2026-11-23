"use client";

import Image from "next/image";
import { EcosystemDiagram } from "@/components/EcosystemDiagram";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  BUSINESS_SIDE_IMAGE_PATH,
  resolveBusinessSideImageSrc,
} from "@/lib/business-media";
import { cmsTypoInlineStyle } from "@/lib/cms-typography-styles";

const NODE_KEYS = [
  "technology",
  "research",
  "product",
  "oem",
  "healthcare",
  "education",
  "distribution",
  "partner",
] as const;

export function BusinessCmsBody({
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
  const centerPath = "business.center";
  const invitePath = "business.invite";
  const sideImageSrc = resolveBusinessSideImageSrc(values[BUSINESS_SIDE_IMAGE_PATH]);
  const nodes = NODE_KEYS.map((key) =>
    cmsPreviewText(values[`business.nodes.${key}`] ?? "", key),
  );

  return (
    <section
      className={`mx-auto grid w-full ${GUEST_CONTENT_MAX} items-center gap-12 px-guest-gutter py-20 md:grid-cols-[1.1fr_0.9fr]`}
    >
      <div>
        <ul className="grid gap-2 text-sm tracking-[0.04em] text-ink/70">
          {NODE_KEYS.map((key) => {
            const path = `business.nodes.${key}`;
            return (
              <li key={key} className="border-b border-ink/10 py-2">
                <button
                  type="button"
                  onClick={() => onSelectSlot(path)}
                  className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === path)}`}
                >
                  <span style={cmsTypoInlineStyle(path, values)}>
                    {cmsPreviewText(values[path] ?? "", "항목")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => onSelectSlot(invitePath)}
          className={`mt-8 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === invitePath)}`}
        >
          <span
            className="text-sm leading-7 text-brand-ink/70"
            style={cmsTypoInlineStyle(invitePath, values)}
          >
            {cmsPreviewText(values[invitePath] ?? "", "파트너 초대 문구")}
          </span>
        </button>
        {!sideImageSrc ? (
          <button
            type="button"
            onClick={() => onSelectSlot(centerPath)}
            className={`mt-6 block w-full border-0 bg-transparent p-0 text-left md:hidden ${cmsSlotRing(activeSlot === centerPath)}`}
          >
            <span className="text-xs text-ink/45">
              다이어그램 중앙: {cmsPreviewText(values[centerPath] ?? "", "중앙 문구")}
            </span>
          </button>
        ) : null}
      </div>
      <div>
        {!sideImageSrc ? (
          <button
            type="button"
            onClick={() => onSelectSlot(centerPath)}
            className={`mb-3 hidden w-full border-0 bg-transparent p-0 text-left md:block ${cmsSlotRing(activeSlot === centerPath)}`}
          >
            <span className="text-xs text-ink/45">
              다이어그램 중앙: {cmsPreviewText(values[centerPath] ?? "", "중앙 문구")}
            </span>
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onPickImage(BUSINESS_SIDE_IMAGE_PATH)}
          aria-label="사업협력 이미지 편집"
          className={`relative w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === BUSINESS_SIDE_IMAGE_PATH)}`}
        >
          {sideImageSrc ? (
            <span className="relative block aspect-square w-full overflow-hidden">
              <Image
                src={sideImageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
                unoptimized={heroImageUnoptimized(sideImageSrc)}
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-[11px] font-medium text-white">
                이미지 클릭하여 변경
              </span>
            </span>
          ) : (
            <span className="relative block">
              <EcosystemDiagram
                center={cmsPreviewText(values[centerPath] ?? "", "NO Metabolite")}
                nodes={nodes}
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-center text-[11px] font-medium text-white">
                클릭하여 이미지로 교체 (비우면 다이어그램 유지)
              </span>
            </span>
          )}
        </button>
      </div>
    </section>
  );
}
