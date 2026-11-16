import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { CmsPageFooter } from "@/components/CmsPageFooter";
import { HOME_CONTENT_GUTTER, HOME_VIEWPORT_SHELL } from "@/lib/home-layout";
import {
  HOME_HERO_IMAGE_CLASS,
  heroImageUnoptimized,
  homeHeadlineFontSizeFluid,
  homeKickerFontSizeFluid,
  parseHomeScale,
  resolveHeroImageSrc,
  resolveHomeTextColorHex,
  HOME_KICKER_COLOR_DEFAULT,
  HOME_HEADLINE_COLOR_DEFAULT,
  HOME_KICKER_FONT_DEFAULT,
  HOME_HEADLINE_FONT_DEFAULT,
  resolveHomeFontFamily,
} from "@/lib/home-hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  const heroSrc = resolveHeroImageSrc(t("home.heroImage"));
  const kickerScale = parseHomeScale(t("home.kickerScale"));
  const headlineScale = parseHomeScale(t("home.headlineScale"));
  const kickerColor = resolveHomeTextColorHex(t("home.kickerColor"), HOME_KICKER_COLOR_DEFAULT);
  const headlineColor = resolveHomeTextColorHex(
    t("home.headlineColor"),
    HOME_HEADLINE_COLOR_DEFAULT,
  );
  const kickerFamily = resolveHomeFontFamily(t("home.kickerFont"), HOME_KICKER_FONT_DEFAULT);
  const headlineFamily = resolveHomeFontFamily(t("home.headlineFont"), HOME_HEADLINE_FONT_DEFAULT);

  return (
    <div className={HOME_VIEWPORT_SHELL}>
      <section className="relative isolate min-h-0 flex-1 overflow-hidden bg-brand-ink text-brand-ink">
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          className={HOME_HERO_IMAGE_CLASS}
          sizes="100vw"
          unoptimized={heroImageUnoptimized(heroSrc)}
        />

        <div className={`relative flex h-full min-h-0 flex-col py-4 sm:py-5 md:py-6 ${HOME_CONTENT_GUTTER}`}>
          <div className="flex min-h-0 flex-1 flex-col justify-center md:max-w-2xl">
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
              className="animate-[fadeUp_0.8s_ease_both] mt-2 max-w-xl whitespace-pre-line font-bold leading-[1.15] tracking-[-0.03em] sm:mt-3 md:mt-4"
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
                className="animate-[fadeUp_0.9s_ease_both] mt-[1lh] max-w-xl whitespace-pre-line text-base font-medium leading-7 tracking-[-0.01em]"
                style={{
                  color: headlineColor,
                  fontFamily: headlineFamily,
                  opacity: 0.88,
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