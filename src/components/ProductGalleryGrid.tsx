import Image from "next/image";
import { getTranslations } from "next-intl/server";
import gallery from "@/data/product-gallery.json";

export async function ProductGalleryGrid() {
  const t = await getTranslations("community");
  const galleryText = t as unknown as (key: string) => string;

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {gallery.map((item) => (
        <figure key={item.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="relative aspect-[4/3]">
            <Image
              src={item.src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
          <figcaption className="px-4 py-3">
            <p className="text-sm font-semibold text-brand-ink">
              {galleryText(`galleryItems.${item.slug}.title`)}
            </p>
            <p className="mt-1 text-xs text-brand-ink/60">
              {galleryText(`galleryItems.${item.slug}.caption`)}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
