import { getLocale, getTranslations } from "next-intl/server";
import { PostList } from "@/components/PostList";
import { listPosts } from "@/lib/posts";
import { ensurePostSeed } from "@/lib/seed-posts";
import { getApprovedMember } from "@/lib/member-session";
import { resolveLocale } from "@/lib/locale";

export default async function NoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  await ensurePostSeed();
  const t = await getTranslations("community");
  const locale = await getLocale();
  const member = await getApprovedMember();
  const items = await listPosts("notice", Boolean(member));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("sections.notice")}</h1>
      <p className="mt-3 text-brand-ink/65">{t("noticeLede")}</p>
      <div className="mt-10">
        <PostList items={items} locale={locale} basePath="/community/notice" />
      </div>
    </div>
  );
}
