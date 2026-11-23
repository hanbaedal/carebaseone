"use client";

import { MediaAwareImage } from "@/components/MediaAwareImage";

export function GalleryThumbImage({
  src,
  slug,
  alt,
  className,
  kind = "image",
}: {
  src: string;
  slug: string;
  alt: string;
  className?: string;
  kind?: "image" | "video";
}) {
  if (kind === "video") {
    return (
      <span className="relative block h-full w-full overflow-hidden bg-ink/10">
        <video
          src={src}
          className={className ?? "h-full w-full object-cover"}
          muted
          playsInline
          preload="metadata"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
            VIDEO
          </span>
        </span>
      </span>
    );
  }
  return <MediaAwareImage src={src} mediaSlug={slug} alt={alt} className={className} />;
}