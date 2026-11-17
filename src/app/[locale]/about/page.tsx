import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { SectionHubList } from "@/components/SectionHubList";
import { SectionTail } from "@/components/SectionTail";
import { ABOUT_HUB_BLOCKS } from "@/lib/section-hub";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("about");

  return (
    <div>
      <CmsSectionHero section="about" imageFallback={images.close} />
      <section className="mx-auto max-w-4xl px-guest-gutter pt-4">
        <p className="text-center text-sm text-brand-ink/60">{t("lede")}</p>
      </section>
      <SectionHubList blocks={ABOUT_HUB_BLOCKS} />
      <SectionTail />
    </div>
  );
}