import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { MediaList } from "@/components/MediaList";
import { images } from "@/lib/site";
import { listPublishedMedia } from "@/lib/media-lib";
import { resolveLocale } from "@/lib/locale";

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("certifications");
  const locale = await getLocale();
  const items = await listPublishedMedia("certification");

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} lede={t("lede")} image={images.usa} />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <MediaList items={items} locale={locale} />
      </section>
    </div>
  );
}
