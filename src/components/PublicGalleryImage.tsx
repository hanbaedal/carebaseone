"use client";

import { MediaAwareImage } from "@/components/MediaAwareImage";

export function PublicGalleryImage({
  src,
  slug,
  alt,
  className,
}: {
  src: string;
  slug: string;
  alt: string;
  className?: string;
}) {
  return <MediaAwareImage src={src} mediaSlug={slug} alt={alt} className={className} />;
}