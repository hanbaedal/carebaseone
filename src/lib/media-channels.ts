import type { MediaChannels, MediaDoc } from "@/lib/db";

export type { MediaChannels };

/** 기존 product-gallery.json 과 동일한 공개 전시 이미지 */
const PUBLIC_GALLERY_IMAGE_PATHS = new Set([
  "/images/products/jaryeon-cushion.jpg",
  "/images/products/jaryeon-cushion-open.jpg",
  "/images/products/us-recoverx-line.jpg",
  "/images/products/patent-garlic-sample.jpg",
]);

export function publicGalleryDefaultForPath(publicPath: string) {
  return PUBLIC_GALLERY_IMAGE_PATHS.has(publicPath);
}

export function defaultChannelsForGallerySeed(publicPath: string): MediaChannels {
  return {
    cmsBackground: true,
    publicGallery: publicGalleryDefaultForPath(publicPath),
  };
}

export function defaultChannelsForNewUpload(category: MediaDoc["category"], mime: string): MediaChannels {
  if (category === "gallery" && mime.startsWith("image/")) {
    return { cmsBackground: true, publicGallery: false };
  }
  if (mime.startsWith("image/")) {
    return { cmsBackground: false, publicGallery: false };
  }
  return { publicGallery: false, cmsBackground: false };
}

export function resolveMediaChannels(
  doc: Pick<MediaDoc, "channels" | "category" | "mime">,
): MediaChannels {
  if (doc.channels) return doc.channels;
  if (doc.category === "gallery" && doc.mime?.startsWith("image/")) {
    return { cmsBackground: true, publicGallery: false };
  }
  return { publicGallery: false, cmsBackground: false };
}

export function isImageMime(mime: string | undefined) {
  return Boolean(mime?.startsWith("image/"));
}