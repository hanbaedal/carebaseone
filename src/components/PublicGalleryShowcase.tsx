"use client";

import { MediaAwareImage } from "@/components/MediaAwareImage";
import { useCallback, useEffect, useMemo, useState } from "react";

export type PublicGalleryItem = {
  slug: string;
  src: string;
  title: string;
  caption: string;
  kind: "image" | "video";
};

/** 아래 썸네일 줄에 한 번에 보이는 장수 */
const THUMB_WINDOW = 3;
/** 번호 버튼 한 블록에 표시할 개수 */
const NUMBER_BLOCK = 10;

export function PublicGalleryShowcase({
  items,
  labels,
}: {
  items: PublicGalleryItem[];
  labels: {
    empty: string;
    prev: string;
    next: string;
    first: string;
    last: string;
    pageLabel: string;
    galleryNav: string;
  };
}) {
  const [active, setActive] = useState(0);
  const total = items.length;
  const current = items[active] ?? items[0];

  const thumbItems = useMemo(() => {
    const start = Math.floor(active / THUMB_WINDOW) * THUMB_WINDOW;
    return items.slice(start, start + THUMB_WINDOW).map((item, i) => ({
      item,
      index: start + i,
    }));
  }, [items, active]);

  const numberBlockStart = Math.floor(active / NUMBER_BLOCK) * NUMBER_BLOCK;
  const numberBlockEnd = Math.min(total, numberBlockStart + NUMBER_BLOCK);
  const numberButtons = useMemo(
    () => Array.from({ length: numberBlockEnd - numberBlockStart }, (_, i) => numberBlockStart + i),
    [numberBlockStart, numberBlockEnd],
  );

  useEffect(() => {
    if (total === 0) return;
    setActive((i) => Math.min(i, total - 1));
  }, [total]);

  const go = useCallback(
    (delta: number) => {
      if (total === 0) return;
      setActive((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (total < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  if (total === 0) {
    return <p className="text-sm text-brand-ink/60">{labels.empty}</p>;
  }

  return (
    <div className="space-y-6">
      <section
        aria-label={labels.galleryNav}
        className="relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-sm sm:p-3"
      >
        <div className="relative aspect-[16/10] min-h-[16rem] w-full overflow-hidden rounded-xl bg-brand-ink/[0.06] sm:min-h-[20rem]">
          {current?.kind === "video" ? (
            <video
              key={current.slug}
              src={current.src}
              className="absolute inset-0 h-full w-full object-contain bg-black"
              controls
              playsInline
              autoPlay
              preload="metadata"
            />
          ) : current ? (
            <MediaAwareImage
              key={current.slug}
              src={current.src}
              mediaSlug={current.slug}
              alt={current.title}
              fill
              priority
              className="object-cover"
            />
          ) : null}

          {total > 1 ? (
            <>
              <button
                type="button"
                aria-label={labels.prev}
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-brand-ink/55 text-white backdrop-blur-sm transition hover:bg-brand-ink/75 sm:left-3"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-brand-ink/55 text-white backdrop-blur-sm transition hover:bg-brand-ink/75 sm:right-3"
              >
                ›
              </button>
            </>
          ) : null}

          {current?.kind === "video" ? (
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-brand-ink/65 to-transparent px-4 pb-8 pt-3 sm:px-5">
              <p className="text-sm font-semibold text-white sm:text-base">
                {current.title}
                <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium tracking-wide">VIDEO</span>
              </p>
              {current.caption ? (
                <p className="mt-1 line-clamp-1 text-xs text-white/80">{current.caption}</p>
              ) : null}
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/25 to-transparent px-4 pb-4 pt-16 sm:px-5">
              <p className="text-base font-semibold text-white sm:text-lg">{current?.title}</p>
              {current?.caption ? (
                <p className="mt-1 line-clamp-2 text-sm text-white/80">{current.caption}</p>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {thumbItems.map(({ item, index }) => {
          const selected = index === active;
          return (
            <li key={item.slug}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`flex h-full w-full items-stretch gap-3 rounded-xl border p-3 text-left transition sm:gap-4 ${
                  selected
                    ? "border-brand bg-brand/[0.06] shadow-sm"
                    : "border-line bg-white hover:border-brand/30"
                }`}
              >
                <span className="relative block aspect-[4/3] w-[42%] shrink-0 overflow-hidden rounded-lg bg-brand-ink/[0.06]">
                  {item.kind === "video" ? (
                    <>
                      <video src={item.src} className="absolute inset-0 h-full w-full object-cover" muted playsInline preload="metadata" />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">VIDEO</span>
                      </span>
                    </>
                  ) : (
                    <MediaAwareImage
                      src={item.src}
                      mediaSlug={item.slug}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-brand-ink">
                    {item.title}
                  </span>
                  {item.caption ? (
                    <span className="line-clamp-2 text-xs leading-relaxed text-brand-ink/55">{item.caption}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {total > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={labels.galleryNav}>
          <PageButton
            label={labels.first}
            disabled={active <= 0}
            onClick={() => setActive(0)}
          />
          {numberBlockStart > 0 ? (
            <PageButton
              label="…"
              onClick={() => setActive(Math.max(0, numberBlockStart - 1))}
            />
          ) : null}
          {numberButtons.map((index) => {
            const n = index + 1;
            return (
              <PageButton
                key={index}
                label={labels.pageLabel.replace("{n}", String(n))}
                active={index === active}
                onClick={() => setActive(index)}
              />
            );
          })}
          {numberBlockEnd < total ? (
            <PageButton
              label="…"
              onClick={() => setActive(numberBlockEnd)}
            />
          ) : null}
          <PageButton
            label={labels.last}
            disabled={active >= total - 1}
            onClick={() => setActive(total - 1)}
          />
        </nav>
      ) : null}
    </div>
  );
}

function PageButton({
  label,
  onClick,
  active,
  disabled,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-lg border px-2.5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line text-brand-ink/70 hover:border-brand/40 hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}