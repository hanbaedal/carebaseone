import { AdminHubPage } from "@/components/admin/AdminHubPage";
import { getSession } from "@/lib/session";

export default async function AdminIndexPage() {
  const session = await getSession();
  if (!session) return null;
  return <AdminHubPage username={session.username} role={session.role} />;
}