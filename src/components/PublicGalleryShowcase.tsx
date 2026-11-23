"use client";

import { MediaAwareImage } from "@/components/MediaAwareImage";
import { useCallback, useEffect, useMemo, useState } from "react";

export type PublicGalleryItem = {
  slug: string;
  src: string;
  title: string;
  caption: string;
};

const PAGE_SIZE = 3;

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
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE).map((item, i) => ({
      item,
      index: start + i,
    }));
  }, [items, safePage]);

  const current = items[active] ?? items[0];

  useEffect(() => {
    if (items.length === 0) return;
    setActive((i) => Math.min(i, items.length - 1));
  }, [items.length]);

  useEffect(() => {
    const pageForActive = Math.floor(active / PAGE_SIZE) + 1;
    setPage(pageForActive);
  }, [active]);

  const go = useCallback(
    (delta: number) => {
      if (items.length === 0) return;
      setActive((i) => (i + delta + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (items.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, items.length]);

  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{labels.empty}</p>;
  }

  return (
    <div className="space-y-6">
      <section
        aria-label={labels.galleryNav}
        className="relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-sm sm:p-3"
      >
        <div className="relative aspect-[16/10] min-h-[16rem] w-full overflow-hidden rounded-xl bg-brand-ink/[0.06] sm:min-h-[20rem]">
          <div
            className="flex h-full transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{
              width: `${items.length * 100}%`,
              transform: `translateX(-${(100 / items.length) * active}%)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.slug}
                className="relative h-full shrink-0"
                style={{ width: `${100 / items.length}%` }}
              >
                <MediaAwareImage
                  src={item.src}
                  mediaSlug={item.slug}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {items.length > 1 ? (
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/25 to-transparent px-4 pb-4 pt-16 sm:px-5">
            <p className="text-base font-semibold text-white sm:text-lg">{current?.title}</p>
            {current?.caption ? (
              <p className="mt-1 line-clamp-2 text-sm text-white/80">{current.caption}</p>
            ) : null}
          </div>
        </div>
      </section>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {pageItems.map(({ item, index }) => {
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
                  <MediaAwareImage
                    src={item.src}
                    mediaSlug={item.slug}
                    alt=""
                    fill
                    className="object-cover"
                  />
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

      {totalPages > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={labels.galleryNav}>
          <PageButton
            label={labels.first}
            disabled={safePage <= 1}
            onClick={() => {
              setPage(1);
              setActive(0);
            }}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <PageButton
              key={n}
              label={labels.pageLabel.replace("{n}", String(n))}
              active={n === safePage}
              onClick={() => {
                setPage(n);
                setActive((n - 1) * PAGE_SIZE);
              }}
            />
          ))}
          <PageButton
            label={labels.last}
            disabled={safePage >= totalPages}
            onClick={() => {
              setPage(totalPages);
              setActive((totalPages - 1) * PAGE_SIZE);
            }}
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