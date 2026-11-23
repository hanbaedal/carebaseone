import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { FeatureQuadGrid } from "@/components/FeatureQuadGrid";
import { images } from "@/lib/site";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

const featureKeys = ["tech", "product", "global", "trust"] as const;

export default async function AboutFeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("aboutFeatures");
  const items = featureKeys.map((key) => ({
    key,
    title: t(`items.${key}.title`),
    text: t(`items.${key}.text`),
  }));

  return (
    <div>
      <CmsSectionHero
        section="aboutFeatures"
        imageFallback={images.lab}
        ledeAlign="center"
      />
      <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
        <p className="mx-auto max-w-4xl text-center text-base leading-8 text-brand-ink/70">
          {t("lede")}
        </p>
        <div className="mt-12">
          <FeatureQuadGrid items={items} />
        </div>
      </section>
      <SectionTail section="aboutFeatures" />
    </div>
  );
}
