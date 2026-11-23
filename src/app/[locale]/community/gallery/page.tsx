import { getTranslations } from "next-intl/server";
import { PublicMediaGalleryGrid } from "@/components/PublicMediaGalleryGrid";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");

  return (
    <div className="mx-auto max-w-5xl px-guest-gutter py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("sections.gallery")}</h1>
      <PublicMediaGalleryGrid />
      <SectionTail />
    </div>
  );
}
