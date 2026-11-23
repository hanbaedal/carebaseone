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
  homeLedeFontSizeFluid,
  parseHomeScale,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
  HOME_HEADLINE_FONT_DEFAULT,
  HOME_KICKER_FONT_DEFAULT,
  HOME_LEDE_COLOR_DEFAULT,
  HOME_LEDE_FONT_DEFAULT,
} from "@/lib/home-hero";
import { GUEST_HERO_FRAME, GUEST_HERO_IMAGE_SIZES } from "@/lib/guest-layout";
import { HOME_CONTENT_GUTTER, HOME_VIEWPORT_SHELL } from "@/lib/home-layout";
import { SnsIconLinkRow } from "@/components/sns/SnsIconLinkRow";
import { companySnsLinks } from "@/lib/company-sns";
import { SITE_SNS_DEFAULTS } from "@/lib/company-sns";
import { pageFooterTextColor, resolvePageFooterBackground, PAGE_FOOTER_BG_DEFAULT } from "@/lib/page-footer";
import { CMS_FOOTER_INNER, CMS_FOOTER_INNER_DOCKED } from "@/lib/footer-layout";
type SlotKey = "home.heroImage" | "home.kicker" | "home.headline" | "home.lede";

export function HomeCmsCanvas({
  heroSrc,
  kicker,
  headline,
  lede,
  kickerScale,
  headlineScale,
  ledeScale,
  kickerColor,
  headlineColor,
  ledeColor,
  kickerFont,
  headlineFont,
  ledeFont,
  footerBg,
  activeSlot,
  onSelectSlot,
  onPickBackground,
  compact = false,
}: {
  heroSrc: string;
  kicker: string;
  headline: string;
  lede: string;
  kickerScale: string;
  headlineScale: string;
  ledeScale: string;
  kickerColor: string;
  headlineColor: string;
  ledeColor: string;
  kickerFont: string;
  headlineFont: string;
  ledeFont: string;
  footerBg: string;
  activeSlot: SlotKey | null;
  onSelectSlot: (slot: SlotKey) => void;
  onPickBackground: () => void;
  /** CMS — 공개 홈과 동일한 한 화면 미리보기 */
  compact?: boolean;
}) {
  const kScale = parseHomeScale(kickerScale);
  const hScale = parseHomeScale(headlineScale);
  const lScale = parseHomeScale(ledeScale);
  const kickerHex = resolveHomeTextColorHex(kickerColor, HOME_KICKER_COLOR_DEFAULT);
  const headlineHex = resolveHomeTextColorHex(headlineColor, HOME_HEADLINE_COLOR_DEFAULT);
  const ledeHex = resolveHomeTextColorHex(ledeColor, HOME_LEDE_COLOR_DEFAULT);
  const kickerFamily = resolveHomeFontFamily(kickerFont, HOME_KICKER_FONT_DEFAULT);
  const headlineFamily = resolveHomeFontFamily(headlineFont, HOME_HEADLINE_FONT_DEFAULT);
  const ledeFamily = resolveHomeFontFamily(ledeFont, HOME_LEDE_FONT_DEFAULT);
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
  const previewSnsLinks = companySnsLinks({
    companyName: "",
    representativeName: "",
    companyPhone: "",
    companyFax: "",
    companyEmail: "",
    representativePhone: "",
    website: "",
    businessRegistrationNumber: "",
    businessType: "",
    businessItem: "",
    ...SITE_SNS_DEFAULTS,
    snsKakao: "",
  });

  return (
    <div className={`${rootClass} bg-paper`}>
      <section className={`${GUEST_HERO_FRAME} min-h-0 flex-1 bg-brand-ink text-brand-ink`}>
        <Image
          src={heroSrc}
          alt=""
          fill
          className={HOME_HERO_IMAGE_CLASS}
          sizes={GUEST_HERO_IMAGE_SIZES}
          unoptimized={heroImageUnoptimized(heroSrc)}
        />

        <div className={`relative z-10 flex h-full min-h-0 flex-col py-4 sm:py-5 md:py-6 ${HOME_CONTENT_GUTTER}`}>
          <div className="flex min-h-0 w-full flex-1 flex-col justify-center md:max-w-4xl">
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
              className={`mt-2 block w-full max-w-none border-0 bg-transparent p-0 text-left sm:mt-3 md:mt-4 ${ring("home.headline")}`}
            >
              <span
                className="block w-full whitespace-pre-line font-bold leading-[1.15] tracking-[-0.03em]"
                style={{
                  fontSize: homeHeadlineFontSizeFluid(hScale),
                  color: headlineHex,
                  fontFamily: headlineFamily,
                }}
              >
                {headline.length > 0 ? headline : "헤드라인"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSelectSlot("home.lede")}
              className={`mt-7 block w-full max-w-4xl border-0 bg-transparent p-0 text-left sm:mt-8 ${ring("home.lede")}`}
            >
              <span
                className={`block whitespace-pre-line font-normal leading-7 tracking-[-0.01em] ${lede.trim() ? "" : "opacity-60"}`}
                style={{
                  fontSize: homeLedeFontSizeFluid(lScale),
                  color: ledeHex,
                  fontFamily: ledeFamily,
                }}
              >
                {lede.trim() ? lede : "소개 문구"}
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

      <footer
        className="shrink-0 border-t border-black/10"
        style={{ backgroundColor: footerBgCss, color: footerColor }}
      >
        <div className={footerInner}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <CompanyContactBlock onBrandBg compact className="min-w-0 flex-1" />
            <SnsIconLinkRow links={previewSnsLinks} compact onBrandBg />
          </div>
        </div>
      </footer>
    </div>
  );
}