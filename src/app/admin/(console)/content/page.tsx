import { ContentEditor } from "@/components/admin/ContentEditor";
import { NavMenuEditor } from "@/components/admin/NavMenuEditor";
import { contentSections, getEditorFields } from "@/lib/content";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  saved: "저장했습니다. 영·중국어는 자동 번역되어 공개 홈에 반영됩니다.",
  partial: "한글은 저장했습니다. 영·중 일부만 실패했으면 같은 내용으로 다시 저장해 주세요.",
  error: "저장하지 못했습니다.",
};

const previewBySection: Record<string, string> = {
  home: "/ko",
  meta: "/ko",
  nav: "/ko",
  footer: "/ko",
  cta: "/ko",
  about: "/ko/about",
  solution: "/ko/solution",
  global: "/ko/global",
  business: "/ko/business",
  product: "/ko/product",
  technology: "/ko/technology",
  news: "/ko/community",
  contact: "/ko/contact",
};

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; status?: string; message?: string }>;
}) {
  const query = await searchParams;
  const section = contentSections.some((item) => item.key === query.section)
    ? query.section!
    : "home";
  const fields = await getEditorFields(section);
  const notice = query.status ? notices[query.status] : "";
  const sectionLabel = contentSections.find((item) => item.key === section)?.label ?? section;
  const previewHref = previewBySection[section] ?? "/ko";

  return (
    <div className="grid gap-3">
      <div>
        <p className="text-[10px] text-ink/45">
          <a href="/admin/cms" className="text-brand hover:underline">
            홈페이지 관리
          </a>{" "}
          / {sectionLabel}
        </p>
        <h1 className="text-sm font-semibold">{sectionLabel} 편집</h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          {section === "meta"
            ? "회사 이름·한줄 소개를 수정합니다. 로고 이미지는 public/logo.png 입니다."
            : "공개 페이지와 1:1입니다. 한글만 입력하면 저장 시 영·중국어가 자동으로 맞춰집니다."}{" "}
          <a
            href={previewHref}
            className="text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            공개 페이지 보기
          </a>
        </p>
        {notice ? (
          <p
            className={`mt-2 text-xs ${
              query.status === "error" ? "text-red-800" : "text-forest"
            }`}
          >
            {query.message || notice}
          </p>
        ) : null}
      </div>
      {section === "nav" ? (
        <NavMenuEditor fields={fields} />
      ) : (
        <ContentEditor section={section} fields={fields} />
      )}
    </div>
  );
}
