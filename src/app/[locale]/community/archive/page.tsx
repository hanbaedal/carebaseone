import { getLocale, getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { MediaArchiveTable } from "@/components/MediaArchiveTable";
import { ArchivePostsTable } from "@/components/ArchivePostsTable";
import {
  ArchivePagination,
  archivePageSize,
  resolveArchivePage,
} from "@/components/ArchivePagination";
import { listArchiveMedia } from "@/lib/media-lib";
import { listPosts } from "@/lib/posts";
import { getApprovedMember } from "@/lib/member-session";
import { resolveLocale } from "@/lib/locale";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";
import { SectionTail } from "@/components/SectionTail";

export const dynamic = "force-dynamic";

export default async function ArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");
  const locale = await getLocale();
  const member = await getApprovedMember();
  const memberOk = Boolean(member);
  const query = await searchParams;
  const requestedPage = Number.parseInt(query.page ?? "1", 10);

  const [items, posts] = await Promise.all([
    listArchiveMedia(memberOk),
    listPosts("archive", memberOk),
  ]);

  const { page, totalPages, start } = resolveArchivePage(
    Number.isFinite(requestedPage) ? requestedPage : 1,
    items.length,
  );
  const pageItems = items.slice(start, start + archivePageSize());

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
        <div className={`mx-auto w-full ${GUEST_CONTENT_MAX} max-w-6xl px-guest-gutter`}>
          <MediaArchiveTable items={pageItems} locale={locale} rowOffset={start} />
          <ArchivePagination page={page} totalPages={totalPages} basePath="/community/archive" />
          <ArchivePostsTable items={posts} locale={locale} />
        </div>
      </section>
      <SectionTail section="community" />
    </div>
  );
}