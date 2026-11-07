import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const highlights = ["mission", "platform", "network"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("about");

  return (
    <div>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lede={t("lede")}
        image={images.close}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        {highlights.map((key) => (
          <article key={key} className="rounded-3xl border border-line bg-white p-7">
            <h2 className="text-xl font-bold text-brand-ink">
              {t(`blocks.${key}.title`)}
            </h2>
            <p className="mt-4 text-sm leading-7 text-brand-ink/70">
              {t(`blocks.${key}.text`)}
            </p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src={images.lab}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl text-brand-ink md:text-4xl">
            {t("storyTitle")}
          </h2>
          <p className="mt-5 text-base leading-8 text-brand-ink/70">{t("storyBody")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="/technology">{t("ctaTechnology")}</CtaLink>
            <CtaLink href="/contact" variant="light">
              {t("ctaContact")}
            </CtaLink>
          </div>
        </div>
      </section>
    </div>
  );
}
