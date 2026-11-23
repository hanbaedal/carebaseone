import type { MediaDoc } from "@/lib/db";
import { galleryThumbSrc } from "@/lib/gallery-thumb-src";

export function mediaPublicHref(doc: Pick<MediaDoc, "slug" | "filePath">) {
  const path = doc.filePath?.trim() ?? "";
  if (path.startsWith("/api/") || path.startsWith("/images/") || path.startsWith("/media/")) {
    return path;
  }
  return `/api/media/${doc.slug}`;
}

export function isMediaImageMime(doc: Pick<MediaDoc, "mime" | "fileName">) {
  if (doc.mime?.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(doc.fileName);
}

export function mediaPreviewThumbSrc(doc: MediaDoc) {
  if (isMediaImageMime(doc)) return galleryThumbSrc(doc);
  return mediaPublicHref(doc);
}