import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { ProductBeoneNote, ProductLineGrid } from "@/components/ProductLineGrid";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { Link } from "@/i18n/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <div>
      <PageHero
        kicker={t("product.kicker")}
        title={t("product.title")}
        lede={t("product.lede")}
        image={images.breakfast}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <ProductBeoneNote locale={locale} />
        <p className="mt-6 max-w-2xl text-sm leading-7 text-ink/65">{t("product.note")}</p>
        <p className="mt-4 text-sm text-brand-ink/60">
          <Link href="/research" className="text-brand">
            {t("product.proofLink")}
          </Link>
          {" · "}
          <Link href="/certifications" className="text-brand">
            {t("product.certLink")}
          </Link>
        </p>

        <ProductLineGrid locale={locale} category="patch" heading={t("product.categories.patch.text")} />
        <ProductLineGrid locale={locale} category="cosmetics" heading={t("product.categories.cosmetics.text")} />
        <ProductLineGrid locale={locale} category="beverage" heading={t("product.categories.beverage.text")} />

        <div className="mt-14">
          <CtaLink href="/contact">{t("cta.inquire")}</CtaLink>
        </div>
      </section>
    </div>
  );
}
