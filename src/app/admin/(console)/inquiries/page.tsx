import { listInquiries } from "@/lib/inquiries";
import { AdminInquiriesTable } from "@/components/admin/AdminInquiriesTable";
import { HomepageOpsShell, OpsSection } from "@/components/admin/HomepageOpsShell";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const query = await searchParams;
  const rows = await listInquiries();
  const statusMsg =
    query.status === "saved"
      ? "저장했습니다."
      : query.status === "error"
        ? (query.message ? decodeURIComponent(query.message.replace(/\+/g, " ")) : "처리에 실패했습니다.")
        : undefined;

  return (
    <HomepageOpsShell
      title="문의 접수"
      description="사이트 문의 목록과 관리자 답변(등록·수정·삭제). 문의 페이지 안내 문구는 CMS 「문의 페이지」에서 수정합니다."
      status={statusMsg}
      statusError={query.status === "error"}
    >
      <OpsSection title={`목록 (${rows.length}건)`}>
        <AdminInquiriesTable items={rows} />
      </OpsSection>
    </HomepageOpsShell>
  );
}