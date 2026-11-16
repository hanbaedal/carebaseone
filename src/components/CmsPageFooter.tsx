import { getLocale } from "next-intl/server";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { getCmsMessages, type Locale } from "@/lib/content";
import {
  PAGE_FOOTER_BG_DEFAULT,
  pageFooterTextColor,
  resolvePageFooterBackground,
} from "@/lib/page-footer";
import { CMS_FOOTER_INNER } from "@/lib/footer-layout";
import { getPath } from "@/lib/text";

type Props = {
  /** contents 섹션 키 (home, solution, contact, …) */
  section: string;
};

export async function CmsPageFooter({ section }: Props) {
  const locale = (await getLocale()) as Locale;
  const messages = await getCmsMessages(locale);
  const text = getPath(messages, `${section}.footerText`);
  const rights = getPath(messages, "footer.rights");
  const bgRaw = getPath(messages, `${section}.footerBg`);
  const bg = resolvePageFooterBackground(bgRaw, PAGE_FOOTER_BG_DEFAULT);
  const color = pageFooterTextColor(bg);

  return (
    <footer className="border-t border-black/10" style={{ backgroundColor: bg, color }}>
      <div className={CMS_FOOTER_INNER}>
        <CompanyContactBlock onBrandBg compact />
        {text.trim() ? (
          <p className="mt-4 whitespace-pre-line border-t border-current/15 pt-4 text-[12px] leading-5 opacity-90">
            {text}
          </p>
        ) : null}
        {rights.trim() ? (
          <p className="mt-3 text-[11px] tracking-wide opacity-75">{rights}</p>
        ) : null}
      </div>
    </footer>
  );
}