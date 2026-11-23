import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { FeatureQuadGrid } from "@/components/FeatureQuadGrid";
import { images } from "@/lib/site";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { cmsTypoStyleFromT } from "@/lib/cms-typography-styles";
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
  const tr = t as unknown as (key: string) => string;
  const items = featureKeys.map((key) => ({
    key,
    title: t(`items.${key}.title`),
    text: t(`items.${key}.text`),
  }));

  return (
    <div>
      <CmsSectionHero section="aboutFeatures" imageFallback={images.lab} />
      <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-16`}>
        <p
          className="max-w-4xl text-left text-base leading-8 text-brand-ink/70"
          style={cmsTypoStyleFromT("aboutFeatures", "lede", tr)}
        >
          {t("lede")}
        </p>
        <div className="mt-12">
          <FeatureQuadGrid
            items={items}
            renderContent={(item) => (
              <>
                <h2
                  className="text-[1.08rem] font-bold leading-snug tracking-tight text-[#1a3a6e] sm:text-lg md:text-xl"
                  style={cmsTypoStyleFromT("aboutFeatures", `items.${item.key}.title`, tr)}
                >
                  {item.title}
                </h2>
                <p
                  className="text-[13px] leading-7 text-[#1a3a6e]/85 sm:text-sm sm:leading-7"
                  style={cmsTypoStyleFromT("aboutFeatures", `items.${item.key}.text`, tr)}
                >
                  {item.text}
                </p>
              </>
            )}
          />
        </div>
      </section>
      <SectionTail section="aboutFeatures" />
    </div>
  );
}
