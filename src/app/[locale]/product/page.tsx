import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { ProductBeoneNote, ProductLineGrid } from "@/components/ProductLineGrid";
import { PRODUCT_LINE_CATEGORIES } from "@/lib/product-categories";
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
  return (
    <div>
      <PageHero
        kicker={t("product.kicker")}
        title={t("product.title")}
        image={images.breakfast}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <ProductBeoneNote />
        <p className="mt-6 text-sm text-brand-ink/60">
          <Link href="/research" className="text-brand">
            {t("product.proofLink")}
          </Link>
          {" · "}
          <Link href="/certifications" className="text-brand">
            {t("product.certLink")}
          </Link>
        </p>

        {PRODUCT_LINE_CATEGORIES.map((key) => (
          <ProductLineGrid
            key={key}
            category={key}
            heading={t(`product.categories.${key}.title`)}
          />
        ))}

        <div className="mt-14">
          <CtaLink href="/contact">{t("cta.inquire")}</CtaLink>
        </div>
      </section>
    </div>
  );
}
