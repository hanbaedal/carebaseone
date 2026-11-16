"use client";

import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { PAGE_FOOTER_BG_DEFAULT, pageFooterTextColor, resolvePageFooterBackground } from "@/lib/page-footer";
import { CMS_FOOTER_INNER } from "@/lib/footer-layout";

export function CmsFooterStrip({
  bgId,
  active,
  onClick,
}: {
  bgId: string;
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
      <div className={CMS_FOOTER_INNER}>
        <CompanyContactBlock onBrandBg compact />
      </div>
    </button>
  );
}