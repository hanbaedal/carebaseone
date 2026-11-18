import type { CSSProperties } from "react";

type FeatureItem = {
  key: string;
  title: string;
  text: string;
};

/** 첨부 보드처럼 크림색 X 여백이 중앙에서 만나도록 각 패널을 잘라 냅니다. */
const PANEL_STYLES = [
  {
    bg: "bg-[#d9ebf7]",
    clip: "polygon(0% 0%, 100% 0%, 82% 100%, 0% 100%)",
  },
  {
    bg: "bg-[#d8ebda]",
    clip: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  {
    bg: "bg-[#f4ecc4]",
    clip: "polygon(0% 0%, 82% 0%, 100% 100%, 0% 100%)",
  },
  {
    bg: "bg-[#e4d8ef]",
    clip: "polygon(0% 0%, 100% 0%, 100% 100%, 18% 100%)",
  },
] as const;

export function FeatureQuadGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-[#f6f1e6] p-2 sm:p-3">
      <div className="grid gap-2 sm:gap-3 md:grid-cols-2 md:gap-3">
        {items.map((item, index) => {
          const style = PANEL_STYLES[index] ?? PANEL_STYLES[0];
          return (
            <article
              key={item.key}
              className={`feature-quad-cell flex min-h-[12.5rem] items-center justify-center rounded-2xl px-6 py-8 text-center sm:min-h-[14rem] sm:px-9 sm:py-10 md:min-h-[16rem] md:rounded-none ${style.bg}`}
              style={{ "--quad-clip": style.clip } as CSSProperties}
            >
              <div className="mx-auto flex max-w-[20rem] flex-col items-center justify-center gap-3">
                <h2 className="text-[1.08rem] font-bold leading-snug tracking-tight text-[#1a3a6e] sm:text-lg md:text-xl">
                  {item.title}
                </h2>
                <p className="text-[13px] leading-7 text-[#1a3a6e]/85 sm:text-sm sm:leading-7">
                  {item.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
