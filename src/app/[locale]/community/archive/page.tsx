import { getLocale, getTranslations } from "next-intl/server";
import { MediaList } from "@/components/MediaList";
import { listArchiveMedia } from "@/lib/media-lib";
import { PostList } from "@/components/PostList";
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
  const items = await listArchiveMedia(memberOk);
  const posts = await listPosts("archive", memberOk);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("sections.archive")}</h1>
      <p className="mt-3 text-brand-ink/65">{t("archiveLede")}</p>
      {posts.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-brand-ink">{t("archivePosts")}</h2>
          <PostList items={posts} locale={locale} basePath="/community/notice" />
        </div>
      ) : null}
      <div className={posts.length > 0 ? "mt-12" : "mt-10"}>
        <MediaList items={items} locale={locale} />
      </div>
    </div>
  );
}
