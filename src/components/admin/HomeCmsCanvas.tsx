"use client";

import Image from "next/image";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import {
  HOME_HERO_IMAGE_CLASS,
  HOME_HEADLINE_COLOR_DEFAULT,
  HOME_KICKER_COLOR_DEFAULT,
  heroImageUnoptimized,
  homeHeadlineFontSize,
  homeKickerFontSize,
  parseHomeScale,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
  HOME_HEADLINE_FONT_DEFAULT,
  HOME_KICKER_FONT_DEFAULT,
} from "@/lib/home-hero";

type SlotKey = "home.heroImage" | "home.kicker" | "home.headline";

export function HomeCmsCanvas({
  heroSrc,
  kicker,
  headline,
  kickerScale,
  headlineScale,
  kickerColor,
  headlineColor,
  kickerFont,
  headlineFont,
  activeSlot,
  onSelectSlot,
  onPickBackground,
  compact = false,
}: {
  heroSrc: string;
  kicker: string;
  headline: string;
  kickerScale: string;
  headlineScale: string;
  kickerColor: string;
  headlineColor: string;
  kickerFont: string;
  headlineFont: string;
  activeSlot: SlotKey | null;
  onSelectSlot: (slot: SlotKey) => void;
  onPickBackground: () => void;
  /** CMS 편집 화면: 미리보기 높이 제한 */
  compact?: boolean;
}) {
  const kScale = parseHomeScale(kickerScale);
  const hScale = parseHomeScale(headlineScale);
  const kickerHex = resolveHomeTextColorHex(kickerColor, HOME_KICKER_COLOR_DEFAULT);
  const headlineHex = resolveHomeTextColorHex(headlineColor, HOME_HEADLINE_COLOR_DEFAULT);
  const kickerFamily = resolveHomeFontFamily(kickerFont, HOME_KICKER_FONT_DEFAULT);
  const headlineFamily = resolveHomeFontFamily(headlineFont, HOME_HEADLINE_FONT_DEFAULT);

  const ring = (slot: SlotKey) =>
    activeSlot === slot
      ? "rounded-md ring-2 ring-brand ring-offset-2 ring-offset-transparent"
      : "rounded-md hover:ring-2 hover:ring-brand/40 hover:ring-offset-2 hover:ring-offset-transparent";

  const shellMinH = compact
    ? "min-h-[min(70vh,40rem)]"
    : "min-h-[calc(100dvh-4.5rem)]";

  return (
    <div className={`relative isolate ${shellMinH} overflow-hidden bg-brand-ink text-brand-ink`}>
      <Image
        src={heroSrc}
        alt=""
        fill
        className={HOME_HERO_IMAGE_CLASS}
        sizes="100vw"
        unoptimized={heroImageUnoptimized(heroSrc)}
      />

      <div className={`relative z-10 mx-auto flex ${shellMinH} max-w-7xl flex-col px-6 pb-0 pt-10 md:pt-14`}>
        <div className="flex flex-1 flex-col justify-center md:max-w-2xl">
          <button
            type="button"
            onClick={() => onSelectSlot("home.kicker")}
            className={`block w-fit border-0 bg-transparent p-0 text-left ${ring("home.kicker")}`}
          >
            <p
              className="font-semibold tracking-[0.22em]"
              style={{
                fontSize: homeKickerFontSize(kScale),
                color: kickerHex,
                fontFamily: kickerFamily,
              }}
            >
              {kicker || "키커"}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSelectSlot("home.headline")}
            className={`mt-5 block w-fit max-w-2xl border-0 bg-transparent p-0 text-left ${ring("home.headline")}`}
          >
            <span
              className="block whitespace-pre-line leading-[1.2]"
              style={{
                fontSize: homeHeadlineFontSize(hScale),
                color: headlineHex,
                fontFamily: headlineFamily,
              }}
            >
              {headline || "헤드라인"}
            </span>
          </button>
        </div>

        <button
          type="button"
          aria-label="배경 이미지 편집"
          onClick={onPickBackground}
          className="absolute bottom-24 right-4 top-24 hidden w-[min(38%,14rem)] rounded-lg border border-dashed border-brand/25 md:block"
        />

        <div className="pointer-events-none mb-6 rounded-2xl border border-line bg-white/95 px-5 py-6 shadow-sm backdrop-blur-sm md:mb-8 md:px-8 md:py-7">
          <CompanyContactBlock />
        </div>
      </div>
    </div>
  );
}