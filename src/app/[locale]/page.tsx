import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import {
  HOME_HERO_IMAGE_CLASS,
  heroImageUnoptimized,
  parseHomeScale,
  resolveHeroImageSrc,
  resolveHomeTextColorHex,
  HOME_KICKER_COLOR_DEFAULT,
  HOME_HEADLINE_COLOR_DEFAULT,
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

  return (
    <div>
      <section className="relative isolate min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-brand-ink text-brand-ink">
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          className={HOME_HERO_IMAGE_CLASS}
          sizes="100vw"
          unoptimized={heroImageUnoptimized(heroSrc)}
        />

        <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-7xl flex-col px-6 pb-0 pt-10 md:pt-14">
          <div className="flex flex-1 flex-col justify-center md:max-w-2xl">
            <p
              className="animate-[fadeUp_0.7s_ease_both] text-[12px] font-semibold tracking-[0.22em]"
              style={{ fontSize: `${(12 * kickerScale) / 100}px`, color: kickerColor }}
            >
              {t("home.kicker")}
            </p>
            <h1
              className="font-display animate-[fadeUp_0.8s_ease_both] mt-5 whitespace-pre-line text-4xl leading-[1.2] md:text-6xl"
              style={{
                fontSize: `clamp(${(1.75 * headlineScale) / 100}rem, 5vw, ${(3.75 * headlineScale) / 100}rem)`,
                color: headlineColor,
              }}
            >
              {t("home.headline")}
            </h1>
          </div>

          <div className="mb-6 rounded-2xl border border-line bg-white/95 px-5 py-6 shadow-sm backdrop-blur-sm md:mb-8 md:px-8 md:py-7">
            <CompanyContactBlock />
          </div>
        </div>
      </section>
    </div>
  );
}