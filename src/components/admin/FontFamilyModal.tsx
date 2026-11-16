"use client";

import {
  HOME_FONTS,
  type HomeFontId,
  parseHomeFont,
  resolveHomeFontFamily,
} from "@/lib/home-hero";

export function FontFamilyModal({
  open,
  value,
  fallback,
  onClose,
  onSelect,
}: {
  open: boolean;
  value: string;
  fallback: HomeFontId;
  onClose: () => void;
  onSelect: (fontId: HomeFontId) => void;
}) {
  const selected = parseHomeFont(value, fallback);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="text-font-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(85vh,28rem)] w-full max-w-sm overflow-y-auto rounded-xl border border-ink/10 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="text-font-title" className="text-sm font-semibold text-brand-ink">
          글자 폰트
        </h2>
        <p className="mt-1 text-[10px] text-ink/50">미리보기에 반영됩니다. 저장 버튼으로 확정하세요.</p>
        <ul className="mt-3 space-y-1.5">
          {HOME_FONTS.map((item) => {
            const isSelected = item.id === selected;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                    isSelected
                      ? "border-brand bg-brand/5 ring-1 ring-brand"
                      : "border-ink/10 hover:border-brand/30 hover:bg-ink/[0.03]"
                  }`}
                >
                  <span className="text-[12px] font-medium text-brand-ink">{item.label}</span>
                  <span
                    className="truncate text-[13px] text-brand-ink/80"
                    style={{ fontFamily: resolveHomeFontFamily(item.id, fallback) }}
                  >
                    가나다 ABC
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}