import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { EcosystemDiagram } from "@/components/EcosystemDiagram";
import { CtaLink } from "@/components/CtaLink";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

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

  return (
    <div>
      <PageHero
        kicker={t("business.kicker")}
        title={t("business.title")}
        lede={t("business.lede")}
        image={images.lab}
      />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="max-w-lg text-base leading-8 text-ink/75">
            {t("business.invite")}
          </p>
          <ul className="mt-8 grid gap-2 text-sm tracking-[0.04em] text-ink/70">
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
        <EcosystemDiagram center={t("business.center")} nodes={nodes} />
      </section>
    </div>
  );
}
