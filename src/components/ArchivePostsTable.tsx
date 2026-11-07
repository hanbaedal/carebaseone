import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PostDoc } from "@/lib/db";

export async function ArchivePostsTable({
  items,
  locale,
}: {
  items: PostDoc[];
  locale: string;
}) {
  const t = await getTranslations("community");
  if (items.length === 0) return null;
  const loc = locale === "en" || locale === "zh" ? locale : "ko";
  const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div className="mt-12">
      <h2 className="text-sm font-semibold text-brand-ink">{t("archivePosts")}</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-brand-ink/[0.03] text-[12px] font-semibold tracking-wide text-brand-ink/55">
              <th className="w-14 px-4 py-3">{t("archiveColNo")}</th>
              <th className="px-4 py-3">{t("archiveColTitle")}</th>
              <th className="hidden px-4 py-3 md:table-cell">{t("archiveColSummary")}</th>
              <th className="w-28 px-4 py-3">{t("archiveColAuthor")}</th>
              <th className="w-28 px-4 py-3">{t("archiveColDate")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const body = (item.body[loc] ?? item.body.ko) || "";
              const summary = body.length > 120 ? `${body.slice(0, 120)}…` : body || "—";
              return (
                <tr key={item.slug} className="border-b border-line/80 last:border-0 hover:bg-brand/[0.03]">
                  <td className="px-4 py-3 text-brand-ink/45 tabular-nums">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/community/notice/${item.slug}`} className="text-brand hover:underline">
                      {item.title[loc] ?? item.title.ko}
                    </Link>
                  </td>
                  <td className="hidden max-w-md px-4 py-3 text-brand-ink/65 md:table-cell">
                    <span className="line-clamp-2">{summary}</span>
                  </td>
                  <td className="px-4 py-3 text-brand-ink/70">{item.createdBy}</td>
                  <td className="px-4 py-3 text-brand-ink/55 whitespace-nowrap">
                    {dateFmt.format(new Date(item.createdAt))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
