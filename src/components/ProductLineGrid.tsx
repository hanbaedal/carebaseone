import { getLocale, getTranslations } from "next-intl/server";
import catalog from "@/data/product-catalog.json";
import {
  ProductCatalogCards,
  type ProductCatalogCard,
} from "@/components/ProductCatalogCards";

export async function ProductLineGrid({
  category,
  heading,
}: {
  category: "patch" | "cosmetics" | "beverage";
  heading: string;
}) {
  const t = await getTranslations("productCatalog");
  const lineText = t as unknown as (key: string) => string;
  const lines = catalog.lines.filter((l) => l.category === category);

  const items: ProductCatalogCard[] = lines.map((line) => ({
    slug: line.slug,
    title: lineText(`lines.${line.slug}.title`),
    summary: lineText(`lines.${line.slug}.summary`),
    image: line.image,
    gallery: line.gallery ?? [],
    mediaHrefs: line.mediaHrefs ?? [],
  }));

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-brand-ink">{heading}</h2>
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
  const text = catalog.beoneNote[loc];
  return (
    <p className="max-w-3xl border-l-2 border-sage pl-5 text-sm leading-7 text-ink/70">{text}</p>
  );
}
