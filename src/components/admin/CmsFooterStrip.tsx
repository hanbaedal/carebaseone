"use client";

import {
  PAGE_FOOTER_BG_DEFAULT,
  pageFooterTextColor,
  resolvePageFooterBackground,
} from "@/lib/page-footer";

export function CmsFooterStrip({
  bgId,
  text,
  active,
  onClick,
}: {
  bgId: string;
  text: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const bg = resolvePageFooterBackground(bgId, PAGE_FOOTER_BG_DEFAULT);
  const color = pageFooterTextColor(bg);
  const body = text.trim() || "풋터 문구를 입력하세요.";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-t border-black/10 text-left transition ${
        active ? "ring-2 ring-inset ring-brand" : "hover:ring-2 hover:ring-inset hover:ring-brand/40"
      }`}
      style={{ backgroundColor: bg, color }}
    >
      <div className="mx-auto max-w-7xl whitespace-pre-line px-6 py-8 text-sm leading-7">
        {body}
      </div>
    </button>
  );
}