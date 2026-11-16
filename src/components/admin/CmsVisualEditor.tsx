"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { saveContent, saveContentInline } from "@/app/admin/actions";
import { HomeCmsCanvas } from "@/components/admin/HomeCmsCanvas";
import { FontScaleModal } from "@/components/admin/FontScaleModal";
import { MediaPickerModal, type CmsMediaOption } from "@/components/admin/MediaPickerModal";
import type { EditorField } from "@/lib/content";
import { fieldLabelFor, type CmsPageDef } from "@/lib/cms-pages";
import { resolveHeroImageSrc, parseHomeScale } from "@/lib/home-hero";

const langs = [
  { key: "ko" as const, label: "한국어" },
  { key: "zh" as const, label: "中文" },
  { key: "en" as const, label: "English" },
];

const HOME_CMS_PATHS = [
  "home.heroImage",
  "home.kicker",
  "home.kickerScale",
  "home.headline",
  "home.headlineScale",
  "home.lede",
] as const;

type HomeSlot = (typeof HOME_CMS_PATHS)[number];

function fieldValue(field: EditorField, lang: "ko" | "zh" | "en") {
  if (lang === "zh") return field.zh;
  if (lang === "en") return field.en;
  return field.ko;
}

function scalePathFor(textPath: string) {
  if (textPath === "home.kicker") return "home.kickerScale";
  if (textPath === "home.headline") return "home.headlineScale";
  return null;
}

function textareaRows(path: string, multiline: boolean) {
  if (path === "home.kicker") return 2;
  if (path === "home.headline") return 4;
  if (multiline) return 6;
  return 2;
}

export function CmsVisualEditor({
  page,
  fields,
  returnTo,
  notice,
  noticeError,
  submenuPages,
  mediaOptions = [],
}: {
  page: CmsPageDef;
  fields: EditorField[];
  returnTo: string;
  notice?: string;
  noticeError?: boolean;
  submenuPages: CmsPageDef[];
  mediaOptions?: CmsMediaOption[];
}) {
  const isHome = page.key === "home";
  const editorFields = useMemo(
    () =>
      isHome
        ? fields.filter((f) => (HOME_CMS_PATHS as readonly string[]).includes(f.path))
        : fields,
    [fields, isHome],
  );

  const defaultPath =
    editorFields.find((f) => f.path.endsWith(".body"))?.path ??
    editorFields.find((f) => f.path.endsWith(".headline") || f.path.endsWith(".title"))?.path ??
    editorFields[0]?.path ??
    "";

  const [slot, setSlot] = useState(defaultPath);
  const [lang, setLang] = useState<"ko" | "zh" | "en">("ko");
  const [iframeKey, setIframeKey] = useState(0);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inlineNotice, setInlineNotice] = useState<{ text: string; error?: boolean } | null>(
    null,
  );

  const active = useMemo(
    () => editorFields.find((f) => f.path === slot) ?? editorFields[0],
    [editorFields, slot],
  );

  const valueByPath = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of editorFields) map[f.path] = f.ko;
    return map;
  }, [editorFields]);

  const [draft, setDraft] = useState(valueByPath);
  useEffect(() => setDraft(valueByPath), [valueByPath]);

  const slotTitle = active
    ? `${fieldLabelFor(page, active.path)} \`${active.path.split(".").slice(-2).join(".")}\``
    : "";

  const multiline =
    active?.path === "home.kicker" ||
    active?.path === "home.headline" ||
    Boolean(active?.multiline) ||
    Boolean(active?.path.endsWith(".body")) ||
    Boolean(active?.path.endsWith(".lede")) ||
    Boolean(active?.path.endsWith(".text"));

  const isScaleField = active?.path.endsWith("Scale");
  const isHeroField = active?.path === "home.heroImage";

  const persistKoFields = useCallback(
    async (fields: Record<string, string>) => {
      setSaving(true);
      setInlineNotice(null);
      const fd = new FormData();
      fd.set("section", page.section);
      for (const [path, ko] of Object.entries(fields)) {
        fd.set(`ko:${encodeURIComponent(path)}`, ko);
      }
      try {
        const result = await saveContentInline(fd);
        setInlineNotice({
          text: result.message,
          error: result.status === "error",
        });
      } catch {
        setInlineNotice({ text: "저장하지 못했습니다.", error: true });
      } finally {
        setSaving(false);
      }
    },
    [page.section],
  );

  const submitQuick = (path: string, koValue: string) => {
    void persistKoFields({ [path]: koValue });
  };

  const openBackgroundPicker = () => {
    setSlot("home.heroImage");
    setMediaOpen(true);
  };

  const handleHomeSlot = (key: HomeSlot) => {
    setSlot(key);
    if (key === "home.heroImage") setMediaOpen(true);
  };

  const openScaleModal = () => {
    if (!active) return;
    const scalePath = scalePathFor(active.path) ?? active.path;
    if (!scalePath.endsWith("Scale")) return;
    setSlot(scalePath);
    setScaleOpen(true);
  };

  const currentScaleValue = () => {
    const path = active?.path.endsWith("Scale") ? active.path : scalePathFor(active?.path ?? "");
    if (!path) return 100;
    return parseHomeScale(draft[path] ?? "100");
  };

  const heroSrc = resolveHeroImageSrc(draft["home.heroImage"]);

  const showNotice = inlineNotice?.text ?? notice;
  const showNoticeError = inlineNotice ? inlineNotice.error : noticeError;

  return (
    <div className={isHome ? "" : "grid gap-3"}>
      {showNotice ? (
        <p
          className={`text-xs ${isHome ? "px-3 pt-2 sm:px-4" : ""} ${showNoticeError ? "text-red-800" : "text-forest"}`}
        >
          {showNotice}
        </p>
      ) : null}

      <div
        className={
          isHome
            ? "grid items-start xl:grid-cols-[minmax(0,1fr)_17.5rem]"
            : "mx-auto grid max-w-[96rem] items-start gap-3 px-2 py-2 sm:px-4 xl:grid-cols-[minmax(0,1fr)_17.5rem]"
        }
      >
        <div className={isHome ? "overflow-hidden bg-white" : "overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm"}>
          {!isHome ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-3 py-2">
              <p className="text-[11px] font-medium text-brand-ink">{page.label} 수정</p>
              <a
                href={page.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-brand hover:underline"
              >
                공개 보기
              </a>
            </div>
          ) : null}
          {isHome ? (
            <HomeCmsCanvas
              compact
              heroSrc={heroSrc}
              kicker={draft["home.kicker"] ?? ""}
              headline={draft["home.headline"] ?? ""}
              kickerScale={draft["home.kickerScale"] ?? "100"}
              headlineScale={draft["home.headlineScale"] ?? "100"}
              activeSlot={
                slot === "home.heroImage" || slot === "home.kicker" || slot === "home.headline"
                  ? slot
                  : null
              }
              onSelectSlot={handleHomeSlot}
              onPickBackground={openBackgroundPicker}
            />
          ) : (
            <iframe
              key={`${page.key}-${iframeKey}`}
              title={`${page.label} preview`}
              src={page.preview}
              className="h-[min(70vh,44rem)] w-full bg-white"
            />
          )}
        </div>

        <aside
          className={
            isHome
              ? "sticky top-14 z-20 flex max-h-[calc(100dvh-3.5rem)] flex-col border-l border-line bg-white"
              : "sticky top-14 flex max-h-[calc(100dvh-3.5rem)] flex-col rounded-xl border border-ink/10 bg-white shadow-sm"
          }
        >
          <div className="border-b border-ink/10 px-3 py-2">
            <p className="text-[11px] font-semibold text-brand-ink">슬롯 편집</p>
            <p className="mt-0.5 truncate text-[10px] text-ink/45">{slotTitle}</p>
          </div>

          {isHome ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={openBackgroundPicker}
                className="w-full rounded-md bg-brand px-2 py-2 text-[12px] font-medium text-white hover:opacity-95"
              >
                배경 이미지 선택
              </button>
              <p className="mt-1 truncate text-[10px] text-ink/45">
                {draft["home.heroImage"]
                  ? draft["home.heroImage"].startsWith("/")
                    ? draft["home.heroImage"]
                    : `미디어 ${draft["home.heroImage"]}`
                  : "기본 숲 이미지"}
              </p>
            </div>
          ) : null}

          <div className="border-b border-ink/10 px-2 py-2">
            <label className="grid gap-1 text-[10px] text-ink/50">
              편집 슬롯
              <select
                value={active?.path ?? ""}
                onChange={(e) => setSlot(e.target.value)}
                className="rounded border border-ink/15 bg-white px-2 py-1.5 text-[12px] text-brand-ink"
              >
                {editorFields.map((field) => (
                  <option key={field.path} value={field.path}>
                    {fieldLabelFor(page, field.path)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isHeroField ? (
            <div className="border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="w-full rounded-md border border-ink/15 bg-ink/5 px-2 py-2 text-[12px] text-brand hover:bg-brand/5"
              >
                갤러리에서 이미지 선택
              </button>
            </div>
          ) : null}

          {(active && (scalePathFor(active.path) || isScaleField)) && !isHeroField ? (
            <div className="border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={openScaleModal}
                className="w-full rounded-md border border-ink/15 bg-ink/5 px-2 py-2 text-[12px] text-brand hover:bg-brand/5"
              >
                글자 크기 ({currentScaleValue()}%)
              </button>
            </div>
          ) : null}

          {!isHeroField && !isScaleField ? (
            <div className="flex gap-1 border-b border-ink/10 px-2 py-2">
              {langs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLang(item.key)}
                  className={`rounded px-2 py-1 text-[11px] ${
                    lang === item.key ? "bg-forest text-cream" : "text-ink/55 hover:bg-ink/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {active && !isHeroField && !isScaleField ? (
            <form
              action={isHome ? undefined : saveContent}
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={
                isHome
                  ? (e) => {
                      e.preventDefault();
                      if (saving || !active) return;
                      void persistKoFields({
                        [active.path]: draft[active.path] ?? active.ko,
                      });
                    }
                  : undefined
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  e.currentTarget.requestSubmit();
                }
              }}
            >
              <input type="hidden" name="section" value={page.section} />
              {!isHome ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
                {langs.map((item) => {
                  const name = `${item.key}:${encodeURIComponent(active.path)}`;
                  const value = draft[active.path] ?? fieldValue(active, item.key);
                  const show = lang === item.key;
                  const submitValue =
                    item.key === "ko" ? value : lang === item.key ? fieldValue(active, item.key) : "";
                  return show ? (
                    <label key={name} className="grid gap-1 text-[11px] text-ink/60">
                      내용 ({item.key})
                      {multiline ? (
                        <textarea
                          name={name}
                          defaultValue={submitValue}
                          onChange={(e) => {
                            if (item.key === "ko")
                              setDraft((d) => ({ ...d, [active.path]: e.target.value }));
                          }}
                          rows={textareaRows(active.path, multiline)}
                          className="max-h-36 w-full resize-y rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] leading-6 outline-none focus:border-forest"
                        />
                      ) : (
                        <input
                          name={name}
                          defaultValue={submitValue}
                          onChange={(e) => {
                            if (item.key === "ko")
                              setDraft((d) => ({ ...d, [active.path]: e.target.value }));
                          }}
                          onKeyDown={(e) => {
                            if (
                              !isHome &&
                              e.key === "Enter" &&
                              !e.ctrlKey &&
                              !e.metaKey &&
                              !e.shiftKey
                            ) {
                              e.preventDefault();
                              e.currentTarget.form?.requestSubmit();
                            }
                          }}
                          className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] outline-none focus:border-forest"
                        />
                      )}
                    </label>
                  ) : item.key === "ko" && lang !== "ko" ? (
                    <input
                      key={name}
                      type="hidden"
                      name={`ko:${encodeURIComponent(active.path)}`}
                      defaultValue={draft[active.path] ?? active.ko}
                    />
                  ) : (
                    <input key={name} type="hidden" name={name} defaultValue="" />
                  );
                })}
              </div>

              <div className="shrink-0 space-y-2 border-t border-ink/10 bg-white p-3">
                <p className="text-[10px] leading-4 text-ink/40">
                  {multiline
                    ? "Enter 줄바꿈 · Ctrl+Enter 저장"
                    : isHome
                      ? "Ctrl+Enter 저장"
                      : "Enter 저장"}
                  {isHome ? "" : ". 한국어만 수정해도 영·중문이 맞춰집니다."}
                </p>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-md bg-forest px-3 py-2.5 text-[12px] font-medium tracking-wide text-cream hover:opacity-95 disabled:opacity-60"
                >
                  {saving ? "저장 중…" : "저장"}
                </button>
              </div>
            </form>
          ) : isScaleField ? (
            <p className="p-3 text-[11px] leading-5 text-ink/50">
              「글자 크기」에서 0~200%를 고르세요. 선택하면 저장됩니다.
            </p>
          ) : isHeroField ? (
            <p className="p-3 text-[11px] leading-5 text-ink/50">
              미리보기 배경을 클릭하거나 위 버튼으로 이미지를 선택하세요.
            </p>
          ) : (
            <p className="p-3 text-[11px] text-ink/45">편집할 문구가 없습니다.</p>
          )}
        </aside>
      </div>

      <MediaPickerModal
        open={mediaOpen}
        options={mediaOptions}
        currentSlug={draft["home.heroImage"] ?? ""}
        onClose={() => setMediaOpen(false)}
        onSelect={(slug) => {
          setDraft((d) => ({ ...d, "home.heroImage": slug }));
          submitQuick("home.heroImage", slug);
        }}
      />

      <FontScaleModal
        open={scaleOpen}
        value={currentScaleValue()}
        onClose={() => setScaleOpen(false)}
        onSelect={(percent) => {
          const path =
            active?.path.endsWith("Scale") ? active.path : scalePathFor(active?.path ?? "") ?? "home.headlineScale";
          setDraft((d) => ({ ...d, [path]: String(percent) }));
          setScaleOpen(false);
          submitQuick(path, String(percent));
        }}
      />
    </div>
  );
}