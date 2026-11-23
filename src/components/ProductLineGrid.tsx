import { getLocale, getTranslations } from "next-intl/server";
import type { ProductLineCategory } from "@/lib/product-categories";
import { PRODUCT_CATEGORY_PATHS } from "@/lib/product-categories";
import {
  ProductCatalogCards,
  type ProductCatalogCard,
} from "@/components/ProductCatalogCards";
import catalog from "@/data/product-catalog.json";
import { listProductLineGalleryMedia } from "@/lib/media-lib";
import { galleryThumbSrc } from "@/lib/gallery-thumb-src";
import { cmsTypoStyleFromT } from "@/lib/cms-typography-styles";

export async function ProductLineGrid({
  category,
  heading,
}: {
  category: ProductLineCategory;
  heading: string;
}) {
  const docs = await listProductLineGalleryMedia(category);
  if (docs.length === 0) return null;

  const locale = await getLocale();
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const t = await getTranslations("productCatalog");

  const items: ProductCatalogCard[] = docs.map((doc) => {
    const catalogSlug = doc.tags?.find((tag) => tag.startsWith("catalog:"))?.slice("catalog:".length);
    const line = catalogSlug ? catalog.lines.find((l) => l.slug === catalogSlug) : undefined;
    return {
      slug: doc.slug,
      title: doc.title[loc] || doc.title.ko,
      summary: doc.summary[loc] || doc.summary.ko,
      image: galleryThumbSrc(doc),
      gallery: [],
      mediaHrefs: line?.mediaHrefs ?? [],
    };
  });

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

export const PRODUCT_BEONE_NOTE_PATH = "product.beoneNote";