/** 클라이언트·서버 공통 — MongoDB 등 Node 전용 모듈을 import 하지 않음 */

export type MediaPreviewMode = "image" | "pdf" | "file";

export function mediaPublicHref(doc: { slug: string; filePath?: string }) {
  const path = doc.filePath?.trim() ?? "";
  if (path.startsWith("/api/") || path.startsWith("/images/") || path.startsWith("/media/")) {
    return path;
  }
  return `/api/media/${doc.slug}`;
}

export function isMediaImageMime(doc: { mime?: string; fileName: string }) {
  if (doc.mime?.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(doc.fileName);
}

export function isMediaPdfMime(doc: { mime?: string; fileName: string }) {
  if (doc.mime === "application/pdf") return true;
  return /\.pdf$/i.test(doc.fileName);
}

export function mediaPreviewMode(doc: { mime?: string; fileName: string }): MediaPreviewMode {
  if (isMediaImageMime(doc)) return "image";
  if (isMediaPdfMime(doc)) return "pdf";
  return "file";
}

export function mediaFileExtensionLabel(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return (match?.[1] ?? "FILE").toUpperCase();
}