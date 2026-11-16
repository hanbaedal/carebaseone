"use client";

import { HOME_SCALE_MAX, HOME_SCALE_MIN, HOME_SCALE_STEP } from "@/lib/home-hero";

export function FontScaleStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (percent: number) => void;
}) {
  const decrease = () => onChange(Math.max(HOME_SCALE_MIN, value - HOME_SCALE_STEP));
  const increase = () => onChange(Math.min(HOME_SCALE_MAX, value + HOME_SCALE_STEP));

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-md border border-ink/15 bg-white text-[16px] leading-none text-brand-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[12px] text-brand-ink">글자 크기</span>
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="글자 크기 조절"
      >
        <button type="button" onClick={decrease} disabled={value <= HOME_SCALE_MIN} className={btn}>
          −
        </button>
        <span className="min-w-[3.5rem] text-center text-[12px] font-semibold tabular-nums text-brand-ink">
          {value}%
        </span>
        <button type="button" onClick={increase} disabled={value >= HOME_SCALE_MAX} className={btn}>
          +
        </button>
      </div>
    </div>
  );
}