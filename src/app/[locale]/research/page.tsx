import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { MediaList } from "@/components/MediaList";
import { images } from "@/lib/site";
import { listPublishedMedia } from "@/lib/media-lib";
import { resolveLocale } from "@/lib/locale";

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("researchPage");
  const locale = await getLocale();
  const research = await listPublishedMedia("research");
  const product = await listPublishedMedia("product");

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} image={images.leaves} />
      <section className="mx-auto max-w-5xl space-y-12 px-6 py-14">
        <div>
          <h2 className="text-lg font-bold text-brand-ink">{t("researchHeading")}</h2>
          <div className="mt-4">
            <MediaList items={research} locale={locale} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-ink">{t("productHeading")}</h2>
          <div className="mt-4">
            <MediaList items={product} locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}
