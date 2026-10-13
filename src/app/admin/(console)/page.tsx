import { ContentEditor } from "@/components/admin/ContentEditor";
import { contentSections, getEditorFields } from "@/lib/content";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  saved: "저장했습니다. 영어와 중국어에도 반영됩니다.",
  partial: "한글은 저장했습니다. 일부 번역은 잠시 후 다시 저장해 주세요.",
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
          한글을 고치면 영어와 중국어로 번역해 저장합니다. PC에서는 번역이 칸 아래에
          보이고, 모바일에서는 EN · 中文을 눌러 확인합니다.
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
          <ContentEditor section={section} fields={fields} />
        </div>
      </section>
    </div>
  );
}
