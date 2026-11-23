import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import type { MediaDoc } from "@/lib/db";
import { isImageMime, resolveMediaChannels } from "@/lib/media-channels";
import { listMediaForAdmin } from "@/lib/media-lib";
import { mediaApiPath } from "@/lib/media-storage";

export type AdminGalleryItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  published: boolean;
  publicGallery: boolean;
  cmsBackground: boolean;
};

export function galleryThumbSrc(item: Pick<MediaDoc, "filePath" | "tags" | "fileName" | "slug">) {
  const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
  if (item.filePath?.startsWith("/images/")) return item.filePath;
  if (publicHint.startsWith("/images/")) return publicHint;
  if (item.filePath?.startsWith("/api/")) return item.filePath;
  return mediaApiPath(item.slug);
}

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
  };
}

export async function listAdminGalleryItems(): Promise<AdminGalleryItem[]> {
  const docs = await listMediaForAdmin("gallery");
  return docs.filter((d) => isImageMime(d.mime)).map(toAdminGalleryItem);
}

export function newGalleryUploadSlug() {
  return `gallery-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}