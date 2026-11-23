"use client";

import { useEffect } from "react";

export function GallerySlideModal({
  open,
  onOpenChange,
  items,
  index,
  onIndexChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: { src: string; alt: string; kind?: "image" | "video" }[];
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const current = items[index];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onIndexChange(Math.min(items.length - 1, index + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onIndexChange, onOpenChange]);

  if (!open || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => onOpenChange(false)}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="absolute -top-10 right-0 text-sm text-white/90 hover:text-white"
          onClick={() => onOpenChange(false)}
        >
          닫기
        </button>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/40">
          {current.kind === "video" ? (
            <video
              key={current.src}
              src={current.src}
              className="h-full w-full object-contain"
              controls
              playsInline
              autoPlay
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.src} alt={current.alt} className="h-full w-full object-contain" />
          )}
        </div>
        <p className="mt-2 text-center text-sm text-white/90">
          {index + 1} / {items.length}
          {current.alt ? ` · ${current.alt}` : ""}
        </p>
        {items.length > 1 ? (
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              disabled={index === 0}
              className="rounded bg-white/15 px-4 py-2 text-sm text-white disabled:opacity-30"
              onClick={() => onIndexChange(index - 1)}
            >
              이전
            </button>
            <button
              type="button"
              disabled={index >= items.length - 1}
              className="rounded bg-white/15 px-4 py-2 text-sm text-white disabled:opacity-30"
              onClick={() => onIndexChange(index + 1)}
            >
              다음
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}