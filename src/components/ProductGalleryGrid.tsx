import Image from "next/image";
import gallery from "@/data/product-gallery.json";

export function ProductGalleryGrid({ locale }: { locale: string }) {
  const isKo = locale === "ko" || locale === "en" || locale === "zh";
  void isKo;

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {gallery.map((item) => (
        <figure key={item.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="relative aspect-[4/3]">
            <Image src={item.src} alt="" fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
          <figcaption className="px-4 py-3">
            <p className="text-sm font-semibold text-brand-ink">{item.titleKo}</p>
            <p className="mt-1 text-xs text-brand-ink/60">{item.captionKo}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
