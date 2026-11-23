"use client";

import { useState } from "react";

/**
 * 공개 /contact 문의 폼과 동일한 레이아웃 미리보기 (제출 없음).
 */
export function ContactCmsBody() {
  const [audience, setAudience] = useState<"consumer" | "partner">("consumer");

  return (
    <section className="mx-auto max-w-xl px-guest-gutter py-20">
      <div className="grid gap-5">
        <fieldset className="grid gap-3">
          <legend className="text-[11px] tracking-[0.18em] text-ink/55">
            문의 유형
          </legend>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { value: "consumer", label: "제품 · 솔루션 문의" },
                { value: "partner", label: "파트너십 · OEM 문의" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAudience(opt.value)}
                className={`border px-4 py-2 text-sm ${
                  audience === opt.value
                    ? "border-forest bg-forest text-cream"
                    : "border-ink/15"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        {(
          [
            { label: "이름" },
            { label: "이메일" },
            { label: "소속 / 회사" },
            { label: "국가" },
          ] as const
        ).map((field) => (
          <label key={field.label} className="grid gap-2 text-sm">
            {field.label}
            <span className="block min-h-[2.5rem] border border-ink/15 bg-white px-3 py-2" />
          </label>
        ))}

        {audience === "partner" ? (
          <label className="grid gap-2 text-sm">
            관심 분야
            <span className="block min-h-[2.5rem] border border-ink/15 bg-white px-3 py-2 text-ink/45">
              OEM / ODM
            </span>
          </label>
        ) : null}

        <label className="grid gap-2 text-sm">
          메시지
          <span className="block min-h-[9rem] border border-ink/15 bg-white px-3 py-2" />
        </label>

        <span className="w-fit bg-forest px-6 py-3 text-[12px] tracking-[0.18em] text-cream">
          보내기
        </span>
      </div>
    </section>
  );
}
