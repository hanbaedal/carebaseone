import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const blocks = ["no", "metabolite", "research", "proof"] as const;

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("technology");

  return (
    <div>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lede={t("lede")}
        image={images.leaves}
      />
      <section className="mx-auto grid max-w-6xl gap-px bg-ink/10 px-0 py-0 md:grid-cols-2">
        {blocks.map((key) => (
          <article key={key} className="bg-cream px-8 py-14 md:px-12">
            <h2 className="font-display text-3xl">{t(`blocks.${key}.title`)}</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-ink/70">
              {t(`blocks.${key}.text`)}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
