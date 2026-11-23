import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import type { MediaDoc } from "@/lib/db";
import { isGalleryMediaFile } from "@/lib/media-crud";
import { mediaApiPath, publicMediaUrl, resolveMediaDiskPath } from "@/lib/media-storage";

export function galleryFileMissing(doc: MediaDoc) {
  const publicHint = galleryPublicPathFromDoc(doc.tags, doc.fileName);
  if (publicHint.startsWith("/images/")) return false;
  if (resolveMediaDiskPath(doc.slug, doc.fileName)) return false;
  if (doc.storage === "gridfs" && doc.gridFsId) return false;
  return true;
}

export function galleryThumbSrc(
  item: Pick<MediaDoc, "filePath" | "tags" | "fileName" | "slug" | "mime"> & { storage?: MediaDoc["storage"] },
) {
  const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
  if (item.filePath?.startsWith("/images/")) return item.filePath;
  if (publicHint.startsWith("/images/")) return publicHint;
  if (isGalleryMediaFile(item.fileName, item.mime)) {
    if (resolveMediaDiskPath(item.slug, item.fileName)) {
      return publicMediaUrl(item.slug, item.fileName);
    }
    return mediaApiPath(item.slug);
  }
  if (item.filePath?.startsWith("/api/")) return item.filePath;
  return mediaApiPath(item.slug);
}