import { listAllMedia } from "@/lib/media-lib";
import { formatKoreaDate } from "@/lib/korea-time";
import { removeMedia, saveMedia, toggleMedia } from "@/app/admin/ops-actions";

export const dynamic = "force-dynamic";

const categories = ["certification", "research", "product", "other"] as const;

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const query = await searchParams;
  const items = await listAllMedia();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-sm">자료실 / 증빙 파일</h1>
        <p className="mt-1 text-[11px] text-ink/50">
          등록·수정·삭제 및 GridFS 파일 업로드. manifest 시드는 최초·관리 접속 시만 동기화합니다.
        </p>
        {query.status === "saved" ? (
          <p className="mt-1 text-xs text-forest">저장했습니다.</p>
        ) : null}
        {query.status === "error" ? (
          <p className="mt-1 text-xs text-red-800">{query.message ?? "저장 실패"}</p>
        ) : null}
      </div>
      <form action={saveMedia} className="grid gap-2 border border-ink/10 bg-white p-3 text-xs">
        <p className="font-semibold">자료 등록 / 메타 수정</p>
        <input name="slug" placeholder="slug (영문·숫자·하이픈)" required className="border border-ink/15 px-2 py-1" />
        <select name="category" className="border border-ink/15 px-2 py-1">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="audience" className="border border-ink/15 px-2 py-1">
          <option value="public">공개</option>
          <option value="member">회원</option>
        </select>
        <input name="titleKo" placeholder="제목 (한국어)" required className="border border-ink/15 px-2 py-1" />
        <input name="titleEn" placeholder="제목 (English)" className="border border-ink/15 px-2 py-1" />
        <input name="titleZh" placeholder="标题 (中文)" className="border border-ink/15 px-2 py-1" />
        <textarea name="summaryKo" placeholder="간략 소개 (한국어)" rows={2} className="border border-ink/15 px-2 py-1" />
        <textarea name="summaryEn" placeholder="Summary (EN)" rows={2} className="border border-ink/15 px-2 py-1" />
        <textarea name="summaryZh" placeholder="简介 (中文)" rows={2} className="border border-ink/15 px-2 py-1" />
        <label className="grid gap-1">
          파일 (PDF 등, 신규·교체)
          <input name="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4" />
        </label>
        <label className="flex items-center gap-2">
          <input name="published" type="checkbox" value="on" defaultChecked /> 공개
        </label>
        <button className="bg-forest px-3 py-2 text-cream">저장</button>
      </form>
      <div className="overflow-x-auto border border-ink/10 bg-white text-xs">
        <table className="w-full min-w-[56rem]">
          <thead>
            <tr className="text-ink/50">
              <th className="px-2 py-2 text-left font-normal">No</th>
              <th className="px-2 py-2 text-left font-normal">slug</th>
              <th className="px-2 py-2 text-left font-normal">분류</th>
              <th className="px-2 py-2 text-left font-normal">제목</th>
              <th className="px-2 py-2 text-left font-normal">등록자</th>
              <th className="px-2 py-2 text-left font-normal">날짜</th>
              <th className="px-2 py-2 text-left font-normal">파일</th>
              <th className="px-2 py-2 text-left font-normal">관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.slug} className="border-t border-ink/10">
                <td className="px-2 py-2">{items.length - i}</td>
                <td className="px-2 py-2">{item.slug}</td>
                <td className="px-2 py-2">{item.category}</td>
                <td className="max-w-[14rem] truncate px-2 py-2">{item.title.ko}</td>
                <td className="px-2 py-2">{item.createdBy ?? "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {formatKoreaDate(item.createdAt)}
                </td>
                <td className="px-2 py-2">
                  <a href={item.filePath} className="text-forest" target="_blank" rel="noreferrer">
                    {item.storage === "gridfs" ? "열기" : "없음"}
                  </a>
                </td>
                <td className="space-x-2 px-2 py-2">
                  <form action={toggleMedia} className="inline">
                    <input type="hidden" name="slug" value={item.slug} />
                    <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                    <button type="submit">{item.published ? "비공개" : "공개"}</button>
                  </form>
                  <form action={removeMedia} className="inline">
                    <input type="hidden" name="slug" value={item.slug} />
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
    </div>
  );
}
