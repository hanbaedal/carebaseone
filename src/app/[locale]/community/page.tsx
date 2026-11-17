import { CmsSectionHero } from "@/components/CmsSectionHero";
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

  return (
    <div>
      <CmsSectionHero section="community" imageFallback={images.close} />
      <SectionHubList blocks={COMMUNITY_HUB_BLOCKS} />
      <SectionTail section="community" />
    </div>
  );
}