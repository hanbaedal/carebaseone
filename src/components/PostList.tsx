import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PostDoc } from "@/lib/db";

export async function PostList({
  items,
  locale,
  basePath,
}: {
  items: PostDoc[];
  locale: string;
  basePath: string;
}) {
  const t = await getTranslations("community");
  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{t("postsEmpty")}</p>;
  }
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.slug} className="py-4">
          <Link href={`${basePath}/${item.slug}`} className="block">
            <p className="font-medium text-brand-ink hover:text-brand">
              {item.pinned ? (
                <span className="mr-2 text-brand">{t("pinned")}</span>
              ) : null}
              {item.title[loc] ?? item.title.ko}
            </p>
            <p className="mt-1 text-xs text-brand-ink/45">
              {new Date(item.createdAt).toLocaleDateString(locale)}
              {item.eventAt
                ? ` · ${new Date(item.eventAt).toLocaleDateString(locale)}`
                : ""}
              {item.eventPlace ? ` · ${item.eventPlace}` : ""}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
