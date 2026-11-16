import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const featureKeys = ["tech", "product", "global", "trust"] as const;

export default async function AboutFeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("aboutFeatures");

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} image={images.lab} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="max-w-2xl text-base leading-8 text-brand-ink/70">{t("lede")}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featureKeys.map((key) => (
            <article key={key} className="rounded-3xl border border-line bg-white p-7">
              <h2 className="text-lg font-bold text-brand-ink">{t(`items.${key}.title`)}</h2>
              <p className="mt-3 text-sm leading-7 text-brand-ink/70">{t(`items.${key}.text`)}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <CtaLink href="/product">{t("ctaProduct")}</CtaLink>
          <CtaLink href="/about/greeting" variant="light">
            {t("ctaGreeting")}
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
