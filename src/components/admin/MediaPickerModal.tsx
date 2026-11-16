"use client";

import Image from "next/image";
import { images } from "@/lib/site";

export type CmsMediaOption = {
  slug: string;
  src: string;
  title: string;
};

const SITE_IMAGE_OPTIONS: CmsMediaOption[] = Object.entries(images).map(([key, src]) => ({
  slug: src,
  src,
  title: `사이트 · ${key}`,
}));

export function MediaPickerModal({
  open,
  options,
  currentSlug,
  onClose,
  onSelect,
}: {
  open: boolean;
  options: CmsMediaOption[];
  currentSlug: string;
  onClose: () => void;
  onSelect: (slugOrPath: string) => void;
}) {
  if (!open) return null;

  const all = [...SITE_IMAGE_OPTIONS, ...options];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
          <div>
            <h2 id="media-picker-title" className="text-sm font-semibold text-brand-ink">
              배경 이미지 선택
            </h2>
            <p className="text-[10px] text-ink/50">
              사이트 기본 이미지 · 자료실에 업로드한 이미지 (갤러리 업로드는 /admin/media)
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-[11px] text-ink/50 hover:text-ink">
            닫기
          </button>
        </div>
        <ul className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
          {all.map((item) => {
            const selected =
              currentSlug === item.slug ||
              currentSlug === item.src ||
              (!currentSlug && item.src === images.hero);
            return (
              <li key={`${item.slug}-${item.src}`}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.slug.startsWith("/") ? item.slug : item.slug || "");
                    onClose();
                  }}
                  className={`w-full overflow-hidden rounded-lg border text-left ${
                    selected ? "border-brand ring-2 ring-brand/30" : "border-ink/10 hover:border-brand/40"
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-ink/5">
                    <Image src={item.src} alt="" fill className="object-cover" sizes="160px" unoptimized />
                  </div>
                  <p className="truncate px-2 py-1.5 text-[10px] text-brand-ink">{item.title}</p>
                </button>
              </li>
            );
          })}
        </ul>
        {options.length === 0 ? (
          <p className="border-t border-ink/10 px-4 py-3 text-[11px] text-ink/50">
            업로드 이미지가 없으면 위 사이트 기본 이미지를 쓰거나,{" "}
            <a href="/admin/media" className="text-brand hover:underline">
              /admin/media
            </a>
            에 등록해 주세요.
          </p>
        ) : null}
      </div>
    </div>
  );
}