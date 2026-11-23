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
      description="사진 올리기(위). PC에서는 5장 스트립·번호 줄로 사진을 고르고, 아래 편집란에서 제목·공개갤러리·CMS 배경을 수정한 뒤 「저장」을 누르세요."
      status={notice}
      statusError={query.status === "error"}
    >
      <ManageImageGallery initial={items} />
    </HomepageOpsShell>
  );
}