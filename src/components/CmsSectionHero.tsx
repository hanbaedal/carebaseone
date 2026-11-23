import { MediaAwareImage } from "@/components/MediaAwareImage";
import { getTranslations } from "next-intl/server";
import { images } from "@/lib/site";
import { GUEST_HERO_FRAME } from "@/lib/guest-layout";
import {
  cmsMediaSlugFromValue,
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
  | "about"
  | "aboutGreeting"
  | "aboutFeatures"
  | "solution"
  | "global"
  | "business"
  | "product"
  | "technology"
  | "community"
  | "contact";

export async function CmsSectionHero({
  section,
  imageFallback = images.hero,
  showLede = true,
  copy,
}: {
  section: CmsHeroSection;
  imageFallback?: string;
  showLede?: boolean;
  /** 하위 페이지(공지 등) — 커뮤니티 히어로 스타일 유지, 문구만 교체 */
  copy?: { kicker?: string; title?: string; lede?: string };
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

  const kicker = copy?.kicker ?? t("kicker");
  const title = copy?.title ?? t("title");
  const lede = showLede ? (copy?.lede ?? t("lede")) : "";

  return (
    <section className="bg-paper">
      <div className={`${GUEST_HERO_FRAME} min-h-[56vh] bg-brand-ink text-white`}>
        <MediaAwareImage
          src={heroSrc}
          mediaSlug={cmsMediaSlugFromValue(heroRaw)}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-brand-ink/45 to-transparent" />
        <div className="relative flex min-h-[56vh] w-full flex-col justify-end px-guest-gutter pb-16 pt-28">
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
            <p
              className="mt-6 max-w-4xl whitespace-pre-line text-left leading-8"
              style={styleFor("lede")}
            >
              {lede}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
