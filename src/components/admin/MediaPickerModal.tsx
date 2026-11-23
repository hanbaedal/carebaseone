"use client";

import { GalleryThumbImage } from "@/components/admin/GalleryThumbImage";

export type CmsMediaOption = {
  slug: string;
  src: string;
  title: string;
};

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
              갤러리에서 배경 이미지 선택
            </h2>
            <p className="text-[10px] text-ink/50">
              이미지 갤러리(CMS 배경) · /admin/gallery
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-[11px] text-ink/50 hover:text-ink">
            닫기
          </button>
        </div>
        {options.length > 0 ? (
          <ul className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
            {options.map((item) => {
              const selected =
                currentSlug === item.slug ||
                currentSlug === item.src ||
                (!currentSlug && item.slug === "gallery-site-hero");
              return (
                <li key={`${item.slug}-${item.src}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item.slug);
                      onClose();
                    }}
                    className={`w-full overflow-hidden rounded-lg border text-left ${
                      selected
                        ? "border-brand ring-2 ring-brand/30"
                        : "border-ink/10 hover:border-brand/40"
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-ink/5">
                      <GalleryThumbImage
                        src={item.src}
                        slug={item.slug}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <p className="truncate px-2 py-1.5 text-[10px] text-brand-ink">{item.title}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-[12px] text-ink/50">
            등록된 갤러리 이미지가 없습니다.{" "}
            <a href="/admin/gallery" className="text-brand hover:underline">
              이미지 갤러리
            </a>
            에서 이미지를 업로드해 주세요.
          </p>
        )}
        <div className="border-t border-ink/10 px-4 py-3 text-[11px] text-ink/50">
          새 이미지는{" "}
          <a href="/admin/gallery" className="text-brand hover:underline">
            배경 이미지 갤러리
          </a>
          에서 올리고 「CMS 배경」을 체크하면 여기에도 나타납니다.
        </div>
      </div>
    </div>
  );
}
