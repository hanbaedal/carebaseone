"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveContent } from "@/app/admin/actions";
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
  const quickSaveRef = useRef<HTMLFormElement>(null);

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

  const submitQuick = (path: string, koValue: string) => {
    const form = quickSaveRef.current;
    if (!form) return;
    form.querySelectorAll('input[name^="ko:"]').forEach((el) => el.remove());
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = `ko:${encodeURIComponent(path)}`;
    input.value = koValue;
    form.appendChild(input);
    form.requestSubmit();
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

  return (
    <div className="grid gap-3">
      <form ref={quickSaveRef} action={saveContent} className="hidden" aria-hidden>
        <input type="hidden" name="section" value={page.section} />
        <input type="hidden" name="returnTo" value={returnTo} />
      </form>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-brand-ink">홈페이지 CMS</h1>
          <p className="mt-1 max-w-2xl text-[11px] leading-5 text-ink/50">
            {isHome
              ? "미리보기에서 배경·문구를 클릭해 편집합니다."
              : "미리보기 URL에서 소메뉴 문구를 편집합니다."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIframeKey((n) => n + 1)}
          className="text-[11px] text-brand hover:underline"
        >
          미리보기 새로고침
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/admin/cms?page=home"
          className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${
            page.tab === "main"
              ? "bg-forest text-cream"
              : "border border-ink/15 bg-white text-ink/70 hover:bg-ink/5"
          }`}
        >
          메인 홈
        </a>
        <a
          href={`/admin/cms?page=${submenuPages[0]?.key ?? "greeting"}`}
          className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${
            page.tab === "submenu"
              ? "bg-forest text-cream"
              : "border border-ink/15 bg-white text-ink/70 hover:bg-ink/5"
          }`}
        >
          소메뉴 페이지
        </a>
      </div>

      {page.tab === "submenu" ? (
        <div className="flex flex-wrap gap-1.5">
          {submenuPages.map((item) => (
            <a
              key={item.key}
              href={`/admin/cms?page=${item.key}`}
              className={`rounded-full px-2.5 py-1 text-[11px] ${
                item.key === page.key
                  ? "bg-brand/10 font-medium text-brand"
                  : "text-ink/55 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}

      {notice ? (
        <p className={`text-xs ${noticeError ? "text-red-800" : "text-forest"}`}>{notice}</p>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-3 py-2">
            <p className="text-[11px] font-medium text-brand-ink">{page.label} 미리보기</p>
            <div className="flex items-center gap-2">
              {isHome ? (
                <button
                  type="button"
                  onClick={openBackgroundPicker}
                  className="rounded-md bg-forest px-2.5 py-1 text-[11px] font-medium text-cream hover:opacity-95"
                >
                  배경 이미지 선택
                </button>
              ) : null}
              <a
                href={page.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-brand hover:underline"
              >
                새 탭
              </a>
            </div>
          </div>
          {isHome ? (
            <HomeCmsCanvas
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

        <aside className="flex min-h-[24rem] flex-col rounded-xl border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 px-3 py-2">
            <p className="text-[11px] font-semibold text-brand-ink">슬롯 편집</p>
            <p className="mt-0.5 truncate text-[10px] text-ink/45">{slotTitle}</p>
          </div>

          {isHome ? (
            <div className="border-b border-ink/10 px-3 py-3">
              <button
                type="button"
                onClick={openBackgroundPicker}
                className="w-full rounded-md bg-brand px-2 py-2.5 text-[12px] font-medium text-white hover:opacity-95"
              >
                배경 이미지 선택
              </button>
              <p className="mt-1.5 text-[10px] text-ink/45">
                현재:{" "}
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
              action={saveContent}
              className="flex flex-1 flex-col gap-2 p-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  e.currentTarget.requestSubmit();
                }
              }}
            >
              <input type="hidden" name="section" value={page.section} />
              <input type="hidden" name="returnTo" value={returnTo} />
              {langs.map((item) => {
                const name = `${item.key}:${encodeURIComponent(active.path)}`;
                const value = draft[active.path] ?? fieldValue(active, item.key);
                const show = lang === item.key;
                const submitValue = item.key === "ko" ? value : lang === item.key ? fieldValue(active, item.key) : "";
                return show ? (
                  <label key={name} className="grid gap-1 text-[11px] text-ink/60">
                    내용 ({item.key})
                    {multiline ? (
                      <textarea
                        name={name}
                        defaultValue={submitValue}
                        onChange={(e) => {
                          if (item.key === "ko") setDraft((d) => ({ ...d, [active.path]: e.target.value }));
                        }}
                        rows={12}
                        className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] leading-6 outline-none focus:border-forest"
                      />
                    ) : (
                      <input
                        name={name}
                        defaultValue={submitValue}
                        onChange={(e) => {
                          if (item.key === "ko") setDraft((d) => ({ ...d, [active.path]: e.target.value }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
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

              <p className="text-[10px] leading-4 text-ink/40">
                {multiline
                  ? "Enter 줄바꿈 · Ctrl+Enter 저장. 한국어만 수정해도 영·중문이 맞춰집니다."
                  : "Enter 저장. 한국어만 수정해도 영·중문이 맞춰집니다."}
              </p>

              <button
                type="submit"
                className="mt-auto w-full rounded-md bg-forest px-3 py-2.5 text-[12px] font-medium tracking-wide text-cream hover:opacity-95"
              >
                저장
              </button>
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