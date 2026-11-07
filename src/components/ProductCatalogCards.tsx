"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export type ProductCatalogCard = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  gallery: string[];
  mediaHrefs: string[];
};

export function ProductCatalogCards({
  items,
  labels,
}: {
  items: ProductCatalogCard[];
  labels: {
    doc: string;
    archiveLink: string;
    viewDetail: string;
    close: string;
    relatedDocs: string;
  };
}) {
  const [active, setActive] = useState<ProductCatalogCard | null>(null);
  const [slide, setSlide] = useState(0);

  const close = useCallback(() => {
    setActive(null);
    setSlide(0);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  const open = (item: ProductCatalogCard) => {
    setActive(item);
    setSlide(0);
  };

  const shots = active
    ? active.gallery.length > 0
      ? active.gallery
      : [active.image]
    : [];

  return (
    <>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => open(item)}
              className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-brand-ink/5 text-left"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 640px) 45vw, 100vw"
              />
              <span className="sr-only">
                {item.title} — {labels.viewDetail}
              </span>
            </button>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold text-brand-ink">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-ink/70">
                {item.summary}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => open(item)}
                  className="text-sm font-medium text-brand underline-offset-2 hover:underline"
                >
                  {labels.viewDetail}
                </button>
                {item.mediaHrefs.length > 0 ? (
                  <Link
                    href="/community/archive"
                    className="text-xs text-brand-ink/50 hover:text-brand"
                  >
                    {labels.archiveLink} →
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="presentation"
        >
          <button
            type="button"
            aria-label={labels.close}
            className="absolute inset-0 bg-brand-ink/55 backdrop-blur-[2px]"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative z-10 flex max-h-[min(92dvh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 bg-brand-ink/5 sm:aspect-[16/10]">
              <Image
                src={shots[slide] ?? active.image}
                alt=""
                fill
                className="object-contain p-2 sm:object-cover sm:p-0"
                sizes="(min-width: 768px) 768px, 100vw"
                priority
              />
            </div>
            {shots.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3">
                {shots.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${
                      i === slide ? "border-brand" : "border-transparent opacity-70"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            ) : null}
            <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <h3 id="product-modal-title" className="text-xl font-semibold text-brand-ink">
                  {active.title}
                </h3>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm text-brand-ink/70 hover:bg-brand/5"
                >
                  {labels.close}
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">{active.summary}</p>
              {active.mediaHrefs.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold tracking-wide text-brand-ink/50">
                    {labels.relatedDocs}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {active.mediaHrefs.map((href) => (
                      <li key={href}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-full border border-line px-3 py-1 text-xs text-brand hover:bg-brand/5"
                        >
                          {labels.doc}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
