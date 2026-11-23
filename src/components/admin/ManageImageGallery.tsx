"use client";

import { useEffect, useRef, useState } from "react";
import { DecadePager } from "@/components/admin/DecadePager";
import { GallerySlideModal } from "@/components/admin/GallerySlideModal";
import { GalleryThumbImage } from "@/components/admin/GalleryThumbImage";
import type { AdminGalleryItem } from "@/lib/admin-gallery";
import { PRODUCT_LINE_CATEGORIES } from "@/lib/product-categories";
import {
  PRODUCT_LINE_LABELS,
  PRODUCT_LINES_PER_CATEGORY,
  emptyProductLines,
  type MediaProductLines,
} from "@/lib/media-product-lines";

const field =
  "h-9 w-full min-w-0 rounded-md border border-ink/15 bg-white px-3 text-sm text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/30";
const area =
  "min-h-20 w-full min-w-0 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

const STRIP_SIZE = 5;

type GalleryFilter = "전체" | "공개갤러리" | "CMS배경" | "비노출";

const FILTER_OPTIONS: GalleryFilter[] = ["전체", "공개갤러리", "CMS배경", "비노출"];

function formatMb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function matchesFilter(item: AdminGalleryItem, filter: GalleryFilter) {
  if (filter === "전체") return true;
  if (filter === "공개갤러리") return item.publicGallery;
  if (filter === "CMS배경") return item.cmsBackground;
  return !item.publicGallery && !item.cmsBackground;
}

export function ManageImageGallery({ initial }: { initial: AdminGalleryItem[] }) {
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadPublic, setUploadPublic] = useState(true);
  const [uploadCms, setUploadCms] = useState(true);
  const [uploadProductLines, setUploadProductLines] = useState<MediaProductLines>(() => emptyProductLines());
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<GalleryFilter>("전체");
  const [viewIndex, setViewIndex] = useState(0);
  const [stripStart, setStripStart] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function pickFile(next: File | null) {
    setFile(next);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return next ? URL.createObjectURL(next) : null;
    });
  }

  async function onUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setMessage("사진 파일을 선택해 주세요.");
      return;
    }
    setBusy(true);
    setMessage("");
    const form = new FormData();
    form.set("file", file);
    form.set("title", title);
    form.set("description", description);
    if (uploadPublic) form.set("publicGallery", "true");
    if (uploadCms) form.set("cmsBackground", "true");
    if (!uploadCms) form.set("cmsBackground", "false");
    form.set("published", "true");
    for (const key of PRODUCT_LINE_CATEGORIES) {
      if (uploadProductLines[key]) form.set(`productLine_${key}`, "true");
    }
    try {
      const res = await fetch("/api/admin/gallery", { method: "POST", body: form, credentials: "same-origin" });
      let json: { ok?: boolean; error?: string; items?: AdminGalleryItem[] } = {};
      try {
        json = (await res.json()) as typeof json;
      } catch {
        setMessage(`업로드에 실패했습니다. (HTTP ${res.status})`);
        return;
      }
      if (!res.ok || !json.ok) {
        setMessage(json.error || `업로드에 실패했습니다. (HTTP ${res.status})`);
        return;
      }
      if (json.items) setItems(json.items);
      setTitle("");
      setDescription("");
      setUploadPublic(true);
      setUploadCms(true);
      setUploadProductLines(emptyProductLines());
      pickFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("올렸습니다. 공개 사이트에는 「공개 갤러리」가 체크된 사진만 나타납니다.");
    } catch {
      setMessage("네트워크 오류입니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function onSave(item: AdminGalleryItem) {
    setBusy(true);
  setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          description: item.description,
          publicGallery: item.publicGallery,
          cmsBackground: item.cmsBackground,
          published: item.published,
          productLines: item.productLines,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; items?: AdminGalleryItem[]; error?: string };
      if (!res.ok || !json.ok) {
        setMessage(json.error || "저장에 실패했습니다.");
        return;
      }
      if (json.items) setItems(json.items);
      setMessage("저장했습니다.");
    } catch {
      setMessage("저장 중 오류가 났습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("이 사진을 지울까요?")) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = (await res.json()) as { ok?: boolean; items?: AdminGalleryItem[] };
      if (json.items) setItems(json.items);
      setMessage("삭제했습니다.");
    } finally {
      setBusy(false);
    }
  }

  function patchItem(id: string, patch: Partial<AdminGalleryItem>) {
    setItems((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function productLineUsage(category: (typeof PRODUCT_LINE_CATEGORIES)[number]) {
    return items.filter((row) => row.published && row.productLines[category]).length;
  }

  function ProductLineToggles({
    value,
    onChange,
    disabled,
  }: {
    value: MediaProductLines;
    onChange: (next: MediaProductLines) => void;
    disabled?: boolean;
  }) {
    return (
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-brand-ink/80">제품 페이지 (라인당 {PRODUCT_LINES_PER_CATEGORY}장)</p>
        <div className="flex flex-wrap gap-1.5">
          {PRODUCT_LINE_CATEGORIES.map((key) => {
            const used = productLineUsage(key);
            const atCap = used >= PRODUCT_LINES_PER_CATEGORY && !value[key];
            return (
              <label
                key={key}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${
                  value[key] ? "border-brand bg-brand/10 text-brand" : "border-ink/15 bg-white text-brand-ink/80"
                } ${disabled || atCap ? "opacity-60" : ""}`}
                title={atCap ? `이미 ${PRODUCT_LINES_PER_CATEGORY}장 게시 중` : undefined}
              >
                <input
                  type="checkbox"
                  className="size-3.5"
                  disabled={disabled || atCap}
                  checked={value[key]}
                  onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
                />
                {PRODUCT_LINE_LABELS[key]}
                <span className="text-[10px] text-ink/45">
                  {used}/{PRODUCT_LINES_PER_CATEGORY}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  const visible = items.filter((item) => matchesFilter(item, filter));
  const total = visible.length;
  const safeIndex = total ? Math.min(viewIndex, total - 1) : 0;
  const current = total ? visible[safeIndex] : null;

  useEffect(() => {
    setViewIndex(0);
    setStripStart(0);
  }, [filter]);

  useEffect(() => {
    if (viewIndex >= total && total > 0) setViewIndex(total - 1);
  }, [total, viewIndex]);

  useEffect(() => {
    setStripStart((start) => {
      if (safeIndex < start || safeIndex >= start + STRIP_SIZE) {
        return Math.floor(safeIndex / STRIP_SIZE) * STRIP_SIZE;
      }
      return start;
    });
  }, [safeIndex]);

  const maxStripStart = total > STRIP_SIZE ? total - STRIP_SIZE : 0;
  const stripItems = visible.slice(stripStart, stripStart + STRIP_SIZE);
  const canStripPrev = stripStart > 0;
  const canStripNext = stripStart < maxStripStart;

  function openModalAt(index: number) {
    setViewIndex(index);
    setModalOpen(true);
  }

  async function onDownload(item: AdminGalleryItem) {
    try {
      const res = await fetch(item.src);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${item.id}.jpg`;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(item.src, "_blank", "noopener,noreferrer");
    }
  }

  function itemEditor(item: AdminGalleryItem) {
    return (
      <>
        {item.fileMissing ? (
          <p className="rounded border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-900">
            이미지 파일이 서버에 없습니다. 「삭제」 후 같은 사진을 다시 올려 주세요.
          </p>
        ) : null}
        <input
          className={field}
          placeholder="제목"
          value={item.title}
          onChange={(e) => patchItem(item.id, { title: e.target.value })}
        />
        <textarea
          className={area}
          placeholder="설명 (공개 갤러리 캡션)"
          value={item.description}
          onChange={(e) => patchItem(item.id, { description: e.target.value })}
        />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-ink">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={item.publicGallery}
              onChange={(e) => patchItem(item.id, { publicGallery: e.target.checked })}
            />
            공개 갤러리
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={item.cmsBackground}
              onChange={(e) => patchItem(item.id, { cmsBackground: e.target.checked })}
            />
            CMS 배경
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={item.published}
              onChange={(e) => patchItem(item.id, { published: e.target.checked })}
            />
            공개(게시)
          </label>
        </div>
        <ProductLineToggles
          value={item.productLines}
          onChange={(productLines) => patchItem(item.id, { productLines })}
          disabled={busy}
        />
        <GalleryItemActions item={item} busy={busy} onSave={onSave} onDelete={onDelete} onDownload={onDownload} />
      </>
    );
  }

  const filterBar = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-[13px] font-semibold text-brand-ink">등록된 사진 ({items.length})</h2>
      <div className="flex max-w-full flex-wrap gap-1.5">
        {FILTER_OPTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`h-7 rounded border px-2.5 text-xs ${
              filter === tag ? "border-brand bg-brand text-cream" : "border-ink/15 bg-white text-brand-ink hover:bg-ink/5"
            }`}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-8 overflow-x-hidden">
      <div className="rounded-lg border border-line bg-cream/30 p-4 text-[11px] leading-5 text-ink/55">
        <p>
          <strong className="text-brand-ink">공개 갤러리</strong> → <code className="text-forest">/ko/community/gallery</code>{" "}
          · <strong className="text-brand-ink">CMS 배경</strong> → 홈페이지관리 배경 선택
        </p>
      </div>

      <form onSubmit={onUpload} className="rounded-lg border border-line bg-white p-4 sm:p-5 md:grid md:grid-cols-2 md:items-start md:gap-x-8 md:gap-y-3">
        <h2 className="text-[13px] font-semibold text-brand-ink md:col-span-2">사진 올리기</h2>

        <div className="mt-3 min-w-0 space-y-2 md:mt-0">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[16rem] overflow-hidden rounded-md border border-ink/10 bg-ink/5 sm:max-w-xs md:mx-0 md:max-w-none">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain object-center" />
            ) : (
              <span className="flex h-full items-center justify-center px-2 text-center text-[11px] leading-tight text-ink/45">
                선택한 파일
                <br />
                미리보기
              </span>
            )}
          </div>
          <p className="text-center text-[11px] text-ink/45 md:text-left">JPG · PNG · WebP · GIF</p>
        </div>

        <div className="mt-3 min-w-0 space-y-2 md:mt-0">
          <input className={field} placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            className={`${area} md:min-h-16`}
            placeholder="설명 (캡션)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <ProductLineToggles
            value={uploadProductLines}
            onChange={setUploadProductLines}
            disabled={busy}
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked={uploadPublic} onChange={(e) => setUploadPublic(e.target.checked)} />
                공개 갤러리 (사이트 /community/gallery)
              </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={uploadCms} onChange={(e) => setUploadCms(e.target.checked)} />
              CMS 배경
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <label className={`cursor-pointer rounded border border-ink/15 bg-white px-3 py-1.5 text-xs hover:bg-ink/5 ${busy ? "pointer-events-none opacity-60" : ""}`}>
              {file ? "다른 파일 선택" : "파일 선택"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={busy}
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {file ? (
              <p className="min-w-0 truncate text-xs text-ink/50">
                {file.name}
                <span className="hidden sm:inline"> · {formatMb(file.size)}MB</span>
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-forest px-4 py-2 text-sm text-cream sm:w-fit disabled:opacity-60"
          >
            {busy ? "올리는 중…" : "올리기"}
          </button>
          {message ? <p className="text-sm text-forest">{message}</p> : null}
        </div>
      </form>

      <div className="min-w-0 space-y-4">
        {filterBar}

        {visible.length === 0 ? (
          <p className="text-sm text-ink/50">이 구분에 사진이 없습니다.</p>
        ) : (
          <>
            <section className="hidden min-w-0 space-y-3 md:block" aria-label="등록된 사진 미리보기">
              <p className="text-center text-sm text-ink/55">
                {safeIndex + 1} / {total}
                {current?.title ? ` · ${current.title}` : ""}
                <span className="hidden lg:inline"> · 사진을 클릭하면 크게 볼 수 있습니다</span>
              </p>
              <div className="relative w-full max-w-full overflow-hidden rounded-xl border border-line bg-cream/40 p-2">
                <div className="relative grid grid-cols-5 gap-2">
                  {stripItems.map((item, i) => {
                    const itemIndex = stripStart + i;
                    const selected = itemIndex === safeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-lg bg-ink/5 ring-offset-2 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                          selected ? "ring-2 ring-brand" : "ring-1 ring-ink/15"
                        }`}
                        aria-label={`${itemIndex + 1}번 사진 크게 보기`}
                        onClick={() => openModalAt(itemIndex)}
                      >
                        <GalleryThumbImage
                          src={item.src}
                          slug={item.id}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          {itemIndex + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {total > STRIP_SIZE ? (
                  <>
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 z-[1] flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white shadow-md disabled:opacity-30"
                      aria-label="이전 5장"
                      disabled={!canStripPrev}
                      onClick={() => setStripStart((s) => Math.max(0, s - STRIP_SIZE))}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 z-[1] flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white shadow-md disabled:opacity-30"
                      aria-label="다음 5장"
                      disabled={!canStripNext}
                      onClick={() => setStripStart((s) => Math.min(maxStripStart, s + STRIP_SIZE))}
                    >
                      ›
                    </button>
                  </>
                ) : null}
              </div>

              <DecadePager
                total={total}
                index={safeIndex}
                onGo={setViewIndex}
                itemLabel={(n) => `${n}번 사진`}
                label="등록된 사진"
              />

              {current ? (
                <div className="space-y-2 rounded-lg border border-line bg-white p-4">{itemEditor(current)}</div>
              ) : null}

              <GallerySlideModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                items={visible.map((item) => ({ src: item.src, alt: item.title }))}
                index={safeIndex}
                onIndexChange={setViewIndex}
              />
            </section>

            <ul className="grid gap-4 sm:grid-cols-2 md:hidden">
              {visible.map((item) => (
                <li key={item.id} className="min-w-0 space-y-2 rounded-lg border border-line bg-white p-3">
                  <GalleryThumbImage
                    src={item.src}
                    slug={item.id}
                    alt={item.title}
                    className="aspect-[4/3] w-full rounded-md object-cover"
                  />
                  {itemEditor(item)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function GalleryItemActions({
  item,
  busy,
  onSave,
  onDelete,
  onDownload,
}: {
  item: AdminGalleryItem;
  busy: boolean;
  onSave: (item: AdminGalleryItem) => void;
  onDelete: (id: string) => void;
  onDownload: (item: AdminGalleryItem) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={busy}
        className="rounded bg-forest px-3 py-1.5 text-xs text-cream disabled:opacity-60"
        onClick={() => void onSave(item)}
      >
        저장
      </button>
      <button
        type="button"
        disabled={busy}
        className="rounded border border-ink/15 bg-white px-3 py-1.5 text-xs disabled:opacity-60"
        onClick={() => void onDelete(item.id)}
      >
        삭제
      </button>
      <button
        type="button"
        disabled={busy}
        className="rounded border border-ink/15 bg-white px-3 py-1.5 text-xs disabled:opacity-60"
        onClick={() => void onDownload(item)}
      >
        다운로드
      </button>
    </div>
  );
}