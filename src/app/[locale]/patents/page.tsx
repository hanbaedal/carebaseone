import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { MediaList } from "@/components/MediaList";
import { images } from "@/lib/site";
import { listPublishedMedia } from "@/lib/media-lib";
import { resolveLocale } from "@/lib/locale";

export default async function PatentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("patents");
  const locale = await getLocale();
  const items = await listPublishedMedia("patent");

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} image={images.lab} />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <MediaList items={items} locale={locale} />
      </section>
    </div>
  );
}
