import { listAllMedia } from "@/lib/media-lib";
import { toggleMedia } from "@/app/admin/ops-actions";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const items = await listAllMedia();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm">자료실 / 증빙 파일</h1>
        <p className="mt-1 text-[11px] text-ink/50">
          파일은 public/media 또는 import 스크립트로 추가합니다.
        </p>
        {query.status === "saved" ? (
          <p className="mt-1 text-xs text-forest">반영했습니다.</p>
        ) : null}
      </div>
      <div className="overflow-x-auto border border-ink/10 bg-white text-xs">
        <table className="w-full min-w-[48rem]">
          <thead>
            <tr className="text-ink/50">
              <th className="px-2 py-2 text-left font-normal">분류</th>
              <th className="px-2 py-2 text-left font-normal">제목</th>
              <th className="px-2 py-2 text-left font-normal">경로</th>
              <th className="px-2 py-2 text-left font-normal">공개</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug} className="border-t border-ink/10">
                <td className="px-2 py-2">{item.category}</td>
                <td className="px-2 py-2">{item.title.ko}</td>
                <td className="px-2 py-2">
                  <a href={item.filePath} className="text-forest" target="_blank" rel="noreferrer">
                    열기
                  </a>
                </td>
                <td className="px-2 py-2">
                  <form action={toggleMedia}>
                    <input type="hidden" name="slug" value={item.slug} />
                    <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                    <button>{item.published ? "비공개" : "공개"}</button>
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
