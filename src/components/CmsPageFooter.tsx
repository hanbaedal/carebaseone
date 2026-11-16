import { getLocale } from "next-intl/server";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { getCmsMessages, type Locale } from "@/lib/content";
import {
  PAGE_FOOTER_BG_DEFAULT,
  pageFooterTextColor,
  resolvePageFooterBackground,
} from "@/lib/page-footer";
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
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <CompanyContactBlock onBrandBg />
        {text.trim() ? (
          <p className="mt-8 whitespace-pre-line border-t border-current/15 pt-8 text-sm leading-7 opacity-90">
            {text}
          </p>
        ) : null}
        {rights.trim() ? (
          <p className="mt-6 text-xs tracking-wide opacity-75">{rights}</p>
        ) : null}
      </div>
    </footer>
  );
}