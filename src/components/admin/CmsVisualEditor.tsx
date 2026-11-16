"use client";

import { useMemo, useState } from "react";
import { saveContent } from "@/app/admin/actions";
import type { EditorField } from "@/lib/content";
import { fieldLabelFor, type CmsPageDef } from "@/lib/cms-pages";

const langs = [
  { key: "ko" as const, label: "한국어" },
  { key: "zh" as const, label: "中文" },
  { key: "en" as const, label: "English" },
];

function fieldValue(field: EditorField, lang: "ko" | "zh" | "en") {
  if (lang === "zh") return field.zh;
  if (lang === "en") return field.en;
  return field.ko;
}

export function CmsVisualEditor({
  page,
  fields,
  returnTo,
  notice,
  noticeError,
  submenuPages,
}: {
  page: CmsPageDef;
  fields: EditorField[];
  returnTo: string;
  notice?: string;
  noticeError?: boolean;
  submenuPages: CmsPageDef[];
}) {
  const defaultPath =
    fields.find((f) => f.path.endsWith(".body"))?.path ??
    fields.find((f) => f.path.endsWith(".headline") || f.path.endsWith(".title"))?.path ??
    fields[0]?.path ??
    "";
  const [slot, setSlot] = useState(defaultPath);
  const [lang, setLang] = useState<"ko" | "zh" | "en">("ko");
  const [iframeKey, setIframeKey] = useState(0);

  const active = useMemo(
    () => fields.find((f) => f.path === slot) ?? fields[0],
    [fields, slot],
  );

  const slotTitle = active
    ? `${fieldLabelFor(page, active.path)} \`${active.path.split(".").slice(-2).join(".")}\``
    : "";

  const multiline =
    Boolean(active?.multiline) ||
    Boolean(active?.path.endsWith(".body")) ||
    Boolean(active?.path.endsWith(".lede")) ||
    Boolean(active?.path.endsWith(".text"));

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-brand-ink">홈페이지 CMS</h1>
          <p className="mt-1 max-w-2xl text-[11px] leading-5 text-ink/50">
            미리보기 URL에서 메인·소메뉴를 편집합니다. 갤러리·공지는 별도 메뉴에서 관리합니다.
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
          <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
            <p className="text-[11px] font-medium text-brand-ink">{page.label} 미리보기</p>
            <a
              href={page.preview}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-brand hover:underline"
            >
              새 탭
            </a>
          </div>
          <iframe
            key={`${page.key}-${iframeKey}`}
            title={`${page.label} preview`}
            src={page.preview}
            className="h-[min(70vh,44rem)] w-full bg-white"
          />
        </div>

        <aside className="flex min-h-[24rem] flex-col rounded-xl border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 px-3 py-2">
            <p className="text-[11px] font-semibold text-brand-ink">슬롯 편집</p>
            <p className="mt-0.5 truncate text-[10px] text-ink/45">{slotTitle}</p>
          </div>

          <div className="border-b border-ink/10 px-2 py-2">
            <label className="grid gap-1 text-[10px] text-ink/50">
              편집 슬롯
              <select
                value={active?.path ?? ""}
                onChange={(e) => setSlot(e.target.value)}
                className="rounded border border-ink/15 bg-white px-2 py-1.5 text-[12px] text-brand-ink"
              >
                {fields.map((field) => (
                  <option key={field.path} value={field.path}>
                    {fieldLabelFor(page, field.path)}
                  </option>
                ))}
              </select>
            </label>
          </div>

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

          {active ? (
            <form action={saveContent} className="flex flex-1 flex-col gap-2 p-3">
              <input type="hidden" name="section" value={page.section} />
              <input type="hidden" name="returnTo" value={returnTo} />
              {langs.map((item) => {
                const name = `${item.key}:${encodeURIComponent(active.path)}`;
                const value = fieldValue(active, item.key);
                const show = lang === item.key;
                // 한국어만 보이면 en/zh는 빈 값으로 보내 자동번역. 다른 언어 탭에서는 해당 값 전송.
                const submitValue = item.key === "ko" ? value : lang === item.key ? value : "";
                return show ? (
                  <label key={name} className="grid gap-1 text-[11px] text-ink/60">
                    내용 ({item.key})
                    {multiline ? (
                      <textarea
                        name={name}
                        defaultValue={submitValue}
                        key={`${active.path}-${item.key}-${iframeKey}`}
                        rows={12}
                        className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] leading-6 outline-none focus:border-forest"
                      />
                    ) : (
                      <input
                        name={name}
                        defaultValue={submitValue}
                        key={`${active.path}-${item.key}-${iframeKey}`}
                        className="w-full rounded border border-ink/15 bg-white px-2 py-1.5 text-[13px] outline-none focus:border-forest"
                      />
                    )}
                  </label>
                ) : item.key === "ko" && lang !== "ko" ? (
                  <input key={name} type="hidden" name={`ko:${encodeURIComponent(active.path)}`} defaultValue={active.ko} />
                ) : (
                  <input key={name} type="hidden" name={name} defaultValue="" />
                );
              })}

              <p className="text-[10px] leading-4 text-ink/40">
                한국어만 수정해도 저장 시 영·중문이 맞춰집니다.
              </p>

              <button
                type="submit"
                className="mt-auto w-full rounded-md bg-forest px-3 py-2.5 text-[12px] font-medium tracking-wide text-cream hover:opacity-95"
              >
                저장
              </button>
            </form>
          ) : (
            <p className="p-3 text-[11px] text-ink/45">편집할 문구가 없습니다.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
