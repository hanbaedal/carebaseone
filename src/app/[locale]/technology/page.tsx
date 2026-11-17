import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { SectionHubList } from "@/components/SectionHubList";
import { SectionTail } from "@/components/SectionTail";
import { TECHNOLOGY_HUB_BLOCKS } from "@/lib/section-hub";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("technology");

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} lede={t("lede")} image={images.leaves} />
      <SectionHubList blocks={TECHNOLOGY_HUB_BLOCKS} />
      <SectionTail />
    </div>
  );
}