import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { CtaLink } from "@/components/CtaLink";
import { ProductBeoneNote, ProductLineGrid } from "@/components/ProductLineGrid";
import { PRODUCT_LINE_CATEGORIES } from "@/lib/product-categories";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";
import { SectionHubList } from "@/components/SectionHubList";
import { PRODUCT_HUB_BLOCKS } from "@/lib/section-hub";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();
  return (
    <div>
      <CmsSectionHero section="product" imageFallback={images.breakfast} />
      <SectionHubList blocks={PRODUCT_HUB_BLOCKS} imageSection="product" />
      <section className="mx-auto max-w-6xl px-guest-gutter py-16">
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
      <SectionTail section="product" />
    </div>
  );
}
