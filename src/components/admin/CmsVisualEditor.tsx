"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveContentInline } from "@/app/admin/actions";
import { HomeCmsCanvas } from "@/components/admin/HomeCmsCanvas";
import { SubpageCmsCanvas } from "@/components/admin/SubpageCmsCanvas";
import {
  cmsUsesPublicHero,
  resolveCmsVisualBody,
} from "@/components/admin/resolveCmsVisualBody";
import { FontFamilyModal } from "@/components/admin/FontFamilyModal";
import { FontScaleStepper } from "@/components/admin/FontScaleStepper";
import { MediaPickerModal, type CmsMediaOption } from "@/components/admin/MediaPickerModal";
import { TextColorModal } from "@/components/admin/TextColorModal";
import { FooterBgModal } from "@/components/admin/FooterBgModal";
import type { KoCmsField } from "@/lib/content";
import { fieldLabelFor, type CmsPageDef } from "@/lib/cms-pages";
import {
  cmsContentFieldPaths,
  cmsHeroSlots,
  resolveCmsPageHeroSrc,
} from "@/lib/cms-page-hero";
import {
  isCmsTypoTextPath,
  resolveCmsTypoTextSlot,
  sectionHeroImagePath,
} from "@/lib/cms-typography";
import {
  colorPathFor,
  defaultColorForTextPath,
  defaultFontForTextPath,
  fontPathFor,
  scalePathFor,
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
import { filterHubCanvasContentPaths } from "@/lib/cms-hub-pages";

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
  "home.ledeFont",
  "home.ledeScale",
  "home.ledeColor",
  "home.footerBg",
] as const;

type HomeSlot = (typeof HOME_CMS_PATHS)[number];

function textareaRows(path: string, multiline: boolean) {
  if (path === "home.kicker") return 2;
  if (path === "home.headline" || path.endsWith(".title")) return 4;
  if (multiline) return 6;
  return 2;
}

function isMetaEditorPath(path: string) {
  return (
    path.endsWith("Scale") ||
    path.endsWith("Color") ||
    path.endsWith("Font") ||
    path.endsWith("footerBg") ||
    path.endsWith("heroImage")
  );
}

type HomePreviewSlot = "home.heroImage" | "home.kicker" | "home.headline" | "home.lede";

function resolvePreviewActiveSlot(
  slot: string,
  typoTextPath: string | null,
  pin: HomePreviewSlot | null,
): HomePreviewSlot | null {
  if (pin === "home.kicker" || pin === "home.headline") return pin;
  if (slot === "home.heroImage") return "home.heroImage";
  if (
    typoTextPath === "home.kicker" ||
    typoTextPath === "home.headline" ||
    typoTextPath === "home.lede"
  )
    return typoTextPath as HomePreviewSlot;
  if (slot === "home.lede") return "home.lede";
  return null;
}

export function CmsVisualEditor({
  page,
  fields,
  notice,
  noticeError,
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
  const usePublicHero = cmsUsesPublicHero(page.key);
  const router = useRouter();
  const [mediaOptions, setMediaOptions] = useState<CmsMediaOption[]>(mediaOptionsProp);
  const mediaFetchStarted = useRef(false);
  const editorFields = useMemo(() => {
    const list = isHome
      ? fields.filter((f) => (HOME_CMS_PATHS as readonly string[]).includes(f.path))
      : fields;
    return list.filter(
      (f) =>
        !f.path.endsWith("footerText") &&
        f.path !== "aboutFeatures.ctaProduct" &&
        f.path !== "aboutFeatures.ctaGreeting",
    );
  }, [fields, isHome]);

  const heroSlots = useMemo(() => cmsHeroSlots(page), [page]);
  const heroImagePath = isHome ? "home.heroImage" : sectionHeroImagePath(page.section);

  const defaultPath = useMemo(() => {
    if (page.productCategory) {
      return `product.categories.${page.productCategory}.title`;
    }
    return (
      editorFields.find((f) => f.path.endsWith(".body"))?.path ??
      editorFields.find((f) => f.path.endsWith(".headline") || f.path.endsWith(".title"))?.path ??
      heroSlots.title ??
      editorFields[0]?.path ??
      ""
    );
  }, [editorFields, heroSlots.title, page.productCategory]);

  const [slot, setSlot] = useState(defaultPath);
  const [mediaOpen, setMediaOpen] = useState(false);
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
    setSlot(defaultPath);
    setPreviewPin(null);
  }, [defaultPath, page.key]);

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
    const textPath = resolveCmsTypoTextSlot(slot);
    if (textPath && textPath !== slot) setSlot(textPath);
  }, [slot]);

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
  const isHeroField = active?.path === heroImagePath;
  const hasHeroImage = useMemo(
    () => editorFields.some((f) => f.path === heroImagePath),
    [editorFields, heroImagePath],
  );
  const typoTextPath = resolveCmsTypoTextSlot(slot);
  const textField = useMemo(
    () => (typoTextPath ? editorFields.find((f) => f.path === typoTextPath) : active),
    [typoTextPath, editorFields, active],
  );
  const linkedScalePath = typoTextPath ? scalePathFor(typoTextPath) : null;
  const linkedColorPath = typoTextPath ? colorPathFor(typoTextPath) : null;
  const linkedFontPath = typoTextPath ? fontPathFor(typoTextPath) : null;
  const showHeroTypography = Boolean(
    typoTextPath && isCmsTypoTextPath(typoTextPath) && !isHeroField,
  );
  const colorFallback = typoTextPath ? defaultColorForTextPath(typoTextPath) : "blue";

  const footerPaths = pageFooterPaths(page.section);
  const hasPageFooter = useMemo(
    () => editorFields.some((f) => f.path === footerPaths.bg),
    [editorFields, footerPaths.bg],
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
    setSlot(heroImagePath);
    setMediaOpen(true);
  };

  const pinPreviewForTextTools = () => {
    if (typoTextPath && isCmsTypoTextPath(typoTextPath)) {
      if (isHome) setPreviewPin(typoTextPath as HomePreviewSlot);
      setSlot(typoTextPath);
    }
  };

  const handleHomeSlot = (key: HomeSlot) => {
    setPreviewPin(null);
    setSlot(key);
    if (key === "home.heroImage") setMediaOpen(true);
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
      previewPin ?? (typoTextPath && isCmsTypoTextPath(typoTextPath) ? typoTextPath : null) ??
      resolveCmsTypoTextSlot(path);
    pinPreviewForTextTools();
    setDraft((d) => ({ ...d, [path]: String(next) }));
    if (textPath && isCmsTypoTextPath(textPath)) {
      if (isHome) setPreviewPin(textPath as HomePreviewSlot);
      setSlot(textPath);
    }
  };

  const pickFont = (fontId: HomeFontId) => {
    if (!linkedFontPath) return;
  const textPath =
      previewPin ?? (typoTextPath && isCmsTypoTextPath(typoTextPath) ? typoTextPath : null);
    setDraft((d) => ({ ...d, [linkedFontPath]: fontId }));
    if (textPath && isCmsTypoTextPath(textPath)) {
      if (isHome) setPreviewPin(textPath as HomePreviewSlot);
      setSlot(textPath);
    }
  };

  const pickFooterBg = (bgId: string) => {
    setDraft((d) => ({ ...d, [footerPaths.bg]: bgId }));
  };

  const pickColor = (colorId: HomeTextColorId) => {
    if (!linkedColorPath) return;
    const textPath =
      previewPin ?? (typoTextPath && isCmsTypoTextPath(typoTextPath) ? typoTextPath : null);
    setDraft((d) => ({ ...d, [linkedColorPath]: colorId }));
    if (textPath && isCmsTypoTextPath(textPath)) {
      if (isHome) setPreviewPin(textPath as HomePreviewSlot);
      setSlot(textPath);
    }
  };

  const heroSrc = resolveHeroImageSrc(draft["home.heroImage"]);
  const canvasValues = useMemo(() => {
    const map: Record<string, string> = { ...valueByPath, ...draft };
    for (const field of editorFields) {
      map[field.path] = draft[field.path] ?? valueByPath[field.path] ?? "";
    }
    return map;
  }, [draft, editorFields, valueByPath]);

  const contentPaths = useMemo(() => {
    const paths = cmsContentFieldPaths(
      editorFields.map((f) => f.path),
      heroSlots,
    );
    if (page.productCategory) {
      const prefix = `product.categories.${page.productCategory}.`;
      return paths.filter((path) => path.startsWith(prefix));
    }
    const withoutGreetingCtas =
      page.key === "greeting"
        ? paths.filter(
            (path) =>
              path !== "aboutGreeting.ctaFeatures" && path !== "aboutGreeting.ctaContact",
          )
        : paths;
    return filterHubCanvasContentPaths(page.key, withoutGreetingCtas);
  }, [editorFields, heroSlots, page.productCategory, page.key]);

  const previewActiveSlot = isHome
    ? resolvePreviewActiveSlot(slot, typoTextPath, previewPin)
    : null;

  const subpageHeroSrc = resolveCmsPageHeroSrc(page.section, canvasValues, page.key);

  const showNotice = inlineNotice?.text ?? notice;
  const showNoticeError = inlineNotice ? inlineNotice.error : noticeError;

  const showTextEditor =
    (typoTextPath && textField) ||
    Boolean(active && !isHeroField && !isScaleField && !isFooterBgField);

  const showSaveFooter = editorFields.length > 0;

  const handleSubpageSlot = (path: string) => {
    setPreviewPin(null);
    setSlot(path);
  };

  return (
    <div>
      {showNotice ? (
        <p
          className={`px-3 pt-2 text-xs sm:px-4 ${showNoticeError ? "text-red-800" : "text-forest"}`}
        >
          {showNotice}
        </p>
      ) : null}

      <div className="grid items-start xl:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="relative flex h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden bg-white">
          {!isHome ? (
            <a
              href={page.preview}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-3 z-30 rounded-md bg-white/90 px-2 py-1 text-[10px] text-brand shadow-sm ring-1 ring-ink/10 hover:underline"
            >
              공개 보기
            </a>
          ) : null}
          {isHome ? (
            <HomeCmsCanvas
              compact
              heroSrc={heroSrc}
              kicker={draft["home.kicker"] ?? ""}
              headline={draft["home.headline"] ?? ""}
              lede={draft["home.lede"] ?? ""}
              kickerScale={draft["home.kickerScale"] ?? "100"}
              headlineScale={draft["home.headlineScale"] ?? "100"}
              ledeScale={draft["home.ledeScale"] ?? "100"}
              kickerColor={draft["home.kickerColor"] ?? "blue"}
              headlineColor={draft["home.headlineColor"] ?? "black"}
              ledeColor={draft["home.ledeColor"] ?? "white"}
              kickerFont={draft["home.kickerFont"] ?? "gothic"}
              headlineFont={draft["home.headlineFont"] ?? "gothic"}
              ledeFont={draft["home.ledeFont"] ?? "myeongjo"}
              footerBg={draft["home.footerBg"] ?? "white"}
              activeSlot={previewActiveSlot}
              onSelectSlot={handleHomeSlot}
              onPickBackground={openBackgroundPicker}
            />
          ) : (
            <SubpageCmsCanvas
              page={page}
              heroSrc={subpageHeroSrc}
              hero={heroSlots}
              values={canvasValues}
              contentPaths={contentPaths}
              activeSlot={slot}
              footerBg={draft[footerPaths.bg] ?? PAGE_FOOTER_BG_DEFAULT}
              onSelectSlot={handleSubpageSlot}
              onEditFooter={() => {
                setPreviewPin(null);
                setFooterBgOpen(true);
              }}
              onPickBackground={openBackgroundPicker}
              publicHero={usePublicHero}
              body={resolveCmsVisualBody({
                page,
                values: canvasValues,
                activeSlot: slot,
                onSelectSlot: handleSubpageSlot,
              })}
            />
          )}
        </div>

        <aside className="sticky top-14 z-20 flex max-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden border-l border-line bg-white">
          <div className="border-b border-ink/10 px-3 py-2">
            <p className="text-[11px] font-semibold text-brand-ink">슬롯 편집</p>
            <p className="mt-0.5 truncate text-[10px] text-ink/45">{slotTitle}</p>
          </div>

          {hasHeroImage ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <button
                type="button"
                onClick={openBackgroundPicker}
                className="w-full rounded-md bg-brand px-2 py-2 text-[12px] font-medium text-white hover:opacity-95"
              >
                배경 이미지 선택
              </button>
              <p className="mt-1 truncate text-[10px] text-ink/45">
                {draft[heroImagePath]
                  ? draft[heroImagePath].startsWith("/")
                    ? draft[heroImagePath]
                    : `미디어 ${draft[heroImagePath]}`
                  : "기본 이미지"}
              </p>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
                  .filter((field) => !isMetaEditorPath(field.path))
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

          {showHeroTypography ? (
            <div className="shrink-0 border-b border-ink/10 bg-ink/[0.02] px-3 py-2">
              <p className="text-[10px] font-medium text-ink/55">글자 스타일</p>
            </div>
          ) : null}

          {showHeroTypography && linkedFontPath ? (
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
                  draft[linkedFontPath] ?? "",
                  defaultFontForTextPath(typoTextPath!),
                )}
                )
              </button>
            </div>
          ) : null}

          {showHeroTypography && linkedScalePath ? (
            <div className="shrink-0 border-b border-ink/10 px-3 py-2">
              <FontScaleStepper value={currentScaleValue()} onChange={pickScale} />
              <p className="mt-1 text-[10px] text-ink/45">100% = 기준 크기 · 50~300% (10% 단위)</p>
            </div>
          ) : null}

          {showHeroTypography && linkedColorPath ? (
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
                      defaultColorForTextPath(typoTextPath!),
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
                  const editPath = typoTextPath ?? active!.path;
                  const field = typoTextPath && textField ? textField : active!;
                  const value = draft[editPath] ?? field.ko;
                  const editMultiline =
                    typoTextPath === "home.kicker" ||
                    typoTextPath === "home.headline" ||
                    typoTextPath === "home.lede" ||
                    typoTextPath?.endsWith(".title") ||
                    typoTextPath?.endsWith(".body") ||
                    field.multiline ||
                    multiline;
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
          ) : isHeroField ? (
            <p className="p-3 text-[11px] leading-5 text-ink/50">
              미리보기 배경을 클릭하거나 위 버튼으로 이미지를 선택한 뒤 저장하세요.
            </p>
          ) : (
            <p className="p-3 text-[11px] text-ink/45">편집할 문구가 없습니다.</p>
          )}
          </div>

          {hasPageFooter ? (
            <div className="shrink-0 border-t border-ink/10 px-3 py-2">
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
        currentSlug={draft[heroImagePath] ?? ""}
        onClose={() => setMediaOpen(false)}
        onSelect={(slug) => {
          setDraft((d) => ({ ...d, [heroImagePath]: slug }));
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
        fallback={typoTextPath ? defaultFontForTextPath(typoTextPath) : "gothic"}
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

    </div>
  );
}