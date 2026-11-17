"use client";

import Image from "next/image";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { SnsIconLinkRow } from "@/components/sns/SnsIconLinkRow";
import { companySnsLinks, SITE_SNS_DEFAULTS } from "@/lib/company-sns";
import { CMS_FOOTER_INNER_DOCKED } from "@/lib/footer-layout";
import type { CmsHeroSlots } from "@/lib/cms-page-hero";
import { fieldLabelFor, type CmsPageDef } from "@/lib/cms-pages";
import { cmsTypoInlineStyle } from "@/lib/cms-typography-styles";
import { heroImageUnoptimized } from "@/lib/home-hero";
import { pageFooterTextColor, resolvePageFooterBackground, PAGE_FOOTER_BG_DEFAULT } from "@/lib/page-footer";

function ring(active: boolean) {
  return active
    ? "rounded-md ring-2 ring-brand ring-offset-2 ring-offset-white"
    : "rounded-md hover:ring-2 hover:ring-brand/40 hover:ring-offset-2 hover:ring-offset-transparent";
}

function previewText(value: string, empty: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : empty;
}

export function SubpageCmsCanvas({
  page,
  heroSrc,
  hero,
  values,
  contentPaths,
  activeSlot,
  footerBg,
  onSelectSlot,
  onEditFooter,
  onPickBackground,
}: {
  page: CmsPageDef;
  heroSrc: string;
  hero: CmsHeroSlots;
  values: Record<string, string>;
  contentPaths: string[];
  activeSlot: string | null;
  footerBg: string;
  onSelectSlot: (path: string) => void;
  onEditFooter: () => void;
  onPickBackground: () => void;
}) {
  const footerBgCss = resolvePageFooterBackground(footerBg, PAGE_FOOTER_BG_DEFAULT);
  const footerColor = pageFooterTextColor(footerBgCss);
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

  const kicker = hero.kicker ? values[hero.kicker] ?? "" : "";
  const title = hero.title ? values[hero.title] ?? "" : "";
  const lede = hero.lede ? values[hero.lede] ?? "" : "";

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <section className="relative isolate min-h-[42vh] overflow-hidden bg-brand-ink text-white">
          <Image
            src={heroSrc}
            alt=""
            fill
            className="object-cover object-center opacity-55"
            sizes="100vw"
            unoptimized={heroImageUnoptimized(heroSrc)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-brand-ink/45 to-transparent" />
          <button
            type="button"
            aria-label="배경 이미지 편집"
            onClick={onPickBackground}
            className="absolute inset-0 z-[1] cursor-pointer border-0 bg-transparent"
          />
          <div className="relative z-[2] mx-auto flex min-h-[42vh] max-w-7xl flex-col justify-end px-6 pb-12 pt-20">
            {hero.kicker ? (
              <button
                type="button"
                onClick={() => onSelectSlot(hero.kicker!)}
                className={`relative w-fit border-0 bg-transparent p-0 text-left ${ring(activeSlot === hero.kicker)}`}
              >
                <p className="font-semibold tracking-[0.22em]" style={cmsTypoInlineStyle(hero.kicker, values)}>
                  {previewText(kicker, "키커")}
                </p>
              </button>
            ) : null}
            {hero.title ? (
              <button
                type="button"
                onClick={() => onSelectSlot(hero.title!)}
                className={`relative mt-4 block w-full max-w-3xl border-0 bg-transparent p-0 text-left ${ring(activeSlot === hero.title)}`}
              >
                <span
                  className="block whitespace-pre-line font-display leading-tight"
                  style={cmsTypoInlineStyle(hero.title, values)}
                >
                  {previewText(title, "제목")}
                </span>
              </button>
            ) : null}
            {hero.lede ? (
              <button
                type="button"
                onClick={() => onSelectSlot(hero.lede!)}
                className={`relative mt-5 block max-w-2xl border-0 bg-transparent p-0 text-left ${ring(activeSlot === hero.lede)}`}
              >
                <span
                  className="block whitespace-pre-line leading-8"
                  style={cmsTypoInlineStyle(hero.lede, values)}
                >
                  {previewText(lede, "소개 문구")}
                </span>
              </button>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-3 px-6 py-10">
          <p className="text-[11px] font-medium text-ink/45">{page.label} 본문 · 버튼</p>
          {contentPaths.map((path) => {
            const raw = values[path] ?? "";
            const label = fieldLabelFor(page, path);
            const isMultiline = raw.includes("\n") || raw.length > 80;
            const typo = cmsTypoInlineStyle(path, values);
            return (
              <button
                key={path}
                type="button"
                onClick={() => onSelectSlot(path)}
                className={`block w-full border border-ink/10 bg-white p-4 text-left shadow-sm ${ring(activeSlot === path)}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">{label}</p>
                <p
                  className={`mt-2 text-sm leading-7 ${isMultiline ? "line-clamp-6 whitespace-pre-line" : "truncate"}`}
                  style={typo ?? { color: "rgba(15,23,42,0.8)" }}
                >
                  {previewText(raw, "내용 없음 — 클릭하여 입력")}
                </p>
              </button>
            );
          })}
        </section>
      </div>

      <footer
        className="shrink-0 cursor-pointer border-t border-black/10"
        style={{ backgroundColor: footerBgCss, color: footerColor }}
        onClick={onEditFooter}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEditFooter();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="풋터 배경색 편집"
      >
        <div className={CMS_FOOTER_INNER_DOCKED}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <CompanyContactBlock onBrandBg compact className="min-w-0 flex-1" />
            <SnsIconLinkRow links={previewSnsLinks} compact onBrandBg />
          </div>
        </div>
      </footer>
    </div>
  );
}