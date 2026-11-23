import { listInquiries } from "@/lib/inquiries";
import { AdminInquiriesTable } from "@/components/admin/AdminInquiriesTable";
import { HomepageOpsShell, OpsSection } from "@/components/admin/HomepageOpsShell";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const query = await searchParams;
  const rows = await listInquiries();
  const statusMsg = query.status === "saved" ? "삭제했습니다." : undefined;

  return (
    <HomepageOpsShell
      title="문의 접수"
      description="사이트 문의 폼으로 들어온 내용 목록 · 삭제. 문의 페이지 안내 문구는 CMS 「문의 페이지」에서 수정합니다."
      status={statusMsg}
    >
      <OpsSection title={`목록 (${rows.length}건)`}>
        <AdminInquiriesTable items={rows} />
      </OpsSection>
    </HomepageOpsShell>
  );
}