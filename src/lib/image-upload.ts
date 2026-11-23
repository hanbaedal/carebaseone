export function isAcceptedImageUpload(file: { type: string; name: string }) {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}