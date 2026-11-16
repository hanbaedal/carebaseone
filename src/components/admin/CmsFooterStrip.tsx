"use client";

import { CompanyContactBlock } from "@/components/CompanyContactBlock";
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-t border-black/10 text-left transition ${
        active ? "ring-2 ring-inset ring-brand" : "hover:ring-2 hover:ring-inset hover:ring-brand/40"
      }`}
      style={{ backgroundColor: bg, color }}
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        <CompanyContactBlock onBrandBg />
        {text.trim() ? (
          <p className="mt-6 whitespace-pre-line border-t border-current/15 pt-6 text-sm leading-7 opacity-90">
            {text}
          </p>
        ) : null}
        <p className="mt-4 text-xs tracking-wide opacity-75">© haesoo</p>
      </div>
    </button>
  );
}