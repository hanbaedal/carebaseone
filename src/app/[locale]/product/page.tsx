import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const categories = [
  { key: "patch", image: images.breakfast },
  { key: "beverage", image: images.drink },
  { key: "food", image: images.vein },
  { key: "cosmetics", image: images.beauty },
] as const;

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
        lede={t("product.lede")}
        image={images.breakfast}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="max-w-2xl border-l-2 border-sage pl-5 text-sm leading-7 text-ink/70">
          {t("product.note")}
        </p>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {categories.map((item) => (
            <article key={item.key}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <p className="mt-5 text-[11px] tracking-[0.22em] text-sage">
                {t(`product.categories.${item.key}.title`)}
              </p>
              <h2 className="font-display mt-2 text-3xl">
                {t(`product.categories.${item.key}.text`)}
              </h2>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                {t(`product.categories.${item.key}.items`)}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-14">
          <CtaLink href="/contact">{t("cta.inquire")}</CtaLink>
        </div>
      </section>
    </div>
  );
}
