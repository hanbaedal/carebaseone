"use client";

import { useState } from "react";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { cmsTypoInlineStyle } from "@/lib/cms-typography-styles";

/**
 * 공개 /contact 문의 폼과 동일한 레이아웃 — 라벨·버튼 문구 클릭 시 CMS 슬롯 편집.
 */
export function ContactCmsBody({
  values,
  activeSlot,
  onSelectSlot,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  const [audience, setAudience] = useState<"consumer" | "partner">("consumer");

  function SlotLabel({
    path,
    empty,
    className = "",
  }: {
    path: string;
    empty: string;
    className?: string;
  }) {
    return (
      <button
        type="button"
        onClick={() => onSelectSlot(path)}
        className={`border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === path)} ${className}`}
      >
        <span style={cmsTypoInlineStyle(path, values)}>
          {cmsPreviewText(values[path] ?? "", empty)}
        </span>
      </button>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-guest-gutter py-20">
      <div className="grid gap-5">
        <fieldset className="grid gap-3">
          <legend>
            <SlotLabel path="contact.audience" empty="문의 유형" className="text-[11px] tracking-[0.18em] text-ink/55" />
          </legend>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { value: "consumer" as const, path: "contact.consumer", empty: "제품 · 솔루션 문의" },
                { value: "partner" as const, path: "contact.partner", empty: "파트너십 · OEM 문의" },
              ]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setAudience(opt.value);
                  onSelectSlot(opt.path);
                }}
                className={`border px-4 py-2 text-sm ${
                  audience === opt.value
                    ? "border-forest bg-forest text-cream"
                    : "border-ink/15"
                } ${cmsSlotRing(activeSlot === opt.path)}`}
              >
                <span style={cmsTypoInlineStyle(opt.path, values)}>
                  {cmsPreviewText(values[opt.path] ?? "", opt.empty)}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {(
          [
            { path: "contact.name", empty: "이름" },
            { path: "contact.email", empty: "이메일" },
            { path: "contact.organization", empty: "소속 / 회사" },
            { path: "contact.country", empty: "국가" },
          ] as const
        ).map((field) => (
          <div key={field.path} className="grid gap-2 text-sm">
            <SlotLabel path={field.path} empty={field.empty} />
            <span className="block min-h-[2.5rem] border border-ink/15 bg-white px-3 py-2" />
          </div>
        ))}

        {audience === "partner" ? (
          <div className="grid gap-2 text-sm">
            <SlotLabel path="contact.partnerType" empty="관심 분야" />
            <div className="flex flex-wrap gap-2 border border-ink/15 bg-white px-3 py-2">
              {(
                [
                  { path: "contact.types.oem", empty: "OEM / ODM" },
                  { path: "contact.types.distribution", empty: "유통 · 판매" },
                  { path: "contact.types.education", empty: "교육" },
                  { path: "contact.types.center", empty: "헬스케어 센터" },
                  { path: "contact.types.other", empty: "기타" },
                ] as const
              ).map((opt) => (
                <SlotLabel
                  key={opt.path}
                  path={opt.path}
                  empty={opt.empty}
                  className="text-sm text-ink/70"
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-2 text-sm">
          <SlotLabel path="contact.message" empty="메시지" />
          <span className="block min-h-[9rem] border border-ink/15 bg-white px-3 py-2" />
        </div>

        <button
          type="button"
          onClick={() => onSelectSlot("contact.submit")}
          className={`w-fit border-0 bg-forest px-6 py-3 text-[12px] tracking-[0.18em] text-cream ${cmsSlotRing(activeSlot === "contact.submit")}`}
        >
          <span style={cmsTypoInlineStyle("contact.submit", values)}>
            {cmsPreviewText(values["contact.submit"] ?? "", "보내기")}
          </span>
        </button>
      </div>
    </section>
  );
}
