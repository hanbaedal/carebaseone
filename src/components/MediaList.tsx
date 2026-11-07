import { getTranslations } from "next-intl/server";
import type { MediaDoc } from "@/lib/db";

export async function MediaList({
  items,
  locale,
}: {
  items: MediaDoc[];
  locale: string;
}) {
  const t = await getTranslations("community");
  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{t("mediaEmpty")}</p>;
  }
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.slug} className="py-4">
          <a
            href={item.filePath.startsWith("/api/") ? item.filePath : `/api/media/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-brand-ink group-hover:text-brand">
              {item.title[loc] ?? item.title.ko}
            </span>
            <span className="text-xs text-brand-ink/50">{item.fileName}</span>
          </a>
          {(item.summary[loc] ?? item.summary.ko) ? (
            <p className="mt-2 text-sm text-brand-ink/65">
              {item.summary[loc] ?? item.summary.ko}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
