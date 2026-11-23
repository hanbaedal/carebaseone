import type { MediaDoc } from "@/lib/db";
import { galleryThumbSrc } from "@/lib/gallery-thumb-src";
import { mediaFileExtensionLabel, mediaPreviewMode, mediaPublicHref } from "@/lib/media-preview-shared";

export type { MediaPreviewMode } from "@/lib/media-preview-shared";
export {
  isMediaImageMime,
  isMediaOfficeMime,
  isMediaPdfMime,
  mediaFileExtensionLabel,
  mediaPreviewMode,
  mediaPublicHref,
} from "@/lib/media-preview-shared";

export function mediaPreviewThumbSrc(doc: MediaDoc) {
  if (doc.mime?.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(doc.fileName)) {
    return galleryThumbSrc(doc);
  }
  return mediaPublicHref(doc);
}

export function mediaToPreviewItem(doc: MediaDoc, loc: "ko" | "en" | "zh") {
  return {
    slug: doc.slug,
    title: doc.title[loc] ?? doc.title.ko,
    summary: doc.summary[loc] ?? doc.summary.ko,
    href: mediaPublicHref(doc),
    thumbSrc: mediaPreviewThumbSrc(doc),
    previewMode: mediaPreviewMode(doc),
    fileLabel: mediaFileExtensionLabel(doc.fileName),
  };
}