import type { CSSProperties } from "react";

type FeatureItem = {
  key: string;
  title: string;
  text: string;
};

/**
 * 목표 형태(핀휠):
 * - 안쪽(가운데) 세로변이 기울어짐
 * - 위·아래가 맞닿는 가로변은 수평에 가깝게
 * - 바깥이 잘록한 보타이(좌우 V)가 되지 않게
 */
const PANEL_STYLES = [
  {
    // top-left — 윗변은 가운데로 올라가며, 안쪽(오른쪽) 변이 기울고, 아랫변은 수평
    bg: "bg-[#d9ebf7]",
    clip: "polygon(0% 12%, 100% 0%, 86% 100%, 0% 100%)",
  },
  {
    // top-right — top-left의 좌우 대칭
    bg: "bg-[#d8ebda]",
    clip: "polygon(0% 0%, 100% 12%, 100% 100%, 14% 100%)",
  },
  {
    // bottom-left — 윗변 수평, 안쪽(오른쪽) 변이 기울고, 아랫변은 가운데로 내려감
    bg: "bg-[#f4ecc4]",
    clip: "polygon(0% 0%, 86% 0%, 100% 100%, 0% 88%)",
  },
  {
    // bottom-right — bottom-left의 좌우 대칭
    bg: "bg-[#e4d8ef]",
    clip: "polygon(14% 0%, 100% 0%, 100% 88%, 0% 100%)",
  },
] as const;

export function FeatureQuadGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid gap-2 sm:gap-3 md:grid-cols-2 md:gap-3">
      {items.map((item, index) => {
        const style = PANEL_STYLES[index] ?? PANEL_STYLES[0];
        return (
          <article
            key={item.key}
            className={`feature-quad-cell flex min-h-[12.5rem] items-center justify-center rounded-2xl px-6 py-8 text-center sm:min-h-[14rem] sm:px-9 sm:py-10 md:min-h-[16.5rem] md:rounded-none ${style.bg}`}
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
  );
}
