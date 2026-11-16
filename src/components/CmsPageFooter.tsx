import { getLocale } from "next-intl/server";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { FooterSnsRow } from "@/components/FooterSnsRow";
import { getCmsMessages, type Locale } from "@/lib/content";
import {
  PAGE_FOOTER_BG_DEFAULT,
  pageFooterTextColor,
  resolvePageFooterBackground,
} from "@/lib/page-footer";
import { CMS_FOOTER_INNER, CMS_FOOTER_INNER_DOCKED } from "@/lib/footer-layout";
import { getPath } from "@/lib/text";

type Props = {
  /** contents 섹션 키 (home, solution, contact, …) */
  section: string;
  /** 홈 — 히어로와 한 화면에 붙는 하단 */
  docked?: boolean;
};

export async function CmsPageFooter({ section, docked }: Props) {
  const locale = (await getLocale()) as Locale;
  const messages = await getCmsMessages(locale);
  const bgRaw = getPath(messages, `${section}.footerBg`);
  const bg = resolvePageFooterBackground(bgRaw, PAGE_FOOTER_BG_DEFAULT);
  const color = pageFooterTextColor(bg);

  const inner = docked ? CMS_FOOTER_INNER_DOCKED : CMS_FOOTER_INNER;

  return (
    <footer
      className={`border-t border-black/10 ${docked ? "shrink-0" : ""}`}
      style={{ backgroundColor: bg, color }}
    >
      <div className={inner}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <CompanyContactBlock onBrandBg compact className="min-w-0 flex-1" />
          <FooterSnsRow compact onBrandBg />
        </div>
      </div>
    </footer>
  );
}