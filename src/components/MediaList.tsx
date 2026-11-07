import type { MediaDoc } from "@/lib/db";

export function MediaList({
  items,
  locale,
}: {
  items: MediaDoc[];
  locale: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">등록된 자료가 없습니다.</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.slug} className="py-4">
          <a
            href={item.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-brand-ink group-hover:text-brand">
              {item.title[locale as "ko"] ?? item.title.ko}
            </span>
            <span className="text-xs text-brand-ink/50">{item.fileName}</span>
          </a>
          {(item.summary[locale as "ko"] ?? item.summary.ko) ? (
            <p className="mt-2 text-sm text-brand-ink/65">
              {item.summary[locale as "ko"] ?? item.summary.ko}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
