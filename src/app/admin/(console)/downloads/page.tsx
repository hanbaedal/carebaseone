import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
  const session = await getSession();
  if (session?.role !== "supervisor") redirect("/admin/site");

  return (
    <div className="grid gap-3">
      <h1 className="text-sm">문서 다운로드</h1>
      <p className="text-[11px] leading-5 text-ink/50">
        운영·백업용 자료입니다. 자료 파일은 홈페이지 관리 → 자료 파일에서 내려받을 수 있습니다.
      </p>
      <ul className="grid gap-2 text-xs">
        <li>
          <a
            href="/sitemap.xml"
            className="text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sitemap.xml (검색엔진용)
          </a>
        </li>
      </ul>
    </div>
  );
}
