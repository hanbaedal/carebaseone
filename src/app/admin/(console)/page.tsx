import { ContentEditor } from "@/components/admin/ContentEditor";
import { NavMenuEditor } from "@/components/admin/NavMenuEditor";
import { contentSections, getEditorFields } from "@/lib/content";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  saved: "저장했습니다. 영·중국어는 자동 번역되어 공개 홈에 반영됩니다.",
  partial: "한글은 저장했습니다. 영·중 일부만 실패했으면 같은 내용으로 다시 저장해 주세요.",
  error: "저장하지 못했습니다.",
};

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; status?: string; message?: string }>;
}) {
  const query = await searchParams;
  const section = contentSections.some((item) => item.key === query.section)
    ? query.section!
    : "nav";
  const fields = await getEditorFields(section);
  const notice = query.status ? notices[query.status] : "";

  return (
    <div className="grid gap-4 md:grid-cols-[8.5rem_1fr]">
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {contentSections.map((item) => (
          <a
            key={item.key}
            href={`/admin?section=${item.key}`}
            className={`shrink-0 px-2 py-1 text-xs ${
              item.key === section ? "bg-navy text-cream" : "bg-white text-ink/70"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <section>
        <h1 className="text-sm">
          {contentSections.find((item) => item.key === section)?.label}
        </h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          입력란은 한글만 표시합니다. 저장하면 영·중국어는 자동으로 맞춰지고, 방문자는 헤더 KO /
          EN / 中文으로 언어를 바꿉니다.
        </p>
        {notice ? (
          <p
            className={`mt-3 text-xs ${
              query.status === "error" ? "text-red-800" : "text-forest"
            }`}
          >
            {query.message || notice}
          </p>
        ) : null}
        <div className="mt-3">
          {section === "nav" ? (
            <NavMenuEditor fields={fields} />
          ) : (
            <ContentEditor section={section} fields={fields} />
          )}
        </div>
      </section>
    </div>
  );
}
