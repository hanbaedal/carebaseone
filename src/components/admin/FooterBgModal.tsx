"use client";

import { useEffect, useState } from "react";
import { HOME_TEXT_COLORS } from "@/lib/home-hero";
import {
  PAGE_FOOTER_BG_DEFAULT,
  PAGE_FOOTER_OPACITIES,
  composeFooterBgId,
  parseFooterBgParts,
  resolvePageFooterBackground,
} from "@/lib/page-footer";

export function FooterBgModal({
  open,
  value,
  onClose,
  onSelect,
}: {
  open: boolean;
  value: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [colorId, setColorId] = useState("white");
  const [opacityKey, setOpacityKey] = useState<(typeof PAGE_FOOTER_OPACITIES)[number]["key"]>("100");

  useEffect(() => {
    if (!open) return;
    const p = parseFooterBgParts(value || PAGE_FOOTER_BG_DEFAULT);
    setColorId(p.colorId);
    setOpacityKey(p.opacityKey);
  }, [open, value]);

  if (!open) return null;

  const composed = composeFooterBgId(colorId, opacityKey);
  const previewBg = resolvePageFooterBackground(composed);

  const apply = (nextColor: string, nextOpacity: typeof opacityKey) => {
    const id = composeFooterBgId(nextColor, nextOpacity);
    setColorId(nextColor);
    setOpacityKey(nextOpacity);
    onSelect(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="footer-bg-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-xl border border-ink/10 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="footer-bg-title" className="text-sm font-semibold text-brand-ink">
          풋터 배경색
        </h2>
        <p className="mt-1 text-[10px] text-ink/50">미리보기에 반영됩니다. 저장 버튼으로 확정하세요.</p>

        <p className="mt-3 text-[11px] font-medium text-brand-ink">색</p>
        <div className="mt-1.5 grid grid-cols-4 gap-2">
          {HOME_TEXT_COLORS.map((item) => {
            const isSelected = item.id === colorId;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => apply(item.id, opacityKey)}
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

        <p className="mt-3 text-[11px] font-medium text-brand-ink">투명도</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PAGE_FOOTER_OPACITIES.map((item) => {
            const isSelected = item.key === opacityKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => apply(colorId, item.key)}
                className={`rounded-md border px-2.5 py-1.5 text-[11px] ${
                  isSelected
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-ink/15 text-brand-ink hover:bg-ink/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          className="mt-3 flex h-10 items-center justify-center rounded-md border border-ink/15 text-[10px] text-ink/50"
          style={{
            backgroundColor: previewBg,
            backgroundImage:
              previewBg === "transparent"
                ? "linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%,#e5e7eb),linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%,#e5e7eb)"
                : undefined,
            backgroundSize: previewBg === "transparent" ? "12px 12px" : undefined,
            backgroundPosition: previewBg === "transparent" ? "0 0, 6px 6px" : undefined,
          }}
        >
          미리보기
        </div>
      </div>
    </div>
  );
}