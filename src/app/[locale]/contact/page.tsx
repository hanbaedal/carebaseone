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
      <PageHero kicker={t("kicker")} title={t("title")} image={images.close} />
      <section className="mx-auto max-w-xl px-6 py-20">
        <ContactForm preset={as === "partner" ? "partner" : "consumer"} />
      </section>
    </div>
  );
}
