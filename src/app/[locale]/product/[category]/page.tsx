import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductLineGrid } from "@/components/ProductLineGrid";
import {
  PRODUCT_CATEGORY_PATHS,
  PRODUCT_LINE_CATEGORIES,
  productCategoryFromPath,
} from "@/lib/product-categories";
import { cmsPageHeroImage } from "@/lib/cms-page-hero";
import {
  GUEST_CONTENT_MAX,
  GUEST_HERO_FRAME,
  GUEST_HERO_IMAGE_SIZES,
} from "@/lib/guest-layout";
import { resolveHubBlockImageSrc } from "@/lib/hub-media";
import {
  defaultColorForTextPath,
  defaultFontForTextPath,
  heroImageUnoptimized,
  homeHeadlineFontSizeFluid,
  homeKickerFontSizeFluid,
  homeLedeFontSizeFluid,
  parseHomeScale,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
} from "@/lib/home-hero";
import { resolveLocale } from "@/lib/locale";
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

  const t = await getTranslations("product");
  const tr = t as unknown as (key: string) => string;
  const title = tr(`categories.${category}.title`);
  const text = tr(`categories.${category}.text`);
  const kicker = tr("kicker");
  const heroSrc = resolveHubBlockImageSrc(
    cmsPageHeroImage(category),
    tr(`categories.${category}.image`),
  );

  function styleFor(kind: "kicker" | "title" | "lede") {
    const textPath =
      kind === "kicker"
        ? "product.kicker"
        : kind === "title"
          ? `product.categories.${category}.title`
          : `product.categories.${category}.text`;
    const scaleKey =
      kind === "kicker" ? "kickerScale" : kind === "title" ? `categories.${category}.titleScale` : null;
    const colorKey =
      kind === "kicker" ? "kickerColor" : kind === "title" ? `categories.${category}.titleColor` : null;
    const fontKey =
      kind === "kicker" ? "kickerFont" : kind === "title" ? `categories.${category}.titleFont` : null;
    const scale = parseHomeScale(scaleKey ? tr(scaleKey) : "100");
    const color = resolveHomeTextColorHex(
      colorKey ? tr(colorKey) : undefined,
      defaultColorForTextPath(textPath),
    );
    const family = resolveHomeFontFamily(
      fontKey ? tr(fontKey) : undefined,
      defaultFontForTextPath(textPath),
    );
    const fontSize =
      kind === "kicker"
        ? homeKickerFontSizeFluid(scale)
        : kind === "title"
          ? homeHeadlineFontSizeFluid(scale)
          : homeLedeFontSizeFluid(scale);
    return { fontSize, color, fontFamily: family };
  }

  return (
    <div>
      <section className="bg-paper">
        <div className={`${GUEST_HERO_FRAME} min-h-[56vh] bg-brand-ink text-white`}>
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            className="object-cover object-center opacity-55"
            sizes={GUEST_HERO_IMAGE_SIZES}
            unoptimized={heroImageUnoptimized(heroSrc)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-brand-ink/45 to-transparent" />
          <div className="relative flex min-h-[56vh] w-full flex-col justify-end px-guest-gutter pb-16 pt-28">
            <p className="font-semibold tracking-[0.22em]" style={styleFor("kicker")}>
              {kicker}
            </p>
            <h1
              className="mt-4 max-w-3xl whitespace-pre-line font-display leading-tight"
              style={styleFor("title")}
            >
              {title}
            </h1>
            {text.trim() ? (
              <p
                className="mt-6 max-w-4xl whitespace-pre-line text-left leading-8"
                style={styleFor("lede")}
              >
                {text}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
        <p className="max-w-4xl text-left text-base leading-8 text-brand-ink/70">{text}</p>
        <div className="mt-12">
          <ProductLineGrid category={category} heading="" />
        </div>
      </section>
      <SectionTail section="product" />
    </div>
  );
}
