import { CmsVisualEditor } from "@/components/admin/CmsVisualEditor";
import { getEditorFields } from "@/lib/content";
import { CMS_PAGES, cmsPageByKey } from "@/lib/cms-pages";
import { listAllMedia } from "@/lib/media-lib";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  saved: "저장했습니다. 미리보기를 새로고침하면 반영됩니다.",
  partial: "한글은 저장했습니다. 영·중 일부만 실패했으면 다시 저장해 주세요.",
  error: "저장하지 못했습니다.",
};

export default async function AdminCmsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; message?: string }>;
}) {
  const query = await searchParams;
  const page = cmsPageByKey(query.page);
  const fields = await getEditorFields(page.section);
  const notice = query.status ? notices[query.status] : "";
  const submenuPages = CMS_PAGES.filter((item) => item.tab === "submenu");
  const returnTo = `/admin/cms?page=${encodeURIComponent(page.key)}`;
  const mediaDocs = await listAllMedia();
  const mediaOptions = mediaDocs
    .filter((m) => m.mime.startsWith("image/"))
    .map((m) => ({
      slug: m.slug,
      src: m.filePath,
      title: m.title.ko || m.slug,
    }));

  return (
    <CmsVisualEditor
      page={page}
      fields={fields}
      returnTo={returnTo}
      notice={query.message || notice}
      noticeError={query.status === "error"}
      submenuPages={submenuPages}
      mediaOptions={mediaOptions}
    />
  );
}
