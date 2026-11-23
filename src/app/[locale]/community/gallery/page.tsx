import { getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { PublicMediaGalleryGrid } from "@/components/PublicMediaGalleryGrid";
import { resolveLocale } from "@/lib/locale";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";
import { SectionTail } from "@/components/SectionTail";

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");

  return (
    <div>
      <CmsSectionHero
        section="community"
        imageFallback={images.beauty}
        copy={{
          kicker: t("kicker"),
          title: t("sections.gallery"),
          lede: t("galleryLede"),
        }}
      />
      <section className="bg-paper py-12 sm:py-16">
        <div className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter`}>
          <PublicMediaGalleryGrid />
        </div>
      </section>
      <SectionTail section="community" />
    </div>
  );
}