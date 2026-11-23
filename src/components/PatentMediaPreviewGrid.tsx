"use client";

import { MediaAwareImage } from "@/components/MediaAwareImage";
import {
  mediaAbsoluteHref,
  officeOnlineEmbedSrc,
  type MediaPreviewMode,
} from "@/lib/media-preview-shared";
import { useCallback, useEffect, useMemo, useState } from "react";

export type PatentPreviewItem = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  thumbSrc: string;
  previewMode: MediaPreviewMode;
  fileLabel: string;
};

type PdfZoom = "page-fit" | "page-width" | "100" | "125" | "150";

function pdfViewerSrc(href: string, page: number, zoom: PdfZoom) {
  const zoomParam = zoom === "page-fit" ? "page-fit" : zoom === "page-width" ? "page-width" : zoom;
  return `${href}#page=${page}&zoom=${zoomParam}&toolbar=0&navpanes=0&scrollbar=1&view=Fit`;
}

function DocumentThumbPlaceholder({ fileLabel }: { fileLabel: string }) {
  return (
    <span className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-white to-brand-ink/[0.04] p-4 text-brand-ink/50">
      <span className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold tracking-wide text-brand-ink/70">
        {fileLabel}
      </span>
    </span>
  );
}

const cardEmbedClassName =
  "pointer-events-none absolute left-0 top-0 h-[115%] w-full origin-top scale-[1.08] border-0 bg-white";

/** 목록 카드 — 클릭 전 첫 화면 미리보기(다운로드 유발 원본 URL iframe 금지) */
function CardFirstPagePreview({ item }: { item: PatentPreviewItem }) {
  const [officeSrc, setOfficeSrc] = useState<string | null>(null);

  useEffect(() => {
    if (item.previewMode !== "office") {
      setOfficeSrc(null);
      return;
    }
    setOfficeSrc(officeOnlineEmbedSrc(mediaAbsoluteHref(item.href, window.location.origin)));
  }, [item]);

  if (item.previewMode === "image") {
    return (
      <MediaAwareImage
        src={item.thumbSrc}
        mediaSlug={item.slug}
        alt=""
        fill
        className="object-cover transition duration-300 group-hover:scale-[1.02]"
      />
    );
  }

  if (item.previewMode === "pdf") {
    return (
      <iframe
        title={item.title}
        src={`${item.href}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
        className={cardEmbedClassName}
        tabIndex={-1}
      />
    );
  }

  if (item.previewMode === "office" && officeSrc) {
    return <iframe title={item.title} src={officeSrc} className={cardEmbedClassName} tabIndex={-1} loading="lazy" />;
  }

  return <DocumentThumbPlaceholder fileLabel={item.fileLabel} />;
}

export function PatentMediaPreviewGrid({
  items,
  labels,
}: {
  items: PatentPreviewItem[];
  labels: {
    empty: string;
    view: string;
    close: string;
    openFile: string;
    noPreview: string;
    zoomPageFit: string;
    zoomPageWidth: string;
    zoomActual: string;
    zoomIn: string;
    zoomOut: string;
    prevPage: string;
    nextPage: string;
    pageLabel: string;
  };
}) {
  const [active, setActive] = useState<PatentPreviewItem | null>(null);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfZoom, setPdfZoom] = useState<PdfZoom>("page-fit");
  const [imageScale, setImageScale] = useState(100);

  const officeEmbedSrc = useMemo(() => {
    if (!active || active.previewMode !== "office" || typeof window === "undefined") return null;
    return officeOnlineEmbedSrc(mediaAbsoluteHref(active.href, window.location.origin));
  }, [active]);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    setPdfPage(1);
    setPdfZoom("page-fit");
    setImageScale(100);
  }, [active]);

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

  if (items.length === 0) {
    return <p className="text-sm text-brand-ink/60">{labels.empty}</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {items.map((item) => (
          <li key={item.slug}>
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-white text-left shadow-sm transition hover:border-brand/25 hover:shadow-md"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden bg-brand-ink/[0.06]">
                <CardFirstPagePreview item={item} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-2 pb-2 pt-8 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {labels.view}
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-1 p-3">
                <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-brand-ink group-hover:text-brand">
                  {item.title}
                </span>
                {item.summary ? (
                  <span className="line-clamp-2 text-[11px] leading-relaxed text-brand-ink/55">{item.summary}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label={labels.close}
            className="absolute inset-0 bg-brand-ink/65 backdrop-blur-[2px]"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex h-[min(98dvh,1222px)] w-[min(98vw,1280px)] flex-col overflow-hidden rounded-xl border border-line bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-3 py-2.5 sm:px-4">
              <h2 className="line-clamp-2 pr-2 text-sm font-semibold text-brand-ink sm:text-base">{active.title}</h2>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-md border border-line px-2.5 py-1 text-xs text-brand-ink/70 hover:bg-ink/5"
              >
                {labels.close}
              </button>
            </div>

            {active.previewMode === "pdf" ? (
              <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-line bg-paper/80 px-3 py-2 sm:gap-2 sm:px-4">
                <ZoomButton
                  active={pdfZoom === "page-fit"}
                  label={labels.zoomPageFit}
                  onClick={() => setPdfZoom("page-fit")}
                />
                <ZoomButton
                  active={pdfZoom === "page-width"}
                  label={labels.zoomPageWidth}
                  onClick={() => setPdfZoom("page-width")}
                />
                <ZoomButton active={pdfZoom === "100"} label={labels.zoomActual} onClick={() => setPdfZoom("100")} />
                <ZoomButton label={labels.zoomOut} onClick={() => setPdfZoom((z) => (z === "150" ? "125" : z === "125" ? "100" : "100"))} />
                <ZoomButton label={labels.zoomIn} onClick={() => setPdfZoom((z) => (z === "100" ? "125" : z === "125" ? "150" : "150"))} />
                <span className="mx-1 hidden h-4 w-px bg-line sm:inline" />
                <ZoomButton label={labels.prevPage} onClick={() => setPdfPage((p) => Math.max(1, p - 1))} />
                <span className="text-xs text-brand-ink/55">{labels.pageLabel.replace("{n}", String(pdfPage))}</span>
                <ZoomButton label={labels.nextPage} onClick={() => setPdfPage((p) => p + 1)} />
              </div>
            ) : active.previewMode === "image" ? (
              <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-line bg-paper/80 px-3 py-2 sm:gap-2 sm:px-4">
                <ZoomButton label={labels.zoomOut} onClick={() => setImageScale((s) => Math.max(50, s - 25))} />
                <span className="min-w-[3rem] text-center text-xs text-brand-ink/60">{imageScale}%</span>
                <ZoomButton label={labels.zoomIn} onClick={() => setImageScale((s) => Math.min(200, s + 25))} />
                <ZoomButton label={labels.zoomActual} onClick={() => setImageScale(100)} />
              </div>
            ) : null}

            <div className="relative min-h-0 flex-1 bg-ink/[0.04]">
              {active.previewMode === "image" ? (
                <div className="absolute inset-0 overflow-auto p-3 sm:p-4">
                  <div className="flex min-h-full min-w-full items-center justify-center">
                    <div
                      className="origin-center transition-transform"
                      style={{ transform: `scale(${imageScale / 100})` }}
                    >
                      <MediaAwareImage
                        src={active.thumbSrc}
                        mediaSlug={active.slug}
                        alt=""
                        priority
                        className="max-h-[min(94dvh,1066px)] w-auto max-w-[min(96vw,1200px)] object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : active.previewMode === "pdf" ? (
                <iframe
                  key={`${active.slug}-${pdfPage}-${pdfZoom}`}
                  title={active.title}
                  src={pdfViewerSrc(active.href, pdfPage, pdfZoom)}
                  className="absolute inset-0 h-full w-full border-0 bg-white"
                />
              ) : active.previewMode === "office" && officeEmbedSrc ? (
                <iframe
                  key={active.slug}
                  title={active.title}
                  src={officeEmbedSrc}
                  className="absolute inset-0 h-full w-full border-0 bg-white"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <DocumentThumbPlaceholder fileLabel={active.fileLabel} />
                  <p className="max-w-md text-sm leading-relaxed text-brand-ink/65">{labels.noPreview}</p>
                </div>
              )}
            </div>

            {active.summary ? (
              <p className="line-clamp-2 shrink-0 border-t border-line px-3 py-2 text-xs leading-relaxed text-brand-ink/70 sm:px-4 sm:text-sm">
                {active.summary}
              </p>
            ) : null}
            {active.previewMode === "pdf" || active.previewMode === "image" ? (
              <div className="shrink-0 border-t border-line px-3 py-2 sm:px-4">
                <a
                  href={active.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand hover:underline"
                >
                  {labels.openFile} ↗
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ZoomButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-[11px] sm:text-xs ${
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-line bg-white text-brand-ink/80 hover:bg-ink/5"
      }`}
    >
      {label}
    </button>
  );
}