import { ManageImageGallery } from "@/components/admin/ManageImageGallery";
import { HomepageOpsShell } from "@/components/admin/HomepageOpsShell";
import { listAdminGalleryItems } from "@/lib/admin-gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const query = await searchParams;
  const items = await listAdminGalleryItems();
  const notice =
    query.status === "saved"
      ? "저장했습니다."
      : query.status === "error"
        ? (query.message ?? "저장 실패")
        : undefined;

  return (
    <HomepageOpsShell
      title="이미지 갤러리"
      description="제품 라인을 체크하고 「게시」하면 /product/*에 한 줄 2개씩 모두 표시됩니다. 공개 갤러리·CMS 배경은 커뮤니티·페이지 배경용입니다."
      status={notice}
      statusError={query.status === "error"}
    >
      <ManageImageGallery initial={items} />
    </HomepageOpsShell>
  );
}