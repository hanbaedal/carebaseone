"use client";

import Image from "next/image";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { HOME_HERO_IMAGE_CLASS, heroImageUnoptimized, parseHomeScale } from "@/lib/home-hero";

type SlotKey = "home.heroImage" | "home.kicker" | "home.headline";

export function HomeCmsCanvas({
  heroSrc,
  kicker,
  headline,
  kickerScale,
  headlineScale,
  activeSlot,
  onSelectSlot,
  onPickBackground,
}: {
  heroSrc: string;
  kicker: string;
  headline: string;
  kickerScale: string;
  headlineScale: string;
  activeSlot: SlotKey | null;
  onSelectSlot: (slot: SlotKey) => void;
  onPickBackground: () => void;
}) {
  const kScale = parseHomeScale(kickerScale);
  const hScale = parseHomeScale(headlineScale);

  const ring = (slot: SlotKey) =>
    activeSlot === slot ? "ring-2 ring-brand ring-offset-2 ring-offset-white/80" : "hover:ring-2 hover:ring-brand/40";

  return (
    <div className="relative isolate min-h-[min(70vh,44rem)] overflow-hidden bg-brand-ink text-brand-ink">
      <Image
        src={heroSrc}
        alt=""
        fill
        className={HOME_HERO_IMAGE_CLASS}
        sizes="100vw"
        unoptimized={heroImageUnoptimized(heroSrc)}
      />

      <button
        type="button"
        onClick={onPickBackground}
        className={`absolute right-3 top-3 z-20 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[11px] font-medium text-brand shadow-sm hover:bg-white ${
          activeSlot === "home.heroImage" ? "ring-2 ring-brand" : ""
        }`}
      >
        배경 이미지 선택
      </button>

      <div className="relative z-10 mx-auto flex min-h-[min(70vh,44rem)] max-w-5xl flex-col px-4 pb-0 pt-12 md:px-6">
        <div className="flex min-h-0 flex-1 flex-col justify-center md:max-w-2xl">
          <div className="max-w-xl rounded-2xl bg-white px-4 py-5 shadow-sm md:px-6 md:py-6">
          <button
            type="button"
            onClick={() => onSelectSlot("home.kicker")}
            className={`w-fit rounded-md text-left ${ring("home.kicker")}`}
          >
            <p
              className="font-semibold tracking-[0.22em] text-brand"
              style={{ fontSize: `${(12 * kScale) / 100}px` }}
            >
              {kicker || "키커"}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSelectSlot("home.headline")}
            className={`mt-5 w-fit rounded-md text-left ${ring("home.headline")}`}
          >
            <h2
              className="whitespace-pre-line font-display leading-[1.2] text-brand-ink"
              style={{ fontSize: `${(2.25 * hScale) / 100}rem` }}
            >
              {headline || "헤드라인"}
            </h2>
          </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="배경 이미지 편집"
          onClick={onPickBackground}
          className="absolute bottom-24 right-4 top-24 hidden w-[min(38%,14rem)] rounded-lg border border-dashed border-brand/25 bg-brand/5 hover:border-brand/50 hover:bg-brand/10 md:block"
        />

        <div className="pointer-events-none mb-4 rounded-2xl border border-line bg-white px-5 py-6 shadow-sm md:mb-6">
          <CompanyContactBlock />
        </div>
      </div>
    </div>
  );
}