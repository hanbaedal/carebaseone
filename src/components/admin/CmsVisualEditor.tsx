"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveContentInline } from "@/app/admin/actions";
import { HomeCmsCanvas } from "@/components/admin/HomeCmsCanvas";
import { FontFamilyModal } from "@/components/admin/FontFamilyModal";
import { FontScaleModal } from "@/components/admin/FontScaleModal";
import { FontScaleStepper } from "@/components/admin/FontScaleStepper";
import { MediaPickerModal, type CmsMediaOption } from "@/components/admin/MediaPickerModal";
import { TextColorModal } from "@/components/admin/TextColorModal";
import { FooterBgModal } from "@/components/admin/FooterBgModal";
import { CmsFooterStrip } from "@/components/admin/CmsFooterStrip";
import type { KoCmsField } from "@/lib/content";
import { fieldLabelFor, type CmsPageDef } from "@/lib/cms-pages";
import {
  colorPathFor,
  defaultColorForTextPath,
  defaultFontForTextPath,
  fontPathFor,
  clampHomeScale,
  homeFontLabel,
  resolveHeroImageSrc,
  resolveHomeTextColorHex,
  parseHomeScale,
  type HomeFontId,
  type HomeTextColorId,
} from "@/lib/home-hero";
import {
  PAGE_FOOTER_BG_DEFAULT,
  pageFooterBgLabel,
  pageFooterPaths,
} from "@/lib/page-footer";

const HOME_CMS_PATHS = [
  "home.heroImage",
  "home.kicker",
  "home.kickerFont",
  "home.kickerScale",
  "home.kickerColor",
  "home.headline",
  "home.headlineFont",
  "home.headlineScale",
  "home.headlineColor",
  "home.lede",
  "home.footerBg",
  "home.footerText",
] as const;

type HomeSlot = (typeof HOME_CMS_PATHS)[number];

function scalePathFor(textPath: string) {
  if (textPath === "home.kicker") return "home.kickerScale";
  if (textPath === "home.headline") return "home.headlineScale";
  return null;
}

function textareaRows(path: string, multiline: boolean) {
  if (path === "home.kicker") return 2;
  if (path === "home.headline") return 4;
  if (path.endsWith("footerText")) return 6;
  if (multiline) return 6;
  return 2;
}

const HOME_TEXT_PATHS = new Set(["home.kicker", "home.headline", "home.lede", "home.footerText"]);

function resolveHomeTextSlot(path: string) {
  if (path === "home.kickerScale" || path === "home.kickerFont" || path === "home.kickerColor")
    return "home.kicker";
  if (path === "home.headlineScale" || path === "home.headlineFont" || path === "home.headlineColor")
    return "home.headline";
  if (HOME_TEXT_PATHS.has(path)) return path;
  return null;
}

type HomePreviewSlot = "home.heroImage" | "home.kicker" | "home.headline" | "home.footerText";

function resolvePreviewActiveSlot(
  slot: string,
  homeTextPath: string | null,
  pin: HomePreviewSlot | null,
): HomePreviewSlot | null {
  if (pin === "home.kicker" || pin === "home.headline") return pin;
  if (slot === "home.heroImage") return "home.heroImage";
  if (
    homeTextPath === "home.kicker" ||
    homeTextPath === "home.headline" ||
    homeTextPath === "home.footerText"
  )
    return homeTextPath;
  if (slot === "home.footerText") return "home.footerText";
  return null;
}

function textPathForScaleField(scalePath: string | null | undefined) {
  if (scalePath === "home.kickerScale") return "home.kicker";
  if (scalePath === "home.headlineScale") return "home.headline";
  return null;
}

export function CmsVisualEditor({
  page,
  fields,
  notice,
  noticeError,
  previewFocus,
  mediaOptions: mediaOptionsProp = [],
}: {
  page: CmsPageDef;
  fields: KoCmsField[];
  previewFocus?: string;
  notice?: string;
  noticeError?: boolean;
  mediaOptions?: CmsMediaOption[];
}) {
  const isHome = page.key === "home";
  const router = useRouter();
  const [mediaOptions, setMediaOptions] = useState<CmsMediaOption[]>(mediaOptionsProp);
  const mediaFetchStarted = useRef(false);
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
  const [iframeKey, setIframeKey] = useState(0);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [footerBgOpen, setFooterBgOpen] = useState(false);
  const [previewPin, setPreviewPin] = useState<HomePreviewSlot | null>(null);
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

  useEffect(() => {
    if (!mediaOpen || mediaFetchStarted.current) return;
    mediaFetchStarted.current = true;
    void fetch("/api/admin/cms-media")
      .then((res) => (res.ok ? res.json() : []))
      .then((items: CmsMediaOption[]) => {
        if (Array.isArray(items) && items.length > 0) {
          setMediaOptions((prev) => [...prev, ...items]);
        }
      })
      .catch(() => {
        mediaFetchStarted.current = false;
      });
  }, [mediaOpen]);

  useEffect(() => {
    if (!isHome) return;
    if (slot === "home.kickerScale" || slot === "home.kickerColor" || slot === "home.kickerFont")
      setSlot("home.kicker");
    if (slot === "home.headlineScale" || slot === "home.headlineColor" || slot === "home.headlineFont")
      setSlot("home.headline");
  }, [isHome, slot]);

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
  const homeTextPath = isHome ? resolveHomeTextSlot(slot) : null;
  const textField = useMemo(
    () => (homeTextPath ? editorFields.find((f) => f.path === homeTextPath) : active),
    [homeTextPath, editorFields, active],
  );
  const linkedScalePath = homeTextPath ? scalePathFor(homeTextPath) : null;
  const linkedColorPath = homeTextPath ? colorPathFor(homeTextPath) : null;
  const linkedFontPath = homeTextPath ? fontPathFor(homeTextPath) : null;
  const colorFallback =
    homeTextPath && (homeTextPath === "home.kicker" || homeTextPath === "home.headline")
      ? defaultColorForTextPath(homeTextPath)
      : "blue";

  const footerPaths = pageFooterPaths(page.section);
  const hasPageFooter = useMemo(
    () =>
      editorFields.some((f) => f.path === footerPaths.bg) &&
      editorFields.some((f) => f.path === footerPaths.text),
    [editorFields, footerPaths.bg, footerPaths.text],
  );
  const isFooterBgField = active?.path === footerPaths.bg;

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
        if (result.status !== "error") router.refresh();
      } catch {
        setInlineNotice({ text: "저장하지 못했습니다.", error: true });
      } finally {
        setSaving(false);
      }
    },
    [page.section, router],
  );

  const buildSavePayload = useCallback((): Record<string, string> => {
    if (isHome) {
      const payload: Record<string, string> = {};
      for (const path of HOME_CMS_PATHS) {
        payload[path] = draft[path] ?? valueByPath[path] ?? "";
      }
      return payload;
    }
    const payload: Record<string, string> = {};
    for (const field of editorFields) {
      payload[field.path] = draft[field.path] ?? valueByPath[field.path] ?? "";
    }
    return payload;
  }, [draft, editorFields, isHome, valueByPath]);

  const handleSave = () => {
    if (saving) return;
    const payload = buildSavePayload();
    if (Object.keys(payload).length === 0) return;
    void persistKoFields(payload);
  };

  const openBackgroundPicker = () => {
    setPreviewPin(null);
    setSlot("home.heroImage");
    setMediaOpen(true);
  };

  const pinPreviewForTextTools = () => {
    if (homeTextPath === "home.kicker" || homeTextPath === "home.headline") {
      setPreviewPin(homeTextPath);
      setSlot(homeTextPath);
    }
  };

  const handleHomeSlot = (key: HomeSlot) => {
    setPreviewPin(null);
    setSlot(key);
    if (key === "home.heroImage") setMediaOpen(true);
  };

  const openScalePicker = () => {
    if (!linkedScalePath && !scalePathFor(active?.path ?? "") && !active?.path.endsWith("Scale")) {
      return;
    }
    if (isHome) pinPreviewForTextTools();
    setScaleOpen(true);
  };

  const currentScaleValue = () => {
    const path = linkedScalePath ?? (active?.path.endsWith("Scale") ? active.path : scalePathFor(active?.path ?? ""));
    if (!path) return 100;
    return parseHomeScale(draft[path] ?? "100");
  };

  const pickScale = (percent: number) => {
    const next = clampHomeScale(percent);
    const path =
      linkedScalePath ??
      (active?.path.endsWith("Scale") ? active.path : scalePathFor(active?.path ?? ""));
    if (!path?.endsWith("Scale")) return;
    const textPath =
      previewPin ??
      (homeTextPath === "home.kicker" || homeTextPath === "home.headline" ? homeTextPath : null) ??
      textPathForScaleField(path);
    if (isHome) pinPreviewForTextTools();
    setDraft((d) => ({ ...d, [path]: String(next) }));
    setScaleOpen(false);
    if (isHome && textPath) {
      setPreviewPin(textPath);
      setSlot(textPath);
    }
  };

  const pickFont = (fontId: HomeFontId) => {
    if (!linkedFontPath) return;
    const textPath =
      previewPin ??
      (homeTextPath === "home.kicker" || homeTextPath === "home.headline" ? homeTextPath : null);
    setDraft((d) => ({ ...d, [linkedFontPath]: fontId }));
    if (isHome && textPath) {
      setPreviewPin(textPath);
      setSlot(textPath);
    }
  };

  const pickFooterBg = (bgId: string) => {
    setDraft((d) => ({ ...d, [footerPaths.bg]: bgId }));
    setSlot(footerPaths.text);
  };

  const pickColor = (colorId: HomeTextColorId) => {
    if (!linkedColorPath) return;
    const textPath =
      previewPin ??
      (homeTextPath === "home.kicker" || homeTextPath === "home.headline" ? homeTextPath : null);
    setDraft((d) => ({ ...d, [linkedColorPath]: colorId }));
    if (isHome && textPath) {
      setPreviewPin(textPath);
      setSlot(textPath);
    }
  };

  const heroSrc = resolveHeroImageSrc(draft["home.heroImage"]);
  const previewSrc =
    page.key === "product" && previewFocus ? `${page.preview}#${previewFocus}` : page.preview;
  const previewActiveSlot = isHome
    ? resolvePreviewActiveSlot(slot, homeTextPath, previewPin)
    : null;

  const showNotice = inlineNotice?.text ?? notice;
  const showNoticeError = inlineNotice ? inlineNotice.error : noticeError;

  const showTextEditor =
    (isHome && homeTextPath && textField) ||
    Boolean(active && !isHeroField && !isScaleField && !isFooterBgField);

  const showSaveFooter = editorFields.length > 0;

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
        <div
          className={
            isHome
              ? "flex h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden bg-white"
              : "overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm"
          }
        >
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
              kickerColor={draft["home.kickerColor"] ?? "blue"}
              headlineColor={draft["home.headlineColor"] ?? "black"}
              kickerFont={draft["home.kickerFont"] ?? "gothic"}
              headlineFont={draft["home.headlineFont"] ?? "gothic"}
              footerBg={draft["home.footerBg"] ?? "white"}
              footerText={draft["home.footerText"] ?? ""}
              activeSlot={previewActiveSlot}
              onSelectSlot={handleHomeSlot}
              onPickBackground={openBackgroundPicker}
            />
          ) : (
            <div className="flex flex-col bg-white">
              <iframe
                key={`${page.key}-${iframeKey}`}
                title={`${page.label} preview`}
                src={previewSrc}
                className="h-[min(70vh,44rem)] w-full bg-white"
              />
              {hasPageFooter ? (
                <CmsFooterStrip
                  bgId={draft[footerPaths.bg] ?? "white"}
                  text={draft[footerPaths.text] ?? ""}
                  active={slot === footerPaths.text}
                  onClick={() => {
                    setPreviewPin(null);
                    setSlot(footerPaths.text);
                  }}
                />
              ) : null}
            </div>
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
                onChange={(e) => {
                  setPreviewPin(null);
                  setSlot(e.target.value);
                }}
                className="rounded border border-ink/15 bg-white px-2 py-1.5 text-[12px] text-brand-ink"
              >
                {editorFields
                  .filter(
                    (field) =>
                      !(
                        isHome &&
                        (field.path.endsWith("Scale") ||
                          field.path.endsWith("Color") ||
                          field.path.endsWith("Font") ||
                          field.path.endsWith("footerBg"))
                      ),
                  )
                  .map((field) => (
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

          {hasPageFooter ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={() => setFooterBgOpen(true)}
                className="w-full rounded-md border border-ink/15 bg-ink/5 px-2 py-2 text-[12px] text-brand hover:bg-brand/5"
              >
                풋터 배경색 (
                {pageFooterBgLabel(draft[footerPaths.bg] ?? "", PAGE_FOOTER_BG_DEFAULT)})
              </button>
            </div>
          ) : null}

          {isHome && linkedFontPath && homeTextPath && !isHeroField ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  pinPreviewForTextTools();
                  setFontOpen(true);
                }}
                className="w-full rounded-md border border-ink/15 bg-ink/5 px-2 py-2 text-[12px] text-brand hover:bg-brand/5"
              >
                글자 폰트 (
                {homeFontLabel(
                  linkedFontPath ? (draft[linkedFontPath] ?? "") : "",
                  defaultFontForTextPath(homeTextPath),
                )}
                )
              </button>
            </div>
          ) : null}

          {isHome && linkedScalePath && !isHeroField ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <FontScaleStepper value={currentScaleValue()} onChange={pickScale} />
              <p className="mt-1 text-[10px] text-ink/45">100% = 기준 크기 · 50~300% (10% 단위)</p>
            </div>
          ) : null}

          {!isHome &&
          (scalePathFor(active?.path ?? "") || isScaleField) &&
          !isHeroField ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={openScalePicker}
                className="w-full rounded-md border border-ink/15 bg-ink/5 px-2 py-2 text-[12px] text-brand hover:bg-brand/5"
              >
                글자 크기 ({currentScaleValue()}%)
              </button>
            </div>
          ) : null}

          {isHome && linkedColorPath && homeTextPath && !isHeroField ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-brand-ink">글자 컬러</span>
                <button
                  type="button"
                  onClick={() => {
                    pinPreviewForTextTools();
                    setColorOpen(true);
                  }}
                  aria-label="글자 컬러 선택"
                  className="h-8 w-8 shrink-0 rounded-md border border-ink/20 shadow-sm ring-brand transition hover:ring-2"
                  style={{
                    backgroundColor: resolveHomeTextColorHex(
                      draft[linkedColorPath],
                      defaultColorForTextPath(homeTextPath),
                    ),
                  }}
                />
              </div>
            </div>
          ) : null}

          {showTextEditor ? (
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            >
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
                {(() => {
                  const editPath = isHome && homeTextPath ? homeTextPath : active!.path;
                  const field = isHome && textField ? textField : active!;
                  const value = draft[editPath] ?? field.ko;
                  const editMultiline =
                    editPath.endsWith("footerText") ||
                    (isHome && homeTextPath
                      ? homeTextPath === "home.kicker" ||
                        homeTextPath === "home.headline" ||
                        field.multiline
                      : multiline);
                  return (
                    <label className="grid gap-1 text-[11px] text-ink/60">
                      내용 (한국어)
                      {editMultiline ? (
                        <textarea
                          value={value}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, [editPath]: e.target.value }))
                          }
                          rows={textareaRows(editPath, editMultiline)}
                          className="max-h-36 w-full resize-y rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] leading-6 outline-none focus:border-forest"
                        />
                      ) : (
                        <input
                          value={value}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, [editPath]: e.target.value }))
                          }
                          className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] outline-none focus:border-forest"
                        />
                      )}
                    </label>
                  );
                })()}
              </div>
            </form>
          ) : isScaleField && !isHome ? (
            <p className="p-3 text-[11px] leading-5 text-ink/50">
              「글자 크기」에서 50~300%를 고른 뒤 저장 버튼을 누르세요.
            </p>
          ) : isHeroField ? (
            <p className="p-3 text-[11px] leading-5 text-ink/50">
              미리보기 배경을 클릭하거나 위 버튼으로 이미지를 선택한 뒤 저장하세요.
            </p>
          ) : (
            <p className="p-3 text-[11px] text-ink/45">편집할 문구가 없습니다.</p>
          )}

          {showSaveFooter ? (
            <div className="mt-auto shrink-0 border-t border-ink/10 bg-white p-3">
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="w-full rounded-md bg-forest px-3 py-2.5 text-[12px] font-medium tracking-wide text-cream hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "저장 중…" : "저장"}
              </button>
            </div>
          ) : null}
        </aside>
      </div>

      <MediaPickerModal
        open={mediaOpen}
        options={mediaOptions}
        currentSlug={draft["home.heroImage"] ?? ""}
        onClose={() => setMediaOpen(false)}
        onSelect={(slug) => {
          setDraft((d) => ({ ...d, "home.heroImage": slug }));
        }}
      />

      <FooterBgModal
        open={footerBgOpen}
        value={draft[footerPaths.bg] ?? ""}
        onClose={() => setFooterBgOpen(false)}
        onSelect={pickFooterBg}
      />

      <FontFamilyModal
        open={fontOpen}
        value={linkedFontPath ? (draft[linkedFontPath] ?? "") : ""}
        fallback={
          homeTextPath && (homeTextPath === "home.kicker" || homeTextPath === "home.headline")
            ? defaultFontForTextPath(homeTextPath)
            : "gothic"
        }
        onClose={() => setFontOpen(false)}
        onSelect={pickFont}
      />

      <TextColorModal
        open={colorOpen}
        value={linkedColorPath ? (draft[linkedColorPath] ?? "") : ""}
        fallback={colorFallback}
        onClose={() => setColorOpen(false)}
        onSelect={pickColor}
      />

      {!isHome ? (
        <FontScaleModal
          open={scaleOpen}
          value={currentScaleValue()}
          onClose={() => setScaleOpen(false)}
          onSelect={pickScale}
        />
      ) : null}
    </div>
  );
}