import { getLocale, getTranslations } from "next-intl/server";
import { PostList } from "@/components/PostList";
import { ProductGalleryGrid } from "@/components/ProductGalleryGrid";
import { listPosts } from "@/lib/posts";
import { ensurePostSeed } from "@/lib/seed-posts";
import { getApprovedMember } from "@/lib/member-session";
import { resolveLocale } from "@/lib/locale";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  await ensurePostSeed();
  const t = await getTranslations("community");
  const locale = await getLocale();
  const member = await getApprovedMember();
  const items = await listPosts("gallery", Boolean(member));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("sections.gallery")}</h1>
      <p className="mt-3 text-brand-ink/65">{t("galleryLede")}</p>
      <ProductGalleryGrid locale={locale} />
      <div className="mt-14">
        <PostList items={items} locale={locale} basePath="/community/gallery" />
      </div>
    </div>
  );
}
