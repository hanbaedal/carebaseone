import { getTranslations } from "next-intl/server";
import type { MediaDoc } from "@/lib/db";
import { formatKoreaDate } from "@/lib/korea-time";

function fileHref(item: MediaDoc) {
  return item.filePath.startsWith("/api/") ? item.filePath : `/api/media/${item.slug}`;
}

export async function MediaArchiveTable({
  items,
  locale,
  rowOffset = 0,
}: {
  items: MediaDoc[];
  locale: string;
  rowOffset?: number;
}) {
  const t = await getTranslations("community");
  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{t("mediaEmpty")}</p>;
  }
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-brand-ink/[0.03] text-[12px] font-semibold tracking-wide text-brand-ink/55">
            <th className="w-14 px-4 py-3">{t("archiveColNo")}</th>
            <th className="min-w-[12rem] px-4 py-3">{t("archiveColTitle")}</th>
            <th className="hidden px-4 py-3 md:table-cell">{t("archiveColSummary")}</th>
            <th className="w-28 px-4 py-3">{t("archiveColAuthor")}</th>
            <th className="w-28 px-4 py-3 whitespace-nowrap">{t("archiveColDate")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const title = item.title[loc] ?? item.title.ko;
            const summary = (item.summary[loc] ?? item.summary.ko) || "—";
            const rowNo = rowOffset + index + 1;
            return (
              <tr key={item.slug} className="border-b border-line/80 last:border-0 hover:bg-brand/[0.03]">
                <td className="px-4 py-3 text-brand-ink/45 tabular-nums">{rowNo}</td>
                <td className="px-4 py-3 font-medium text-brand-ink">
                  <a
                    href={fileHref(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline underline-offset-2"
                  >
                    {title}
                  </a>
                </td>
                <td className="hidden max-w-md px-4 py-3 text-brand-ink/65 md:table-cell">
                  <span className="line-clamp-2">{summary}</span>
                </td>
                <td className="px-4 py-3 text-brand-ink/70">{item.createdBy ?? "CAREBASE"}</td>
                <td className="px-4 py-3 text-brand-ink/55 whitespace-nowrap">
                  {formatKoreaDate(item.createdAt, locale)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
