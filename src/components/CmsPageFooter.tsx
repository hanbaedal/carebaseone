import { getLocale } from "next-intl/server";
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
  if (!text.trim()) return null;

  const bgRaw = getPath(messages, `${section}.footerBg`);
  const bg = resolvePageFooterBackground(bgRaw, PAGE_FOOTER_BG_DEFAULT);
  const color = pageFooterTextColor(bg);

  return (
    <footer className="border-t border-black/10" style={{ backgroundColor: bg, color }}>
      <div className="mx-auto max-w-7xl whitespace-pre-line px-6 py-10 text-sm leading-7 md:py-12">
        {text}
      </div>
    </footer>
  );
}