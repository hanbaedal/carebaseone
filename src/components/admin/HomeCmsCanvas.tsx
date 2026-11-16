"use client";

import Image from "next/image";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { parseHomeScale } from "@/lib/home-hero";

type SlotKey = "home.heroImage" | "home.kicker" | "home.headline";

export function HomeCmsCanvas({
  heroSrc,
  kicker,
  headline,
  kickerScale,
  headlineScale,
  activeSlot,
  onSelectSlot,
}: {
  heroSrc: string;
  kicker: string;
  headline: string;
  kickerScale: string;
  headlineScale: string;
  activeSlot: SlotKey | null;
  onSelectSlot: (slot: SlotKey) => void;
}) {
  const kScale = parseHomeScale(kickerScale);
  const hScale = parseHomeScale(headlineScale);

  const ring = (slot: SlotKey) =>
    activeSlot === slot ? "ring-2 ring-brand ring-offset-2 ring-offset-white/80" : "hover:ring-2 hover:ring-brand/40";

  return (
    <div className="relative isolate min-h-[min(70vh,44rem)] overflow-hidden bg-brand-ink text-brand-ink">
      <button
        type="button"
        className={`absolute inset-0 z-0 block w-full ${ring("home.heroImage")}`}
        onClick={() => onSelectSlot("home.heroImage")}
        aria-label="배경 이미지 편집"
      >
        <Image src={heroSrc} alt="" fill className="pointer-events-none object-cover" sizes="100vw" unoptimized />
      </button>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-white/92 via-white/72 to-white/20" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-white via-transparent to-transparent md:from-white/80" />

      <div className="relative z-[2] mx-auto flex min-h-[min(70vh,44rem)] max-w-5xl flex-col px-4 pb-0 pt-8 md:px-6">
        <div className="flex flex-1 flex-col justify-center md:max-w-2xl">
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
              className="font-display leading-[1.2] text-brand-ink"
              style={{ fontSize: `${(2.25 * hScale) / 100}rem` }}
            >
              {headline || "헤드라인"}
            </h2>
          </button>
        </div>

        <div className="pointer-events-none mb-4 rounded-2xl border border-line bg-white/95 px-5 py-6 shadow-sm backdrop-blur-sm md:mb-6">
          <CompanyContactBlock />
        </div>
      </div>
    </div>
  );
}