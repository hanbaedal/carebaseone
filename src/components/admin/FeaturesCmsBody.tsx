"use client";

import { FeatureQuadGrid } from "@/components/FeatureQuadGrid";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";

const FEATURE_KEYS = ["tech", "product", "global", "trust"] as const;

function ring(active: boolean) {
  return active
    ? "rounded-md ring-2 ring-[#1a3a6e] ring-offset-2"
    : "rounded-md hover:ring-2 hover:ring-[#1a3a6e]/35 hover:ring-offset-2";
}

function previewText(value: string, empty: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : empty;
}

export function FeaturesCmsBody({
  values,
  activeSlot,
  onSelectSlot,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  const ledePath = "aboutFeatures.lede";
  const items = FEATURE_KEYS.map((key) => {
    const titlePath = `aboutFeatures.items.${key}.title`;
    const textPath = `aboutFeatures.items.${key}.text`;
    return {
      key,
      title: previewText(values[titlePath] ?? "", "제목"),
      text: previewText(values[textPath] ?? "", "설명"),
      titlePath,
      textPath,
    };
  });

  return (
    <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
      <button
        type="button"
        onClick={() => onSelectSlot(ledePath)}
        className={`block max-w-4xl border-0 bg-transparent p-0 text-left ${ring(activeSlot === ledePath)}`}
      >
        <p className="text-base leading-8 text-brand-ink/70">
          {previewText(values[ledePath] ?? "", "소개 문구")}
        </p>
      </button>

      <div className="mt-12">
        <FeatureQuadGrid
          items={items}
          renderContent={(item) => {
            const panel = items.find((entry) => entry.key === item.key)!;
            return (
              <>
                <button
                  type="button"
                  onClick={() => onSelectSlot(panel.titlePath)}
                  className={`border-0 bg-transparent p-1 text-center ${ring(activeSlot === panel.titlePath)}`}
                >
                  <span className="text-[1.08rem] font-bold leading-snug tracking-tight text-[#1a3a6e] sm:text-lg md:text-xl">
                    {panel.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSlot(panel.textPath)}
                  className={`border-0 bg-transparent p-1 text-center ${ring(activeSlot === panel.textPath)}`}
                >
                  <span className="text-[13px] leading-7 text-[#1a3a6e]/85 sm:text-sm sm:leading-7">
                    {panel.text}
                  </span>
                </button>
              </>
            );
          }}
        />
      </div>
    </section>
  );
}
