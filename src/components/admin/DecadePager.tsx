"use client";

const DECADE = 10;

export function DecadePager({
  total,
  index,
  onGo,
  itemLabel,
  label,
}: {
  total: number;
  index: number;
  onGo: (index: number) => void;
  itemLabel: (n: number) => string;
  label?: string;
}) {
  if (total < 1) return null;

  const safeIndex = Math.max(0, Math.min(index, total - 1));
  const windowStart = Math.floor(safeIndex / DECADE) * DECADE;
  const windowCount = Math.min(DECADE, total - windowStart);
  const prevTarget = windowStart - DECADE;
  const nextTarget = windowStart + DECADE;
  const prevN = prevTarget + 1;
  const nextN = nextTarget + 1;

  const btn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded border border-ink/15 bg-white px-2 text-xs text-brand-ink hover:bg-ink/5 disabled:pointer-events-none disabled:opacity-40";
  const btnActive = `${btn} border-brand bg-brand text-cream`;

  return (
    <nav aria-label={label ?? "등록된 사진"} className="flex flex-wrap items-center justify-center gap-1">
      <button type="button" className={btn} disabled={safeIndex === 0} aria-label="첫 사진" onClick={() => onGo(0)}>
        «
      </button>
      <button
        type="button"
        className={btn}
        disabled={windowStart === 0}
        aria-label={windowStart === 0 ? "이전 10장" : `${prevN}번부터`}
        onClick={() => onGo(prevTarget)}
      >
        ‹{windowStart > 0 ? prevN : ""}
      </button>
      {Array.from({ length: windowCount }, (_, i) => {
        const itemIndex = windowStart + i;
        return (
          <button
            key={itemIndex}
            type="button"
            className={itemIndex === safeIndex ? btnActive : btn}
            aria-label={itemLabel(itemIndex + 1)}
            aria-current={itemIndex === safeIndex ? "true" : undefined}
            onClick={() => onGo(itemIndex)}
          >
            {itemIndex + 1}
          </button>
        );
      })}
      <button
        type="button"
        className={btn}
        disabled={nextTarget >= total}
        aria-label={nextTarget >= total ? "다음 10장" : `${nextN}번부터`}
        onClick={() => onGo(nextTarget)}
      >
        {nextTarget < total ? nextN : ""}›
      </button>
      <button
        type="button"
        className={btn}
        disabled={safeIndex === total - 1}
        aria-label="마지막 사진"
        onClick={() => onGo(total - 1)}
      >
        »
      </button>
    </nav>
  );
}