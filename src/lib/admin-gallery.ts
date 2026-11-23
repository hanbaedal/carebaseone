import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import type { MediaDoc } from "@/lib/db";
import {
  isGalleryImageFile,
  repairGalleryDiskMirrors,
  repairGalleryImageMime,
} from "@/lib/media-crud";
import { galleryThumbSrc } from "@/lib/gallery-thumb-src";
import { resolveMediaChannels } from "@/lib/media-channels";
import { listMediaForAdmin } from "@/lib/media-lib";

export type AdminGalleryItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  published: boolean;
  publicGallery: boolean;
  cmsBackground: boolean;
};

export { galleryThumbSrc } from "@/lib/gallery-thumb-src";

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
  await repairGalleryImageMime();
  await repairGalleryDiskMirrors();
  const docs = await listMediaForAdmin("gallery");
  return docs.filter((d) => isGalleryImageFile(d.fileName, d.mime)).map(toAdminGalleryItem);
}

export function newGalleryUploadSlug() {
  return `gallery-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}