import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import type { MediaDoc } from "@/lib/db";
import { isGalleryMediaFile } from "@/lib/media-crud";
import { mediaApiPath, resolveMediaDiskPath } from "@/lib/media-storage";

export function galleryFileMissing(doc: MediaDoc) {
  const publicHint = galleryPublicPathFromDoc(doc.tags, doc.fileName);
  if (publicHint.startsWith("/images/")) return false;
  if (doc.storage === "gridfs" && doc.gridFsId) return false;
  if (resolveMediaDiskPath(doc.slug, doc.fileName)) return false;
  return true;
}

/**
 * 갤러리·업로드 미디어 URL.
 * GridFS 업로드는 항상 /api/media/{slug} — Render 등에서 /media 미러가 없어 404/재생 실패하는 문제 방지.
 */
export function galleryThumbSrc(
  item: Pick<MediaDoc, "filePath" | "tags" | "fileName" | "slug" | "mime"> & { storage?: MediaDoc["storage"] },
) {
  const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
  if (item.filePath?.startsWith("/images/")) return item.filePath;
  if (publicHint.startsWith("/images/")) return publicHint;
  if (item.storage === "gridfs" || item.filePath?.startsWith("/api/") || isGalleryMediaFile(item.fileName, item.mime)) {
    return mediaApiPath(item.slug);
  }
  if (item.filePath?.startsWith("/api/")) return item.filePath;
  return mediaApiPath(item.slug);
}