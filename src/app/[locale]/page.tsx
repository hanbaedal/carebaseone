import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { CtaLink } from "@/components/CtaLink";
import { Link } from "@/i18n/navigation";
import { images } from "@/lib/site";

const pillars = [
  "technology",
  "product",
  "solution",
  "global",
  "business",
] as const;

const solutions = [
  { key: "vascular", image: images.vascular },
  { key: "sports", image: images.sports },
  { key: "senior", image: images.senior },
  { key: "beauty", image: images.beauty },
  { key: "wellness", image: images.wellness },
] as const;

const products = [
  { key: "patch", image: images.breakfast },
  { key: "beverage", image: images.drink },
  { key: "food", image: images.vein },
  { key: "cosmetics", image: images.beauty },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  return (
    <div>
      <section className="relative isolate min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-brand-ink text-brand-ink">
        <Image
          src={images.hero}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:from-white/80" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-7xl flex-col px-6 pt-16 pb-0 md:pt-24">
          <div className="flex flex-1 flex-col justify-center pb-16 md:max-w-2xl md:pb-24">
            <p className="animate-[fadeUp_0.7s_ease_both] text-[12px] font-semibold tracking-[0.22em] text-brand">
              {t("home.kicker")}
            </p>
            <h1 className="font-display animate-[fadeUp_0.8s_ease_both] mt-5 text-4xl leading-[1.2] text-brand-ink md:text-6xl">
              {t("home.headline")}
            </h1>
            <div className="animate-[fadeUp_1s_ease_both] mt-10 flex flex-wrap gap-3">
              <CtaLink href="/product">
                {t("cta.products")}
                <span aria-hidden="true">→</span>
              </CtaLink>
              <CtaLink href="/business" variant="ghost">
                {t("cta.partner")}
                <span aria-hidden="true">↗</span>
              </CtaLink>
            </div>
          </div>

          <div className="grid divide-y divide-line border-t border-line bg-white/95 backdrop-blur-sm md:grid-cols-5 md:divide-x md:divide-y-0">
            {pillars.map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="group px-5 py-5 transition-colors hover:bg-brand/5 md:py-6"
              >
                <p className="text-[11px] font-semibold tracking-[0.18em] text-brand">
                  {t(`home.pillars.${key}.num`)} {t(`home.pillars.${key}.title`)}
                </p>
                <p className="mt-2 text-[15px] font-semibold text-brand-ink group-hover:text-brand">
                  {t(`home.pillars.${key}.ko`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.22em] text-brand">01</p>
          <h2 className="font-display mt-3 text-3xl text-brand-ink md:text-5xl">
            {t("home.whyTitle")}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-brand-ink/70">
            {t("home.whyBody")}
          </p>
          <div className="mt-8">
            <CtaLink href="/technology" variant="light">
              {t("nav.technology")}
            </CtaLink>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image
            src={images.leaves}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-[12px] font-semibold tracking-[0.22em] text-brand">
          {t("home.forPeopleMark")}
        </p>
        <h2 className="font-display mt-3 text-3xl text-brand-ink md:text-4xl">
          {t("home.forPeople")}
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {solutions.map((item) => (
            <Link key={item.key} href="/solution" className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 20vw, 50vw"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-brand-ink">
                {t(`solution.items.${item.key}.title`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.22em] text-white/75">
              {t("home.inLifeMark")}
            </p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">{t("home.inLife")}</h2>
            <div className="mt-8 grid gap-4">
              {products.map((item) => (
                <p key={item.key} className="border-t border-white/20 pt-4 text-sm">
                  {t(`product.categories.${item.key}.title`)}
                  <span className="mt-1 block font-normal text-white/70">
                    {t(`product.categories.${item.key}.items`)}
                  </span>
                </p>
              ))}
            </div>
            <div className="mt-10">
              <CtaLink href="/product" variant="ghost">
                {t("nav.product")}
              </CtaLink>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
            <Image
              src={images.breakfast}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-[12px] font-semibold tracking-[0.22em] text-brand">
          {t("home.forPartnersMark")}
        </p>
        <h2 className="font-display mt-3 text-3xl text-brand-ink md:text-4xl">
          {t("home.forPartners")}
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {(
            [
              ["korea", images.korea],
              ["china", images.china],
              ["usa", images.usa],
            ] as const
          ).map(([key, image]) => (
            <Link key={key} href="/global" className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
              </div>
              <p className="mt-3 text-[13px] font-semibold tracking-[0.08em] text-brand-ink">
                {t(`global.nodes.${key}.title`)}
              </p>
              <p className="text-sm text-brand-ink/65">{t(`global.nodes.${key}.text`)}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink href="/global" variant="light">
            {t("nav.global")}
          </CtaLink>
          <CtaLink href="/business">{t("cta.partner")}</CtaLink>
        </div>
      </section>
    </div>
  );
}
