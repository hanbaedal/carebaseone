import type { CSSProperties } from "react";

type FeatureItem = {
  key: string;
  title: string;
  text: string;
};

/**
 * 참고 보드형:
 * - 1·2열 안쪽 세로변은 수직 → 열 간격이 일정
 * - 바깥 세로변만 중앙으로 기울어 전체 실루엣 형성
 * - 가로 맞닿는 변은 수평
 */
const PANEL_STYLES = [
  {
    // top-left — 안쪽(오른쪽) 수직, 바깥(왼쪽)만 기울기
    bg: "bg-[#d9ebf7]",
    clip: "polygon(0% 0%, 100% 0%, 100% 100%, 14% 100%)",
  },
  {
    // top-right — 안쪽(왼쪽) 수직, 바깥(오른쪽)만 기울기
    bg: "bg-[#d8ebda]",
    clip: "polygon(0% 0%, 100% 0%, 86% 100%, 0% 100%)",
  },
  {
    // bottom-left — 안쪽(오른쪽) 수직, 바깥(왼쪽)만 기울기
    bg: "bg-[#f4ecc4]",
    clip: "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  {
    // bottom-right — 안쪽(왼쪽) 수직, 바깥(오른쪽)만 기울기
    bg: "bg-[#e4d8ef]",
    clip: "polygon(0% 0%, 86% 0%, 100% 100%, 0% 100%)",
  },
] as const;

export function FeatureQuadGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-2 sm:gap-2.5 md:grid-cols-2 md:gap-2.5">
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
  );
}
