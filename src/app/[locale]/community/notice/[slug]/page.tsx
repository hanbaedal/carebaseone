import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { findPostBySlug } from "@/lib/posts";
import { resolveLocale } from "@/lib/locale";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: paramLocale, slug } = await params;
  resolveLocale(paramLocale);
  const locale = await getLocale();
  const post = await findPostBySlug(slug);
  if (!post || post.type !== "notice") notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-brand-ink">
        {post.title[locale as "ko"] ?? post.title.ko}
      </h1>
      <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-brand-ink/75">
        {post.body[locale as "ko"] ?? post.body.ko}
      </p>
    </article>
  );
}
