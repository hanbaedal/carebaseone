"use client";

import {
  HOME_TEXT_COLORS,
  type HomeTextColorId,
  parseHomeTextColor,
} from "@/lib/home-hero";

export function TextColorModal({
  open,
  value,
  fallback,
  onClose,
  onSelect,
}: {
  open: boolean;
  value: string;
  fallback: HomeTextColorId;
  onClose: () => void;
  onSelect: (colorId: HomeTextColorId) => void;
}) {
  const selected = parseHomeTextColor(value, fallback);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="text-color-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-xl border border-ink/10 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="text-color-title" className="text-sm font-semibold text-brand-ink">
          글자 컬러
        </h2>
        <p className="mt-1 text-[10px] text-ink/50">미리보기에 반영됩니다. 저장 버튼으로 확정하세요.</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {HOME_TEXT_COLORS.map((item) => {
            const isSelected = item.id === selected;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className={`flex flex-col items-center gap-1 rounded-lg p-1.5 ${
                  isSelected ? "ring-2 ring-brand ring-offset-1" : "hover:bg-ink/5"
                }`}
              >
                <span
                  className="h-8 w-8 rounded-md border border-black/15 shadow-sm"
                  style={{ backgroundColor: item.hex }}
                />
                <span className="text-[9px] text-ink/55">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}