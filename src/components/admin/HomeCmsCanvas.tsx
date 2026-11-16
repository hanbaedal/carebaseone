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
import { pageFooterTextColor, resolvePageFooterBackground, PAGE_FOOTER_BG_DEFAULT } from "@/lib/page-footer";

type SlotKey = "home.heroImage" | "home.kicker" | "home.headline" | "home.footerText";

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
  footerBg,
  footerText,
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
  footerBg: string;
  footerText: string;
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
  const footerBgHex = resolvePageFooterBackground(footerBg, PAGE_FOOTER_BG_DEFAULT);
  const footerColor = pageFooterTextColor(footerBgHex);

  const ring = (slot: SlotKey) =>
    activeSlot === slot
      ? "rounded-md ring-2 ring-brand ring-offset-2 ring-offset-transparent"
      : "rounded-md hover:ring-2 hover:ring-brand/40 hover:ring-offset-2 hover:ring-offset-transparent";

  const shellMinH = compact
    ? "min-h-[min(70vh,40rem)]"
    : "min-h-[calc(100dvh-4.5rem)]";

  return (
    <div className="flex flex-col bg-white">
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
          className="absolute bottom-8 right-4 top-24 hidden w-[min(38%,14rem)] rounded-lg border border-dashed border-brand/25 md:block"
        />
      </div>
    </div>
      <button
        type="button"
        onClick={() => onSelectSlot("home.footerText")}
        className={`w-full border-t border-black/10 text-left ${ring("home.footerText")}`}
        style={{ backgroundColor: footerBgHex, color: footerColor }}
      >
        <div className="mx-auto max-w-7xl px-6 py-8">
          <CompanyContactBlock onBrandBg />
          {footerText.trim() ? (
            <p className="mt-6 whitespace-pre-line border-t border-current/15 pt-6 text-sm leading-7 opacity-90">
              {footerText}
            </p>
          ) : (
            <p className="mt-6 text-[11px] opacity-60">풋터 추가 문구(CMS)는 여기 표시됩니다.</p>
          )}
          <p className="mt-4 text-xs tracking-wide opacity-75">© haesoo</p>
        </div>
      </button>
    </div>
  );
}