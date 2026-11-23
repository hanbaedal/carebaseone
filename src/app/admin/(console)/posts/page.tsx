import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** 자료실 글 타입 관리 → 공개 자료실과 동일한 미디어 목록으로 통합 */
export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; type?: string }>;
}) {
  const query = await searchParams;
  if (query.type === "gallery") {
    redirect("/admin/gallery");
  }

  const q = new URLSearchParams();
  q.set("focus", "archive");
  if (query.status) q.set("status", query.status);
  if (query.message) q.set("message", query.message);
  redirect(`/admin/media?${q.toString()}`);
}