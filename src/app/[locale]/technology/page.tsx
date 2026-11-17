import { CmsSectionHero } from "@/components/CmsSectionHero";
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

  return (
    <div>
      <CmsSectionHero section="technology" imageFallback={images.leaves} />
      <SectionHubList blocks={TECHNOLOGY_HUB_BLOCKS} />
      <SectionTail section="technology" />
    </div>
  );
}