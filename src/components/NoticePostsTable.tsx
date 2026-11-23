import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PostDoc } from "@/lib/db";
import { formatKoreaDate } from "@/lib/korea-time";

function noticeExcerpt(body: string, max = 140) {
  const flat = body.replace(/\s+/g, " ").trim();
  if (!flat) return "—";
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export async function NoticePostsTable({
  items,
  locale,
}: {
  items: PostDoc[];
  locale: string;
}) {
  const t = await getTranslations("community");
  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{t("postsEmpty")}</p>;
  }
  const loc = locale === "en" || locale === "zh" ? locale : "ko";

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_40px_-18px_rgba(37,50,38,0.18)]">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-[#e8f2f8] text-[12px] font-semibold tracking-wide text-brand-ink/65">
            <th className="w-[4.5rem] px-4 py-3.5 text-center sm:w-20">{t("noticeColNo")}</th>
            <th className="px-4 py-3.5">{t("noticeColTitleContent")}</th>
            <th className="w-28 px-4 py-3.5 text-right sm:w-32">{t("noticeColDate")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const title = item.title[loc] ?? item.title.ko;
            const body = item.body[loc] ?? item.body.ko;
            const excerpt = noticeExcerpt(body);
            const displayNo = items.length - index;

            return (
              <tr
                key={item.slug}
                className="border-b border-line/80 last:border-0 transition hover:bg-brand/[0.03]"
              >
                <td className="px-4 py-4 text-center align-top">
                  {item.pinned ? (
                    <span className="inline-block rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                      {t("noticePinnedBadge")}
                    </span>
                  ) : (
                    <span className="tabular-nums text-brand-ink/45">{displayNo}</span>
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  <Link
                    href={`/community/notice/${item.slug}`}
                    className="group block max-w-3xl space-y-2"
                  >
                    <span className="block text-[15px] font-semibold leading-snug text-brand-ink group-hover:text-brand sm:text-base">
                      {title}
                    </span>
                    <span className="block text-[13px] leading-relaxed text-brand-ink/55">{excerpt}</span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right align-top text-[13px] text-brand-ink/55">
                  {formatKoreaDate(item.createdAt, loc)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}