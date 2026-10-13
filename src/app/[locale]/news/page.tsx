import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const items = ["research", "symposium", "expansion"] as const;

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("news");

  return (
    <div>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lede={t("lede")}
        image={images.lab}
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {items.map((key) => (
            <article key={key} className="border-t border-ink/15 pt-6">
              <p className="text-[11px] tracking-[0.22em] text-sage">
                {t(`items.${key}.tag`)}
              </p>
              <h2 className="font-display mt-3 text-2xl leading-snug">
                {t(`items.${key}.title`)}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink/70">
                {t(`items.${key}.text`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
