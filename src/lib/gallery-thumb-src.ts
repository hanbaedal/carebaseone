import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import type { MediaDoc } from "@/lib/db";
import { isGalleryImageFile } from "@/lib/media-crud";
import { mediaApiPath, publicMediaUrl, resolveMediaDiskPath } from "@/lib/media-storage";

export function galleryThumbSrc(
  item: Pick<MediaDoc, "filePath" | "tags" | "fileName" | "slug" | "mime"> & { storage?: MediaDoc["storage"] },
) {
  const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
  if (item.filePath?.startsWith("/images/")) return item.filePath;
  if (publicHint.startsWith("/images/")) return publicHint;
  if (isGalleryImageFile(item.fileName, item.mime) && resolveMediaDiskPath(item.slug, item.fileName)) {
    return publicMediaUrl(item.slug, item.fileName);
  }
  if (isGalleryImageFile(item.fileName, item.mime)) {
    return publicMediaUrl(item.slug, item.fileName || `${item.slug}.jpg`);
  }
  if (item.filePath?.startsWith("/api/")) return item.filePath;
  return mediaApiPath(item.slug);
}