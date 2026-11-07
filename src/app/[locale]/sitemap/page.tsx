import { getLocale, getTranslations } from "next-intl/server";
import { SitemapCardGrid } from "@/components/SitemapCardGrid";
import { SitemapLocaleLinks } from "@/components/SitemapLocaleLinks";
import { headerNav } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function SiteMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const active = await getLocale();
  const tNav = (await getTranslations("nav")) as (key: string) => string;
  const tHome = (await getTranslations("home.pillars")) as (key: string) => string;
  const t = await getTranslations("sitemapPage");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("title")}</h1>
      <SitemapLocaleLinks activeLocale={active} caption={t("localeSwitch")} />
      <SitemapCardGrid items={headerNav} tNav={tNav} tHome={tHome} />
      <p className="mt-10 text-sm text-brand-ink/45">
        <a
          href="/sitemap.xml"
          className="text-brand-ink/55 underline-offset-2 hover:text-brand hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("xml")}
        </a>
      </p>
    </div>
  );
}
