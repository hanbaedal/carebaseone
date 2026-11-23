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

export function isMediaPdfMime(doc: Pick<MediaDoc, "mime" | "fileName">) {
  if (doc.mime === "application/pdf") return true;
  return /\.pdf$/i.test(doc.fileName);
}

export type MediaPreviewMode = "image" | "pdf" | "file";

export function mediaPreviewMode(doc: Pick<MediaDoc, "mime" | "fileName">): MediaPreviewMode {
  if (isMediaImageMime(doc)) return "image";
  if (isMediaPdfMime(doc)) return "pdf";
  return "file";
}

export function mediaFileExtensionLabel(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return (match?.[1] ?? "FILE").toUpperCase();
}

export function mediaDownloadHref(href: string) {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}download=1`;
}

export function mediaPreviewThumbSrc(doc: MediaDoc) {
  if (isMediaImageMime(doc)) return galleryThumbSrc(doc);
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