import { CmsVisualEditor } from "@/components/admin/CmsVisualEditor";
import { getKoCmsEditorFields } from "@/lib/content";
import { cmsPageByKey } from "@/lib/cms-pages";
import { listCmsImageMediaOptions } from "@/lib/media-lib";
export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  saved: "저장했습니다. 미리보기를 새로고침하면 반영됩니다.",
  partial: "한글은 저장했습니다. 영·중 일부만 실패했으면 다시 저장해 주세요.",
  error: "저장하지 못했습니다.",
};

export default async function AdminCmsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; message?: string; focus?: string }>;
}) {
  const query = await searchParams;
  const page = cmsPageByKey(query.page);
  const [fields, mediaOptions] = await Promise.all([
    getKoCmsEditorFields(page.section),
    listCmsImageMediaOptions(),
  ]);
  const notice = query.status ? notices[query.status] : "";
  return (
    <CmsVisualEditor
      page={page}
      fields={fields}
      previewFocus={query.focus}
      notice={query.message || notice}
      noticeError={query.status === "error"}
      mediaOptions={mediaOptions}
    />
  );
}
