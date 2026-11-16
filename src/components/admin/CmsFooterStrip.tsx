"use client";

import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { SnsIconLinkRow } from "@/components/sns/SnsIconLinkRow";
import { companySnsLinks } from "@/lib/company-sns";
import { SITE_SNS_DEFAULTS } from "@/lib/company-sns";
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
  const previewSnsLinks = companySnsLinks({
    companyName: "",
    representativeName: "",
    companyPhone: "",
    companyFax: "",
    companyEmail: "",
    representativePhone: "",
    website: "",
    businessRegistrationNumber: "",
    businessType: "",
    businessItem: "",
    ...SITE_SNS_DEFAULTS,
    snsKakao: "",
  });
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <CompanyContactBlock onBrandBg compact className="min-w-0 flex-1" />
          <SnsIconLinkRow links={previewSnsLinks} compact onBrandBg />
        </div>
      </div>
    </button>
  );
}