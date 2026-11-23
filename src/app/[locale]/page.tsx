import { MediaAwareImage } from "@/components/MediaAwareImage";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { CmsPageFooter } from "@/components/CmsPageFooter";
import { GUEST_HERO_FRAME } from "@/lib/guest-layout";
import { HOME_CONTENT_GUTTER, HOME_VIEWPORT_SHELL } from "@/lib/home-layout";
import {
  HOME_HERO_IMAGE_CLASS,
  cmsMediaSlugFromValue,
  homeHeadlineFontSizeFluid,
  homeKickerFontSizeFluid,
  homeLedeFontSizeFluid,
  parseHomeScale,
  resolveHeroImageSrc,
  resolveHomeTextColorHex,
  HOME_KICKER_COLOR_DEFAULT,
  HOME_HEADLINE_COLOR_DEFAULT,
  HOME_LEDE_COLOR_DEFAULT,
  HOME_KICKER_FONT_DEFAULT,
  HOME_HEADLINE_FONT_DEFAULT,
  HOME_LEDE_FONT_DEFAULT,
  resolveHomeFontFamily,
} from "@/lib/home-hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  const heroImageRaw = t("home.heroImage");
  const heroSrc = resolveHeroImageSrc(heroImageRaw);
  const kickerScale = parseHomeScale(t("home.kickerScale"));
  const headlineScale = parseHomeScale(t("home.headlineScale"));
  const ledeScale = parseHomeScale(t("home.ledeScale"));
  const kickerColor = resolveHomeTextColorHex(t("home.kickerColor"), HOME_KICKER_COLOR_DEFAULT);
  const headlineColor = resolveHomeTextColorHex(
    t("home.headlineColor"),
    HOME_HEADLINE_COLOR_DEFAULT,
  );
  const ledeColor = resolveHomeTextColorHex(t("home.ledeColor"), HOME_LEDE_COLOR_DEFAULT);
  const kickerFamily = resolveHomeFontFamily(t("home.kickerFont"), HOME_KICKER_FONT_DEFAULT);
  const headlineFamily = resolveHomeFontFamily(t("home.headlineFont"), HOME_HEADLINE_FONT_DEFAULT);
  const ledeFamily = resolveHomeFontFamily(t("home.ledeFont"), HOME_LEDE_FONT_DEFAULT);
  return (
    <div className={`${HOME_VIEWPORT_SHELL} bg-paper`}>
      <section
        className={`${GUEST_HERO_FRAME} min-h-0 flex-1 bg-brand-ink text-brand-ink`}
      >
        <MediaAwareImage
          src={heroSrc}
          mediaSlug={cmsMediaSlugFromValue(heroImageRaw)}
          alt=""
          fill
          priority
          className={HOME_HERO_IMAGE_CLASS}
        />

        <div className={`relative flex h-full min-h-0 flex-col py-4 sm:py-5 md:py-6 ${HOME_CONTENT_GUTTER}`}>
          <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-0 md:max-w-4xl">
            <p
              className="animate-[fadeUp_0.7s_ease_both] font-semibold tracking-[0.18em] sm:tracking-[0.22em]"
              style={{
                fontSize: homeKickerFontSizeFluid(kickerScale),
                color: kickerColor,
                fontFamily: kickerFamily,
              }}
            >
              {t("home.kicker")}
            </p>
            <h1
              className="animate-[fadeUp_0.8s_ease_both] mt-2 w-full max-w-none whitespace-pre-line font-bold leading-[1.15] tracking-[-0.03em] sm:mt-3 md:mt-4"
              style={{
                fontSize: homeHeadlineFontSizeFluid(headlineScale),
                color: headlineColor,
                fontFamily: headlineFamily,
              }}
            >
              {t("home.headline")}
            </h1>
            {t("home.lede").trim() ? (
              <p
                className="animate-[fadeUp_0.9s_ease_both] mt-7 w-full max-w-none whitespace-pre-line font-normal leading-7 tracking-[-0.01em] sm:mt-8"
                style={{
                  fontSize: homeLedeFontSizeFluid(ledeScale),
                  color: ledeColor,
                  fontFamily: ledeFamily,
                }}
              >
                {t("home.lede")}
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <CmsPageFooter section="home" docked />
    </div>
  );
}