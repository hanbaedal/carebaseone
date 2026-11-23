import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { EcosystemDiagram } from "@/components/EcosystemDiagram";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";
import { heroImageUnoptimized } from "@/lib/home-hero";
import { resolveBusinessSideImageSrc } from "@/lib/business-media";

const nodeKeys = [
  "technology",
  "research",
  "product",
  "oem",
  "healthcare",
  "education",
  "distribution",
  "partner",
] as const;

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();
  const nodes = nodeKeys.map((key) => t(`business.nodes.${key}`));
  const sideImageSrc = resolveBusinessSideImageSrc(t("business.sideImage"));

  return (
    <div>
      <CmsSectionHero section="business" imageFallback={images.lab} />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-guest-gutter py-20 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <ul className="grid gap-2 text-sm tracking-[0.04em] text-ink/70">
            {nodeKeys.map((key) => (
              <li key={key} className="border-b border-ink/10 py-2">
                {t(`business.nodes.${key}`)}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <CtaLink href="/contact">{t("cta.inquire")}</CtaLink>
          </div>
        </div>
        {sideImageSrc ? (
          <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden">
            <Image
              src={sideImageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
              unoptimized={heroImageUnoptimized(sideImageSrc)}
            />
          </div>
        ) : (
          <EcosystemDiagram center={t("business.center")} nodes={nodes} />
        )}
      </section>
      <SectionTail section="business" />
    </div>
  );
}
