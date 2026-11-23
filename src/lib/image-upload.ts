export function isAcceptedImageUpload(file: { type: string; name: string }) {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

export function isAcceptedVideoUpload(file: { type: string; name: string }) {
  if (file.type.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|m4v)$/i.test(file.name);
}

/** 이미지 갤러리 — 사진 + 동영상 */
export function isAcceptedGalleryUpload(file: { type: string; name: string }) {
  return isAcceptedImageUpload(file) || isAcceptedVideoUpload(file);
}