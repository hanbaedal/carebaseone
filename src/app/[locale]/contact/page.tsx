import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { ContactForm } from "@/components/ContactForm";
import { images } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

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
      <CmsSectionHero section="contact" imageFallback={images.close} />
      <section className="mx-auto max-w-xl px-6 py-20">
        <ContactForm preset={as === "partner" ? "partner" : "consumer"} />
      </section>
      <SectionTail section="contact" />
    </div>
  );
}
