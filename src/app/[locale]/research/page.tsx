import { getLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { PatentMediaPreviewGrid, type PatentPreviewItem } from "@/components/PatentMediaPreviewGrid";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";
import { listPublishedMedia } from "@/lib/media-lib";
import type { MediaDoc } from "@/lib/db";
import { isMediaImageMime, mediaPreviewThumbSrc, mediaPublicHref } from "@/lib/media-public";
import { resolveLocale } from "@/lib/locale";
import { SectionTail } from "@/components/SectionTail";

export const dynamic = "force-dynamic";

function toPreviewItems(docs: MediaDoc[], loc: "ko" | "en" | "zh"): PatentPreviewItem[] {
  return docs.map((doc) => ({
    slug: doc.slug,
    title: doc.title[loc] ?? doc.title.ko,
    summary: doc.summary[loc] ?? doc.summary.ko,
    href: mediaPublicHref(doc),
    isImage: isMediaImageMime(doc),
    thumbSrc: mediaPreviewThumbSrc(doc),
  }));
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("researchPage");
  const locale = await getLocale();
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const research = await listPublishedMedia("research");
  const product = await listPublishedMedia("product");
  const gridLabels = {
    view: t("gridView"),
    close: t("gridClose"),
    openFile: t("gridOpenFile"),
    zoomPageFit: t("gridZoomPageFit"),
    zoomPageWidth: t("gridZoomPageWidth"),
    zoomActual: t("gridZoomActual"),
    zoomIn: t("gridZoomIn"),
    zoomOut: t("gridZoomOut"),
    prevPage: t("gridPrevPage"),
    nextPage: t("gridNextPage"),
    pageLabel: t("gridPageLabel"),
  };

  return (
    <div>
      <PageHero kicker={t("kicker")} title={t("title")} image={images.leaves} />
      <section className={`mx-auto w-full ${GUEST_CONTENT_MAX} space-y-12 px-guest-gutter py-14`}>
        {t("lede") ? (
          <p className="max-w-3xl text-sm leading-7 text-brand-ink/70">{t("lede")}</p>
        ) : null}
        <div>
          <h2 className="text-lg font-bold text-brand-ink">{t("researchHeading")}</h2>
          <div className="mt-4">
            <PatentMediaPreviewGrid
              items={toPreviewItems(research, loc)}
              labels={{ ...gridLabels, empty: t("gridResearchEmpty") }}
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-ink">{t("productHeading")}</h2>
          <div className="mt-4">
            <PatentMediaPreviewGrid
              items={toPreviewItems(product, loc)}
              labels={{ ...gridLabels, empty: t("gridProductEmpty") }}
            />
          </div>
        </div>
      </section>
      <SectionTail />
    </div>
  );
}