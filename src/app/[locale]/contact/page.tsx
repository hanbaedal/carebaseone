import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ as?: string }>;
}) {
  resolveLocale((await params).locale);
  const { as } = await searchParams;
  const t = await getTranslations("contact");

  return (
    <div>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lede={t("lede")}
        image={images.close}
      />
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-display text-3xl leading-snug">{t("lede")}</p>
        </div>
        <ContactForm preset={as === "partner" ? "partner" : "consumer"} />
      </section>
    </div>
  );
}
