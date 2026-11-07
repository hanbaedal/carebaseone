import { getLocale, getTranslations } from "next-intl/server";
import { SitemapCardGrid } from "@/components/SitemapCardGrid";
import { SitemapLocaleLinks } from "@/components/SitemapLocaleLinks";
import { navGroups } from "@/lib/site";
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
      <p className="mt-3 max-w-2xl text-brand-ink/65">{t("lede")}</p>
      <p className="mt-2 text-sm text-brand-ink/50">{t("cardHint")}</p>
      <SitemapLocaleLinks activeLocale={active} caption={t("localeSwitch")} />
      <SitemapCardGrid
        groups={navGroups}
        tNav={tNav}
        tHome={tHome}
        tExtra={{ extra: t("extra"), xml: t("xml"), about: tNav("about") }}
      />
    </div>
  );
}
