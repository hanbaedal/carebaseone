import { formatKoreaDate } from "@/lib/korea-time";
import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { MEDIA_CATEGORY_LABELS_KO } from "@/lib/homepage-admin-paths";
import { removeMedia, toggleMedia } from "@/app/admin/ops-actions";
import type { MediaDoc } from "@/lib/db";

export function AdminMediaItemsTable({
  items,
  returnQuery = "",
}: {
  items: MediaDoc[];
  returnQuery?: string;
}) {
  return (
    <div className="overflow-x-auto text-xs">
      <table className="w-full min-w-[48rem]">
        <thead>
          <tr className="text-ink/50">
            <th className="px-2 py-2 text-left font-normal">No</th>
            <th className="px-2 py-2 text-left font-normal">slug</th>
            <th className="px-2 py-2 text-left font-normal">분류</th>
            <th className="px-2 py-2 text-left font-normal">노출</th>
            <th className="px-2 py-2 text-left font-normal">제목</th>
            <th className="px-2 py-2 text-left font-normal">날짜</th>
            <th className="px-2 py-2 text-left font-normal">파일</th>
            <th className="px-2 py-2 text-left font-normal">수정·삭제</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.slug} className="border-t border-ink/10">
              <td className="px-2 py-2">{items.length - i}</td>
              <td className="px-2 py-2">{item.slug}</td>
              <td className="px-2 py-2">
                {MEDIA_CATEGORY_LABELS_KO[item.category as keyof typeof MEDIA_CATEGORY_LABELS_KO] ?? item.category}
              </td>
              <td className="whitespace-nowrap px-2 py-2">
                {item.published && item.audience === "public" ? (
                  <span className="text-forest">사이트</span>
                ) : (
                  <span className="text-ink/45">
                    {!item.published ? "비공개" : item.audience === "member" ? "회원" : "—"}
                  </span>
                )}
              </td>
              <td className="max-w-[14rem] truncate px-2 py-2">{item.title.ko}</td>
              <td className="whitespace-nowrap px-2 py-2">{formatKoreaDate(item.createdAt)}</td>
              <td className="px-2 py-2">
                {(() => {
                  const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
                  const href =
                    item.storage === "gridfs"
                      ? item.filePath
                      : publicHint.startsWith("/images/")
                        ? publicHint
                        : item.filePath;
                  const label =
                    item.storage === "gridfs" ? "열기" : publicHint.startsWith("/images/") ? "보기" : "없음";
                  return (
                    <a href={href} className="text-forest" target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  );
                })()}
              </td>
              <td className="space-x-2 px-2 py-2">
                <form action={toggleMedia} className="inline">
                  <input type="hidden" name="slug" value={item.slug} />
                  <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                  {returnQuery ? <input type="hidden" name="returnQuery" value={returnQuery} /> : null}
                  <button type="submit">{item.published ? "비공개" : "공개"}</button>
                </form>
                <form action={removeMedia} className="inline">
                  <input type="hidden" name="slug" value={item.slug} />
                  {returnQuery ? <input type="hidden" name="returnQuery" value={returnQuery} /> : null}
                  <button type="submit" className="text-red-800">
                    삭제
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}