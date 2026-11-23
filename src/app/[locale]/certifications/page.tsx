import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { PatentMediaPreviewGrid } from "@/components/PatentMediaPreviewGrid";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";
import { listPublishedMedia } from "@/lib/media-lib";
import { mediaToPreviewItem } from "@/lib/media-public";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

export const dynamic = "force-dynamic";

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("certifications");
  const locale = await getLocale();
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const items = await listPublishedMedia("certification");
  const gridItems = items.map((doc) => mediaToPreviewItem(doc, loc));

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} image={images.usa} />
      <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter py-14`}>
        {t("lede") ? (
          <p className="mb-8 max-w-3xl text-sm leading-7 text-brand-ink/70">{t("lede")}</p>
        ) : null}
        <PatentMediaPreviewGrid
          items={gridItems}
          labels={{
            empty: t("gridEmpty"),
            view: t("gridView"),
            close: t("gridClose"),
            openFile: t("gridOpenFile"),
            noPreview: t("gridNoPreview"),
            zoomPageFit: t("gridZoomPageFit"),
            zoomPageWidth: t("gridZoomPageWidth"),
            zoomActual: t("gridZoomActual"),
            zoomIn: t("gridZoomIn"),
            zoomOut: t("gridZoomOut"),
            prevPage: t("gridPrevPage"),
            nextPage: t("gridNextPage"),
            pageLabel: t("gridPageLabel"),
          }}
        />
      </section>
      <SectionTail />
    </div>
  );
}