import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  GLOBAL_NODE_KEYS,
  resolveGlobalNodeImageSrc,
} from "@/lib/global-nodes";

export default async function GlobalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  return (
    <div>
      <CmsSectionHero section="global" imageFallback={images.close} />
      <section className="mx-auto grid max-w-6xl gap-10 px-guest-gutter py-20 md:grid-cols-2">
        {GLOBAL_NODE_KEYS.map((key) => {
          const imageSrc = resolveGlobalNodeImageSrc(key, t(`global.nodes.${key}.image`));
          return (
            <article key={key}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized={heroImageUnoptimized(imageSrc)}
                />
              </div>
              <h2 className="font-display mt-5 text-3xl">
                {t(`global.nodes.${key}.title`)}
              </h2>
              <p className="mt-2 text-ink/70">{t(`global.nodes.${key}.text`)}</p>
            </article>
          );
        })}
      </section>
      <section className="px-guest-gutter pb-20">
        <div className="mx-auto max-w-6xl">
          <CtaLink href="/business">{t("cta.partner")}</CtaLink>
        </div>
      </section>
      <SectionTail section="global" />
    </div>
  );
}
