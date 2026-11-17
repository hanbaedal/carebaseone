import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { images } from "@/lib/site";
import {
  heroImageUnoptimized,
  homeHeadlineFontSizeFluid,
  homeKickerFontSizeFluid,
  homeLedeFontSizeFluid,
  parseHomeScale,
  resolveHeroImageSrc,
  resolveHomeFontFamily,
  resolveHomeTextColorHex,
  defaultColorForTextPath,
  defaultFontForTextPath,
} from "@/lib/home-hero";

type HeroTextKey = "kicker" | "title" | "lede";

type CmsHeroSection =
  | "aboutGreeting"
  | "aboutFeatures"
  | "solution"
  | "global"
  | "business"
  | "product"
  | "contact";

export async function CmsSectionHero({
  section,
  imageFallback = images.hero,
  showLede = true,
}: {
  section: CmsHeroSection;
  imageFallback?: string;
  showLede?: boolean;
}) {
  const t = await getTranslations(section);

  const heroRaw = t("heroImage");
  const heroSrc = heroRaw?.trim() ? resolveHeroImageSrc(heroRaw) : imageFallback;

  function styleFor(key: HeroTextKey | "body") {
    const textPath = `${section}.${key}`;
    const scale = parseHomeScale(t(`${key}Scale`));
    const color = resolveHomeTextColorHex(t(`${key}Color`), defaultColorForTextPath(textPath));
    const family = resolveHomeFontFamily(t(`${key}Font`), defaultFontForTextPath(textPath));
    const fontSize =
      key === "kicker"
        ? homeKickerFontSizeFluid(scale)
        : key === "title"
          ? homeHeadlineFontSizeFluid(scale)
          : homeLedeFontSizeFluid(scale);
    return { fontSize, color, fontFamily: family };
  }

  const kicker = t("kicker");
  const title = t("title");
  const lede = showLede ? t("lede") : "";

  return (
    <section className="relative isolate min-h-[56vh] overflow-hidden bg-brand-ink text-white">
      <Image
        src={heroSrc}
        alt=""
        fill
        priority
        className="object-cover object-center opacity-55"
        sizes="100vw"
        unoptimized={heroImageUnoptimized(heroSrc)}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-brand-ink/45 to-transparent" />
      <div className="relative mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28">
        <p className="font-semibold tracking-[0.22em]" style={styleFor("kicker")}>
          {kicker}
        </p>
        <h1
          className="mt-4 max-w-3xl whitespace-pre-line font-display leading-tight"
          style={styleFor("title")}
        >
          {title}
        </h1>
        {showLede && lede.trim() ? (
          <p className="mt-6 max-w-2xl whitespace-pre-line leading-8" style={styleFor("lede")}>
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  );
}