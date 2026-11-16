import { listAllPosts } from "@/lib/posts";
import { ensurePostSeed } from "@/lib/seed-posts";
import { removePost, savePost } from "@/app/admin/ops-actions";
import { HomepageOpsShell, OpsSection } from "@/components/admin/HomepageOpsShell";

export const dynamic = "force-dynamic";

const TYPE_LABELS = {
  archive: "자료실",
  gallery: "갤러리",
} as const;

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; type?: string }>;
}) {
  await ensurePostSeed();
  const query = await searchParams;
  const typeFilter =
    query.type === "archive" || query.type === "gallery" ? query.type : undefined;
  const title = typeFilter ? TYPE_LABELS[typeFilter] : "갤러리·자료";
  const posts = (await listAllPosts()).filter((p) => {
    if (p.type === "notice") return false;
    if (typeFilter) return p.type === typeFilter;
    return true;
  });
  const statusMsg = query.status === "saved" ? "저장했습니다." : query.status === "error" ? query.message : undefined;

  return (
    <HomepageOpsShell
      title={title}
      description="등록 · 목록 · 삭제"
      status={statusMsg}
      statusError={query.status === "error"}
    >
      <OpsSection title="등록">
        <form action={savePost} className="grid gap-2 text-xs">
          <input name="slug" placeholder="slug" required className="border border-ink/15 px-2 py-1.5" />
          <select name="type" defaultValue={typeFilter ?? "gallery"} className="border border-ink/15 px-2 py-1.5">
            <option value="gallery">갤러리</option>
            <option value="archive">자료</option>
          </select>
          <select name="visibility" className="border border-ink/15 px-2 py-1.5">
            <option value="public">공개</option>
            <option value="member">회원</option>
          </select>
          <input name="titleKo" placeholder="제목 (한국어)" className="border border-ink/15 px-2 py-1.5" />
          <textarea name="bodyKo" placeholder="본문 (한국어)" rows={4} className="border border-ink/15 px-2 py-1.5" />
          <input name="eventPlace" placeholder="장소 (갤러리)" className="border border-ink/15 px-2 py-1.5" />
          <label className="flex items-center gap-2">
            <input name="pinned" type="checkbox" /> 상단 고정
          </label>
          <button type="submit" className="bg-forest px-3 py-2 text-cream">
            저장
          </button>
        </form>
      </OpsSection>

      <OpsSection title={`목록 (${posts.length}건)`}>
        <div className="overflow-x-auto text-xs">
          <table className="w-full min-w-[36rem]">
            <thead>
              <tr className="text-ink/50">
                <th className="px-2 py-2 text-left font-normal">slug</th>
                <th className="px-2 py-2 text-left font-normal">유형</th>
                <th className="px-2 py-2 text-left font-normal">제목</th>
                <th className="px-2 py-2 text-left font-normal">삭제</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug} className="border-t border-ink/10">
                  <td className="px-2 py-2">{post.slug}</td>
                  <td className="px-2 py-2">{post.type}</td>
                  <td className="px-2 py-2">{post.title.ko}</td>
                  <td className="px-2 py-2">
                    <form action={removePost}>
                      <input type="hidden" name="slug" value={post.slug} />
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
      </OpsSection>
    </HomepageOpsShell>
  );
}