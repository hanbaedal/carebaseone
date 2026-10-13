import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const items = [
  { key: "vascular", image: images.vascular },
  { key: "sports", image: images.sports },
  { key: "senior", image: images.senior },
  { key: "beauty", image: images.beauty },
  { key: "wellness", image: images.wellness },
] as const;

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  return (
    <div>
      <PageHero
        kicker={t("solution.kicker")}
        title={t("solution.title")}
        lede={t("solution.lede")}
        image={images.wellness}
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-16">
          {items.map((item, index) => (
            <article
              key={item.key}
              className="grid items-center gap-10 md:grid-cols-2"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div>
                <p className="text-[11px] tracking-[0.28em] text-sage">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display mt-3 text-4xl">
                  {t(`solution.items.${item.key}.title`)}
                </h2>
                <p className="mt-5 max-w-md text-base leading-8 text-ink/70">
                  {t(`solution.items.${item.key}.text`)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-16">
          <CtaLink href="/product" variant="light">
            {t("nav.product")}
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
