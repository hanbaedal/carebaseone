import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { ProductBeoneNote, ProductLineGrid } from "@/components/ProductLineGrid";
import {
  PRODUCT_CATEGORY_PATHS,
  PRODUCT_LINE_CATEGORIES,
  productCategoryFromPath,
} from "@/lib/product-categories";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { Link } from "@/i18n/navigation";
import { SectionTail } from "@/components/SectionTail";

export function generateStaticParams() {
  return PRODUCT_LINE_CATEGORIES.map((key) => ({
    category: PRODUCT_CATEGORY_PATHS[key],
  }));
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: slug } = await params;
  resolveLocale(locale);
  const category = productCategoryFromPath(slug);
  if (!category) notFound();

  const t = await getTranslations();
  const title = t(`product.categories.${category}.title`);

  return (
    <div>
      <PageHero kicker={t("product.kicker")} title={title} image={images.breakfast} />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm text-brand-ink/60">
          <Link href="/product" className="text-brand hover:underline">
            {t("nav.product")}
          </Link>
          <span className="mx-2 text-brand-ink/30">/</span>
          {title}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-brand-ink/70">
          {t(`product.categories.${category}.text`)}
        </p>
        <div className="mt-6">
          <ProductBeoneNote />
        </div>
        <ProductLineGrid category={category} heading={title} />
        <div className="mt-14">
          <CtaLink href="/contact">{t("cta.inquire")}</CtaLink>
        </div>
      </section>
      <SectionTail section="product" />
    </div>
  );
}
