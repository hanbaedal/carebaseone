import { getLocale, getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { PatentMediaPreviewGrid } from "@/components/PatentMediaPreviewGrid";
import { ArchivePostsTable } from "@/components/ArchivePostsTable";
import { listArchiveMedia } from "@/lib/media-lib";
import { mediaToPreviewItem } from "@/lib/media-public";
import { listPosts } from "@/lib/posts";
import type { MediaCategory } from "@/lib/db";
import { getApprovedMember } from "@/lib/member-session";
import { resolveLocale } from "@/lib/locale";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";
import { SectionTail } from "@/components/SectionTail";

export const dynamic = "force-dynamic";

const ARCHIVE_SECTIONS: {
  category: MediaCategory;
  headingKey:
    | "archiveCertHeading"
    | "archiveResearchHeading"
    | "archiveProductHeading"
    | "archiveOtherHeading";
  emptyKey:
    | "archiveCertEmpty"
    | "archiveResearchEmpty"
    | "archiveProductEmpty"
    | "archiveOtherEmpty";
}[] = [
  { category: "certification", headingKey: "archiveCertHeading", emptyKey: "archiveCertEmpty" },
  { category: "research", headingKey: "archiveResearchHeading", emptyKey: "archiveResearchEmpty" },
  { category: "product", headingKey: "archiveProductHeading", emptyKey: "archiveProductEmpty" },
  { category: "other", headingKey: "archiveOtherHeading", emptyKey: "archiveOtherEmpty" },
];

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");
  const locale = await getLocale();
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const member = await getApprovedMember();
  const memberOk = Boolean(member);

  const [items, posts] = await Promise.all([listArchiveMedia(memberOk), listPosts("archive", memberOk)]);

  const gridLabels = {
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
  };

  return (
    <div>
      <CmsSectionHero
        section="community"
        imageFallback={images.lab}
        copy={{
          kicker: t("kicker"),
          title: t("sections.archive"),
          lede: t("archiveLede"),
        }}
      />
      <section className="bg-paper py-12 sm:py-16">
        <div className={`mx-auto w-full ${GUEST_CONTENT_MAX} space-y-12 px-guest-gutter`}>
          {t("archiveSectionLede") ? (
            <p className="max-w-3xl text-sm leading-7 text-brand-ink/70">{t("archiveSectionLede")}</p>
          ) : null}
          {ARCHIVE_SECTIONS.map(({ category, headingKey, emptyKey }) => {
            const sectionItems = items.filter((doc) => doc.category === category);
            return (
              <div key={category}>
                <h2 className="text-lg font-bold text-brand-ink">{t(headingKey)}</h2>
                <div className="mt-4">
                  <PatentMediaPreviewGrid
                    items={sectionItems.map((doc) => mediaToPreviewItem(doc, loc))}
                    labels={{ ...gridLabels, empty: t(emptyKey) }}
                  />
                </div>
              </div>
            );
          })}
          {posts.length > 0 ? <ArchivePostsTable items={posts} locale={locale} /> : null}
        </div>
      </section>
      <SectionTail section="community" />
    </div>
  );
}