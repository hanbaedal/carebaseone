import { getLocale, getTranslations } from "next-intl/server";
import { MediaArchiveTable } from "@/components/MediaArchiveTable";
import { ArchivePostsTable } from "@/components/ArchivePostsTable";
import { listArchiveMedia } from "@/lib/media-lib";
import { listPosts } from "@/lib/posts";
import { getApprovedMember } from "@/lib/member-session";
import { resolveLocale } from "@/lib/locale";

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");
  const locale = await getLocale();
  const member = await getApprovedMember();
  const memberOk = Boolean(member);
  const [items, posts] = await Promise.all([
    listArchiveMedia(memberOk),
    listPosts("archive", memberOk),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("sections.archive")}</h1>
      <p className="mt-3 text-brand-ink/65">{t("archiveLede")}</p>
      <div className="mt-10">
        <MediaArchiveTable items={items} locale={locale} />
      </div>
      <ArchivePostsTable items={posts} locale={locale} />
    </div>
  );
}
