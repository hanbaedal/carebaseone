import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import {
  homeLedeFontSizeFluid,
  parseHomeScale,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
  defaultColorForTextPath,
  defaultFontForTextPath,
} from "@/lib/home-hero";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

export default async function AboutGreetingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("aboutGreeting");

  const bodyPath = "aboutGreeting.body";
  const bodyStyle = {
    fontSize: homeLedeFontSizeFluid(parseHomeScale(t("bodyScale"))),
    color: resolveHomeTextColorHex(t("bodyColor"), defaultColorForTextPath(bodyPath)),
    fontFamily: resolveHomeFontFamily(t("bodyFont"), defaultFontForTextPath(bodyPath)),
  };

  return (
    <div>
      <CmsSectionHero section="aboutGreeting" imageFallback={images.close} showLede={false} />
      <section className="mx-auto max-w-3xl px-guest-gutter py-16">
        <p className="whitespace-pre-line leading-8" style={bodyStyle}>
          {t("body")}
        </p>
        <p className="mt-10 text-sm font-medium text-brand-ink">{t("sign")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink href="/about/features">{t("ctaFeatures")}</CtaLink>
          <CtaLink href="/contact" variant="light">
            {t("ctaContact")}
          </CtaLink>
        </div>
      </section>
      <SectionTail section="aboutGreeting" />
    </div>
  );
}
