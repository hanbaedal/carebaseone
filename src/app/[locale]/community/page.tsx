import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { SectionHubList } from "@/components/SectionHubList";
import { SectionTail } from "@/components/SectionTail";
import { COMMUNITY_HUB_BLOCKS } from "@/lib/section-hub";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");

  return (
    <div>
      <PageHero kicker={t("title")} title={t("title")} lede={t("lede")} image={images.close} />
      <SectionHubList blocks={COMMUNITY_HUB_BLOCKS} />
      <SectionTail />
    </div>
  );
}