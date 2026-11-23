import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";
import { heroImageUnoptimized } from "@/lib/home-hero";
import {
  SOLUTION_ITEM_KEYS,
  resolveSolutionItemImageSrc,
} from "@/lib/solution-items";

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  return (
    <div>
      <CmsSectionHero section="solution" imageFallback={images.wellness} />
      <section className="mx-auto max-w-6xl px-guest-gutter py-20">
        <div className="grid gap-16">
          {SOLUTION_ITEM_KEYS.map((key, index) => {
            const imageSrc = resolveSolutionItemImageSrc(key, t(`solution.items.${key}.image`));
            return (
              <article
                key={key}
                className="grid items-center gap-10 md:grid-cols-2"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${
                    index % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    unoptimized={heroImageUnoptimized(imageSrc)}
                  />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.28em] text-sage">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-display mt-3 text-4xl">
                    {t(`solution.items.${key}.title`)}
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-8 text-ink/70">
                    {t(`solution.items.${key}.text`)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-16">
          <CtaLink href="/product" variant="light">
            {t("nav.product")}
          </CtaLink>
        </div>
      </section>
      <SectionTail section="solution" />
    </div>
  );
}
