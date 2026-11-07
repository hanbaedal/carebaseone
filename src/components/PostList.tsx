import { Link } from "@/i18n/navigation";
import type { PostDoc } from "@/lib/db";

export function PostList({
  items,
  locale,
  basePath,
}: {
  items: PostDoc[];
  locale: string;
  basePath: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">게시글이 없습니다.</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.slug} className="py-4">
          <Link href={`${basePath}/${item.slug}`} className="block">
            <p className="font-medium text-brand-ink hover:text-brand">
              {item.pinned ? <span className="mr-2 text-brand">공지</span> : null}
              {item.title[locale as "ko"] ?? item.title.ko}
            </p>
            <p className="mt-1 text-xs text-brand-ink/45">
              {new Date(item.createdAt).toLocaleDateString("ko-KR")}
              {item.eventAt
                ? ` · ${new Date(item.eventAt).toLocaleDateString("ko-KR")}`
                : ""}
              {item.eventPlace ? ` · ${item.eventPlace}` : ""}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
