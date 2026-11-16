import { listAllPosts } from "@/lib/posts";
import { ensurePostSeed } from "@/lib/seed-posts";
import { removePost, savePost } from "@/app/admin/ops-actions";

export const dynamic = "force-dynamic";

export default async function AdminNoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await ensurePostSeed();
  const query = await searchParams;
  const posts = (await listAllPosts("notice")).filter((p) => p.type === "notice");

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-[10px] text-ink/45">
          <a href="/admin/cms" className="text-brand hover:underline">
            메인·페이지 구성
          </a>{" "}
          / 공지사항
        </p>
        <h1 className="text-sm font-semibold">공지사항</h1>
        {query.status === "saved" ? (
          <p className="mt-1 text-xs text-forest">저장했습니다.</p>
        ) : null}
      </div>
      <form action={savePost} className="grid gap-2 border border-ink/10 bg-white p-3 text-xs">
        <p className="font-semibold">새 공지</p>
        <input name="slug" placeholder="slug" required className="border border-ink/15 px-2 py-1" />
        <input type="hidden" name="type" value="notice" />
        <select name="visibility" className="border border-ink/15 px-2 py-1">
          <option value="public">공개</option>
          <option value="member">회원</option>
        </select>
        <input name="titleKo" placeholder="제목 (한국어)" className="border border-ink/15 px-2 py-1" />
        <textarea name="bodyKo" placeholder="본문 (한국어)" rows={4} className="border border-ink/15 px-2 py-1" />
        <label className="flex items-center gap-2">
          <input name="pinned" type="checkbox" /> 상단 고정
        </label>
        <button className="bg-forest px-3 py-2 text-cream">저장</button>
      </form>
      <div className="overflow-x-auto border border-ink/10 bg-white text-xs">
        <table className="w-full min-w-[36rem]">
          <thead>
            <tr className="text-ink/50">
              <th className="px-2 py-2 text-left font-normal">slug</th>
              <th className="px-2 py-2 text-left font-normal">노출</th>
              <th className="px-2 py-2 text-left font-normal">제목</th>
              <th className="px-2 py-2 text-left font-normal">관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-t border-ink/10">
                <td className="px-2 py-2">{post.slug}</td>
                <td className="px-2 py-2">{post.visibility}</td>
                <td className="px-2 py-2">{post.title.ko}</td>
                <td className="px-2 py-2">
                  <form action={removePost}>
                    <input type="hidden" name="slug" value={post.slug} />
                    <button className="text-red-800">삭제</button>
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