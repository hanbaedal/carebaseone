import { getLocale, getTranslations } from "next-intl/server";
import { CmsSectionHero } from "@/components/CmsSectionHero";
import { NoticePostsTable } from "@/components/NoticePostsTable";
import { listPosts } from "@/lib/posts";
import { ensurePostSeed } from "@/lib/seed-posts";
import { getApprovedMember } from "@/lib/member-session";
import { resolveLocale } from "@/lib/locale";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";
import { images } from "@/lib/site";
import { SectionTail } from "@/components/SectionTail";

export const dynamic = "force-dynamic";

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
    <div>
      <CmsSectionHero
        section="community"
        imageFallback={images.close}
        copy={{
          kicker: t("kicker"),
          title: t("sections.notice"),
          lede: t("noticeLede"),
        }}
      />
      <section className="bg-paper py-12 sm:py-16">
        <div className={`mx-auto w-full ${GUEST_CONTENT_MAX} px-guest-gutter`}>
          <NoticePostsTable items={items} locale={locale} />
        </div>
      </section>
      <SectionTail section="community" />
    </div>
  );
}