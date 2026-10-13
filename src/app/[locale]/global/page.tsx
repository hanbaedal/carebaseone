import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

const nodes = [
  { key: "korea", image: images.korea },
  { key: "china", image: images.china },
  { key: "usa", image: images.usa },
  { key: "future", image: images.close },
] as const;

export default async function GlobalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  return (
    <div>
      <PageHero
        kicker={t("global.kicker")}
        title={t("global.title")}
        lede={t("global.lede")}
        image={images.close}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
        {nodes.map((node) => (
          <article key={node.key}>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={node.image}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <h2 className="font-display mt-5 text-3xl">
              {t(`global.nodes.${node.key}.title`)}
            </h2>
            <p className="mt-2 text-ink/70">{t(`global.nodes.${node.key}.text`)}</p>
          </article>
        ))}
      </section>
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <CtaLink href="/business">{t("cta.partner")}</CtaLink>
        </div>
      </section>
    </div>
  );
}
