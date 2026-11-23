import { getLocale, getTranslations } from "next-intl/server";
import catalog from "@/data/product-catalog.json";
import type { ProductLineCategory } from "@/lib/product-categories";
import { PRODUCT_CATEGORY_PATHS } from "@/lib/product-categories";
import {
  ProductCatalogCards,
  type ProductCatalogCard,
} from "@/components/ProductCatalogCards";
import { cmsTypoStyleFromT } from "@/lib/cms-typography-styles";
import {
  PRODUCT_BEONE_NOTE_PATH,
  resolveProductCatalogImageSrc,
  resolveProductCatalogText,
} from "@/lib/product-catalog-media";

export async function ProductLineGrid({
  category,
  heading,
}: {
  category: ProductLineCategory;
  heading: string;
}) {
  const t = await getTranslations("productCatalog");
  const tProduct = await getTranslations("product");
  const lineText = t as unknown as (key: string) => string;
  const productText = tProduct as unknown as (key: string) => string;
  const lines = catalog.lines.filter((l) => l.category === category);
  if (lines.length === 0) return null;

  const items: ProductCatalogCard[] = lines.map((line) => ({
    slug: line.slug,
    title: resolveProductCatalogText(
      productText(`catalog.${line.slug}.title`),
      lineText(`lines.${line.slug}.title`),
    ),
    summary: resolveProductCatalogText(
      productText(`catalog.${line.slug}.summary`),
      lineText(`lines.${line.slug}.summary`),
    ),
    image: resolveProductCatalogImageSrc(
      line.image,
      productText(`catalog.${line.slug}.image`),
    ),
    gallery: line.gallery ?? [],
    mediaHrefs: line.mediaHrefs ?? [],
    titleStyle: cmsTypoStyleFromT("product", `catalog.${line.slug}.title`, productText),
    summaryStyle: cmsTypoStyleFromT("product", `catalog.${line.slug}.summary`, productText),
  }));

  return (
    <section id={PRODUCT_CATEGORY_PATHS[category]} className="scroll-mt-28">
      {heading ? (
        <h2 className="font-display text-2xl text-brand-ink">{heading}</h2>
      ) : null}
      <ProductCatalogCards
        items={items}
        labels={{
          doc: t("doc"),
          archiveLink: t("archiveLink"),
          viewDetail: t("viewDetail"),
          close: t("close"),
          relatedDocs: t("relatedDocs"),
        }}
      />
    </section>
  );
}

export async function ProductBeoneNote() {
  const locale = await getLocale();
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const tProduct = await getTranslations("product");
  const productText = tProduct as unknown as (key: string) => string;
  const override = (tProduct("beoneNote") as string | undefined)?.trim() ?? "";
  const text = override.length > 0 ? override : catalog.beoneNote[loc];
  return (
    <p
      className="max-w-3xl border-l-2 border-sage pl-5 text-sm leading-7 text-ink/70"
      style={cmsTypoStyleFromT("product", "beoneNote", productText)}
    >
      {text}
    </p>
  );
}

export { PRODUCT_BEONE_NOTE_PATH };
