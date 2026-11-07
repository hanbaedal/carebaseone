import { StaffSelfEditForm } from "@/components/admin/StaffSelfEditForm";
import { getCompanyProfile } from "@/lib/company-profile";
import { getSession } from "@/lib/session";
import { findUser } from "@/lib/users";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffSelfEditPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const user = await findUser(session.username);
  if (!user || user.disabled) redirect("/admin/login");
  if (user.role !== "admin" && user.role !== "supervisor") {
    redirect("/admin/site");
  }

  const query = await searchParams;
  const profile = await getCompanyProfile();
  const roleLabel = user.role === "supervisor" ? "슈퍼바이저" : "관리자";

  return (
    <div className="grid gap-3">
      <div>
        <h1 className="text-sm font-semibold">관리자 정보 수정</h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          회사·연락처·푸터 SNS를 관리자와 슈퍼바이저가 함께 수정할 수 있습니다. 비밀번호는 본인
          아이디만 바꿀 수 있습니다.
        </p>
      </div>
      <StaffSelfEditForm
        profile={profile}
        username={user.username}
        roleLabel={roleLabel}
        error={query.status === "error" ? query.message : undefined}
        saved={query.status === "saved"}
      />
    </div>
  );
}
