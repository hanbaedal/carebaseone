import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { MediaList } from "@/components/MediaList";
import { images } from "@/lib/site";
import { listPublishedMedia } from "@/lib/media-lib";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

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
      <section className="mx-auto max-w-5xl px-guest-gutter py-14">
        <MediaList items={items} locale={locale} />
      </section>
      <SectionTail />
    </div>
  );
}
