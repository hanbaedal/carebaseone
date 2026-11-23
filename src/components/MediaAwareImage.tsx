"use client";

import { cmsMediaSlugFromValue } from "@/lib/home-hero";
import { useMemo, useState } from "react";

export { cmsMediaSlugFromValue } from "@/lib/home-hero";

const MEDIA_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"] as const;

function fallbacksForSlug(slug: string, current: string) {
  const out: string[] = [];
  for (const ext of MEDIA_EXTS) {
    const path = `/media/${slug}${ext}`;
    if (path !== current) out.push(path);
  }
  const api = `/api/media/${slug}`;
  if (api !== current) out.push(api);
  return out;
}

export function MediaAwareImage({
  src,
  mediaSlug,
  alt = "",
  className,
  fill,
  priority,
}: {
  src: string;
  mediaSlug?: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  const slug = mediaSlug ?? cmsMediaSlugFromValue(src);
  const chain = useMemo(() => {
    const list = [src];
    if (slug) list.push(...fallbacksForSlug(slug, src));
    return Array.from(new Set(list));
  }, [src, slug]);

  const [index, setIndex] = useState(0);
  const uri = chain[index] ?? src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={uri}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}` : className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        setIndex((i) => (i + 1 < chain.length ? i + 1 : i));
      }}
    />
  );
}