"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { Role } from "@/lib/session";
import { Suspense } from "react";
import { isHomepageAdminPath } from "@/lib/homepage-admin-paths";

export function AdminConsoleFrame({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  if (isHomepageAdminPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 lg:flex-row">
      <Suspense fallback={<aside className="hidden lg:block lg:w-44" />}>
        <AdminSidebar role={role} />
      </Suspense>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}