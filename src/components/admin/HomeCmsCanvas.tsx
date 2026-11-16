"use client";

import Image from "next/image";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import {
  HOME_HERO_IMAGE_CLASS,
  HOME_HEADLINE_COLOR_DEFAULT,
  HOME_KICKER_COLOR_DEFAULT,
  heroImageUnoptimized,
  homeHeadlineFontSizeFluid,
  homeKickerFontSizeFluid,
  parseHomeScale,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
  HOME_HEADLINE_FONT_DEFAULT,
  HOME_KICKER_FONT_DEFAULT,
} from "@/lib/home-hero";
import { HOME_VIEWPORT_SHELL } from "@/lib/home-layout";
import { pageFooterTextColor, resolvePageFooterBackground, PAGE_FOOTER_BG_DEFAULT } from "@/lib/page-footer";
import { CMS_FOOTER_INNER, CMS_FOOTER_INNER_DOCKED } from "@/lib/footer-layout";

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
  /** CMS — 공개 홈과 동일한 한 화면 미리보기 */
  compact?: boolean;
}) {
  const kScale = parseHomeScale(kickerScale);
  const hScale = parseHomeScale(headlineScale);
  const kickerHex = resolveHomeTextColorHex(kickerColor, HOME_KICKER_COLOR_DEFAULT);
  const headlineHex = resolveHomeTextColorHex(headlineColor, HOME_HEADLINE_COLOR_DEFAULT);
  const kickerFamily = resolveHomeFontFamily(kickerFont, HOME_KICKER_FONT_DEFAULT);
  const headlineFamily = resolveHomeFontFamily(headlineFont, HOME_HEADLINE_FONT_DEFAULT);
  const footerBgCss = resolvePageFooterBackground(footerBg, PAGE_FOOTER_BG_DEFAULT);
  const footerColor = pageFooterTextColor(footerBgCss);

  const ring = (slot: SlotKey) =>
    activeSlot === slot
      ? "rounded-md ring-2 ring-brand ring-offset-2 ring-offset-transparent"
      : "rounded-md hover:ring-2 hover:ring-brand/40 hover:ring-offset-2 hover:ring-offset-transparent";

  const rootClass = compact
    ? `${HOME_VIEWPORT_SHELL} bg-white`
    : "flex min-h-[calc(100dvh-4.5rem)] flex-col bg-white";

  const footerInner = compact ? CMS_FOOTER_INNER_DOCKED : CMS_FOOTER_INNER;

  return (
    <div className={rootClass}>
      <section className="relative isolate min-h-0 flex-1 overflow-hidden bg-brand-ink text-brand-ink">
        <Image
          src={heroSrc}
          alt=""
          fill
          className={HOME_HERO_IMAGE_CLASS}
          sizes="100vw"
          unoptimized={heroImageUnoptimized(heroSrc)}
        />

        <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5 md:py-6">
          <div className="flex min-h-0 flex-1 flex-col justify-center md:max-w-2xl">
            <button
              type="button"
              onClick={() => onSelectSlot("home.kicker")}
              className={`block w-fit border-0 bg-transparent p-0 text-left ${ring("home.kicker")}`}
            >
              <p
                className="font-semibold tracking-[0.18em] sm:tracking-[0.22em]"
                style={{
                  fontSize: homeKickerFontSizeFluid(kScale),
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
              className={`mt-2 block w-fit max-w-xl border-0 bg-transparent p-0 text-left sm:mt-3 md:mt-4 ${ring("home.headline")}`}
            >
              <span
                className="block whitespace-pre-line font-bold leading-[1.15] tracking-[-0.03em]"
                style={{
                  fontSize: homeHeadlineFontSizeFluid(hScale),
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
            className="absolute bottom-6 right-4 top-20 hidden w-[min(38%,14rem)] rounded-lg border border-dashed border-brand/25 md:block"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() => onSelectSlot("home.footerText")}
        className={`shrink-0 border-t border-black/10 text-left ${ring("home.footerText")}`}
        style={{ backgroundColor: footerBgCss, color: footerColor }}
      >
        <div className={footerInner}>
          <CompanyContactBlock onBrandBg compact />
          {footerText.trim() ? (
            <p className="mt-3 whitespace-pre-line border-t border-current/15 pt-3 text-[12px] leading-5 opacity-90">
              {footerText}
            </p>
          ) : null}
          <p className="mt-2 text-[11px] tracking-wide opacity-75">© haesoo</p>
        </div>
      </button>
    </div>
  );
}