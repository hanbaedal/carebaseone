"use client";

import { useState } from "react";

export function GalleryThumbImage({
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
  const apiSrc = `/api/media/${slug}`;
  const [uri, setUri] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={uri}
      alt={alt}
      className={className}
      onError={() => {
        if (uri !== apiSrc) setUri(apiSrc);
      }}
    />
  );
}