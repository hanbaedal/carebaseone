"use client";

import { MediaAwareImage } from "@/components/MediaAwareImage";
import { useCallback, useEffect, useState } from "react";

export type PatentPreviewItem = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  isImage: boolean;
  thumbSrc: string;
};

export function PatentMediaPreviewGrid({
  items,
  labels,
}: {
  items: PatentPreviewItem[];
  labels: {
    empty: string;
    view: string;
    close: string;
    openFile: string;
  };
}) {
  const [active, setActive] = useState<PatentPreviewItem | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{labels.empty}</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {items.map((item) => (
          <li key={item.slug}>
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-white text-left shadow-sm transition hover:border-brand/25 hover:shadow-md"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden bg-brand-ink/[0.06]">
                {item.isImage ? (
                  <MediaAwareImage
                    src={item.thumbSrc}
                    mediaSlug={item.slug}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <iframe
                    title={item.title}
                    src={`${item.href}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
                    className="pointer-events-none absolute left-0 top-0 h-[115%] w-full origin-top scale-[1.08] border-0 bg-white"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-2 pb-2 pt-8 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {labels.view}
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-1 p-3">
                <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-brand-ink group-hover:text-brand">
                  {item.title}
                </span>
                {item.summary ? (
                  <span className="line-clamp-2 text-[11px] leading-relaxed text-brand-ink/55">{item.summary}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6" role="presentation">
          <button
            type="button"
            aria-label={labels.close}
            className="absolute inset-0 bg-brand-ink/60 backdrop-blur-[2px]"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex max-h-[min(92dvh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <h2 className="text-base font-semibold text-brand-ink sm:text-lg">{active.title}</h2>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-md border border-line px-2.5 py-1 text-xs text-brand-ink/70 hover:bg-ink/5"
              >
                {labels.close}
              </button>
            </div>
            <div className="relative min-h-[min(60dvh,640px)] flex-1 bg-ink/5">
              {active.isImage ? (
                <MediaAwareImage
                  src={active.thumbSrc}
                  mediaSlug={active.slug}
                  alt=""
                  className="mx-auto max-h-[min(72dvh,780px)] w-full object-contain p-2"
                />
              ) : (
                <iframe title={active.title} src={active.href} className="absolute inset-0 h-full w-full border-0 bg-white" />
              )}
            </div>
            {active.summary ? (
              <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-brand-ink/70 sm:px-5">
                {active.summary}
              </p>
            ) : null}
            <div className="border-t border-line px-4 py-3 sm:px-5">
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand hover:underline"
              >
                {labels.openFile} ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}