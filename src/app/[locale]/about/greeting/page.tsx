import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { CmsPageFooter } from "@/components/CmsPageFooter";

export default async function AboutGreetingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("aboutGreeting");

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} image={images.close} />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="whitespace-pre-line text-base leading-8 text-brand-ink/75">{t("body")}</p>
        <p className="mt-10 text-sm font-medium text-brand-ink">{t("sign")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink href="/about/features">{t("ctaFeatures")}</CtaLink>
          <CtaLink href="/contact" variant="light">
            {t("ctaContact")}
          </CtaLink>
        </div>
      </section>
      <CmsPageFooter section="aboutGreeting" />
    </div>
  );
}
