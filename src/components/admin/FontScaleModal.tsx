"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_SCALE_STEPS } from "@/lib/home-hero";

export function FontScaleModal({
  open,
  value,
  onClose,
  onSelect,
}: {
  open: boolean;
  value: number;
  onClose: () => void;
  onSelect: (percent: number) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [focusIndex, setFocusIndex] = useState(
    () => HOME_SCALE_STEPS.findIndex((s) => s === value) || 0,
  );

  useEffect(() => {
    if (!open) return;
    const idx = HOME_SCALE_STEPS.findIndex((s) => s === value);
    setFocusIndex(idx >= 0 ? idx : 10);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[focusIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [focusIndex, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => Math.min(HOME_SCALE_STEPS.length - 1, i + 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onSelect(HOME_SCALE_STEPS[focusIndex]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, focusIndex, onClose, onSelect]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="font-scale-title"
      onClick={onClose}
    >
      <div
        className="max-h-[70vh] w-full max-w-xs overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-ink/10 px-4 py-3">
          <h2 id="font-scale-title" className="text-sm font-semibold text-brand-ink">
            글자 크기
          </h2>
          <p className="mt-1 text-[10px] text-ink/50">↑↓ 이동 · Enter 또는 클릭으로 선택</p>
        </div>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {HOME_SCALE_STEPS.map((step, index) => (
            <li key={step}>
              <button
                type="button"
                className={`w-full px-4 py-2 text-left text-[13px] ${
                  index === focusIndex
                    ? "bg-forest text-cream"
                    : step === value
                      ? "bg-brand/10 text-brand"
                      : "text-brand-ink hover:bg-ink/5"
                }`}
                onMouseEnter={() => setFocusIndex(index)}
                onClick={() => onSelect(step)}
              >
                {step}%
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}