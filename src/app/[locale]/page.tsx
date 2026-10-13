import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { CtaLink } from "@/components/CtaLink";
import { Link } from "@/i18n/navigation";
import { images } from "@/lib/site";

const pillars = [
  "technology",
  "solution",
  "product",
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
      <section className="relative isolate min-h-screen overflow-hidden bg-navy text-cream">
        <Image
          src={images.hero}
          alt=""
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/45" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-32">
          <p className="text-[11px] tracking-[0.28em] text-cream/75">
            {t("home.kicker")}
          </p>
          <h1 className="font-display mt-6 max-w-4xl text-4xl leading-[1.15] md:text-7xl">
            {t("home.headline")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-cream/85">
            {t("home.lede")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <CtaLink href="/solution">{t("cta.solutions")}</CtaLink>
            <CtaLink href="/business" variant="ghost">
              {t("cta.partner")}
            </CtaLink>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-sage">01</p>
          <h2 className="font-display mt-3 text-4xl md:text-5xl">
            {t("home.whyTitle")}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-ink/75">
            {t("home.whyBody")}
          </p>
          <div className="mt-8">
            <CtaLink href="/technology" variant="light">
              {t("nav.technology")}
            </CtaLink>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={images.leaves}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-sand/40 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl">
            {t("home.pillarsTitle")}
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-5">
            {pillars.map((key) => (
              <Link key={key} href={`/${key}`} className="group">
                <p className="text-[11px] tracking-[0.2em] text-sage">
                  {t(`home.pillars.${key}.num`)}
                </p>
                <p className="mt-2 text-[12px] tracking-[0.16em]">
                  {t(`home.pillars.${key}.title`)}
                </p>
                <p className="font-display mt-3 text-2xl leading-snug group-hover:text-forest">
                  {t(`home.pillars.${key}.ko`)}
                </p>
                <p className="mt-3 text-sm leading-6 text-ink/65">
                  {t(`home.pillars.${key}.text`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-[11px] tracking-[0.28em] text-sage">{t("home.forPeopleMark")}</p>
        <h2 className="font-display mt-3 text-4xl">{t("home.forPeople")}</h2>
        <p className="mt-4 max-w-xl text-ink/70">{t("home.forPeopleLede")}</p>
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {solutions.map((item) => (
            <Link key={item.key} href="/solution" className="group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 20vw, 50vw"
                />
              </div>
              <p className="mt-3 text-sm">{t(`solution.items.${item.key}.title`)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-sage">{t("home.inLifeMark")}</p>
            <h2 className="font-display mt-3 text-4xl">{t("home.inLife")}</h2>
            <p className="mt-4 text-cream/75">{t("home.inLifeLede")}</p>
            <div className="mt-8 grid gap-4">
              {products.map((item) => (
                <p key={item.key} className="border-t border-cream/15 pt-4 text-sm tracking-[0.08em]">
                  {t(`product.categories.${item.key}.title`)}
                  <span className="mt-1 block font-normal tracking-normal text-cream/65">
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
          <div className="relative min-h-[420px] overflow-hidden">
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

      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-[11px] tracking-[0.28em] text-sage">{t("home.forPartnersMark")}</p>
        <h2 className="font-display mt-3 text-4xl">{t("home.forPartners")}</h2>
        <p className="mt-4 max-w-xl text-ink/70">{t("home.forPartnersLede")}</p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {(
            [
              ["korea", images.korea],
              ["china", images.china],
              ["usa", images.usa],
            ] as const
          ).map(([key, image]) => (
            <Link key={key} href="/global" className="group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
              </div>
              <p className="mt-3 text-[12px] tracking-[0.16em]">
                {t(`global.nodes.${key}.title`)}
              </p>
              <p className="text-sm text-ink/65">{t(`global.nodes.${key}.text`)}</p>
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
