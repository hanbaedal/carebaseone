import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/lib/locale";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { images } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations();

  return (
    <div>
      <section className="relative isolate min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-brand-ink text-brand-ink">
        <Image
          src={images.hero}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:from-white/80" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-7xl flex-col px-6 pb-0 pt-10 md:pt-14">
          <div className="flex flex-1 flex-col justify-center md:max-w-2xl">
            <div>
              <p className="animate-[fadeUp_0.7s_ease_both] text-[12px] font-semibold tracking-[0.22em] text-brand">
                {t("home.kicker")}
              </p>
              <h1 className="font-display animate-[fadeUp_0.8s_ease_both] mt-5 text-4xl leading-[1.2] text-brand-ink md:text-6xl">
                {t("home.headline")}
              </h1>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-line bg-white/95 px-5 py-6 shadow-sm backdrop-blur-sm md:mb-8 md:px-8 md:py-7">
            <CompanyContactBlock />
          </div>
        </div>
      </section>
    </div>
  );
}
