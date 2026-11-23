import type { MediaDoc } from "@/lib/db";
import {
  isGalleryImageFile,
  repairGalleryDiskMirrors,
  repairGalleryImageMime,
} from "@/lib/media-crud";
import { galleryFileMissing, galleryThumbSrc } from "@/lib/gallery-thumb-src";
import { resolveMediaChannels } from "@/lib/media-channels";
import { listMediaForAdmin } from "@/lib/media-lib";
import { resolveProductLines, type MediaProductLines } from "@/lib/media-product-lines";
import { ensureProductLineGalleryFromCatalog } from "@/lib/product-line-gallery-migrate";

export type AdminGalleryItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  published: boolean;
  publicGallery: boolean;
  cmsBackground: boolean;
  productLines: MediaProductLines;
  /** 파일 미반영(저장 실패) — 삭제 후 재업로드 권장 */
  fileMissing?: boolean;
};

export { galleryFileMissing, galleryThumbSrc } from "@/lib/gallery-thumb-src";

export function toAdminGalleryItem(doc: MediaDoc): AdminGalleryItem {
  const ch = resolveMediaChannels(doc);
  return {
    id: doc.slug,
    src: galleryThumbSrc(doc),
    title: doc.title.ko,
    description: doc.summary.ko,
    published: doc.published,
    publicGallery: ch.publicGallery,
    cmsBackground: ch.cmsBackground,
    productLines: resolveProductLines(ch),
    fileMissing: galleryFileMissing(doc),
  };
}

export async function listAdminGalleryItems(): Promise<AdminGalleryItem[]> {
  await repairGalleryImageMime();
  await repairGalleryDiskMirrors();
  const { repairGalleryPublicChannels } = await import("@/lib/media-crud");
  await repairGalleryPublicChannels();
  await ensureProductLineGalleryFromCatalog();
  const docs = await listMediaForAdmin("gallery");
  return docs.filter((d) => isGalleryImageFile(d.fileName, d.mime)).map(toAdminGalleryItem);
}

export function newGalleryUploadSlug() {
  return `gallery-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}