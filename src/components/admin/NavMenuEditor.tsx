"use client";

import { useEffect, useState } from "react";
import { saveContent } from "@/app/admin/actions";
import type { EditorField } from "@/lib/content";
import { headerNavLabelPaths, navMenuGroups } from "@/lib/nav-menu";

function FieldInput({
  field,
  wide,
}: {
  field: EditorField;
  wide: boolean;
}) {
  const name = encodeURIComponent(field.path);
  const inputClass =
    "w-full border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest";

  return (
    <label className="grid gap-1 text-[11px] text-ink/70">
      <span className="text-ink/85">{field.label}</span>
      <input name={`ko:${name}`} defaultValue={field.ko} className={inputClass} />
      {wide ? (
        <span className="grid grid-cols-2 gap-2">
          <input
            name={`en:${name}`}
            defaultValue={field.en}
            aria-label={`${field.label} English`}
            className={inputClass}
          />
          <input
            name={`zh:${name}`}
            defaultValue={field.zh}
            aria-label={`${field.label} 中文`}
            className={inputClass}
          />
        </span>
      ) : (
        <details>
          <summary className="cursor-pointer text-[11px] text-ink/45">EN · 中文</summary>
          <span className="mt-1 grid gap-1">
            <input
              name={`en:${name}`}
              defaultValue={field.en}
              aria-label={`${field.label} English`}
              className={inputClass}
            />
            <input
              name={`zh:${name}`}
              defaultValue={field.zh}
              aria-label={`${field.label} 中文`}
              className={inputClass}
            />
          </span>
        </details>
      )}
    </label>
  );
}

export function NavMenuEditor({ fields }: { fields: EditorField[] }) {
  const [wide, setWide] = useState(false);
  const byPath = new Map(fields.map((field) => [field.path, field]));
  const headerPaths = new Set(headerNavLabelPaths());

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setWide(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const utilityFields = fields.filter(
    (f) => f.path.startsWith("nav.") && !headerPaths.has(f.path),
  );

  return (
    <form action={saveContent} className="grid gap-4">
      <input type="hidden" name="section" value="nav" />
      <p className="text-[11px] leading-5 text-ink/55">
        상단 헤더·사이트맵에 보이는 이름입니다. 소메뉴까지 한글을 바꾸면 영·중국어가 함께
        저장됩니다. 연결 주소(경로)는 개발 설정이며 여기서는 바꾸지 않습니다.
      </p>
      {navMenuGroups.map((group) => {
        const parent = byPath.get(`nav.${group.key}`);
        return (
          <section
            key={group.key}
            className="rounded border border-ink/10 bg-white p-3 shadow-sm"
          >
            <div className="flex flex-wrap items-baseline gap-2 border-b border-ink/10 pb-2">
              <h2 className="text-xs font-semibold text-forest">
                {parent?.ko ?? group.key}
              </h2>
              <span className="text-[10px] text-ink/40">{group.href}</span>
            </div>
            <div className="mt-3 grid gap-3">
              {parent ? <FieldInput field={parent} wide={wide} /> : null}
              {group.children.length > 0 ? (
                <div className="grid gap-3 border-l-2 border-forest/25 pl-3 md:grid-cols-2">
                  {group.children.map((child) => {
                    const field = byPath.get(`nav.${child.key}`);
                    if (!field) return null;
                    return (
                      <div key={child.key}>
                        <p className="mb-1 text-[10px] text-ink/45">{child.href}</p>
                        <FieldInput field={field} wide={wide} />
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
      {utilityFields.length > 0 ? (
        <section className="rounded border border-dashed border-ink/15 bg-mist/30 p-3">
          <h2 className="text-xs font-semibold text-ink/60">기타 헤더·안내 문구</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {utilityFields.map((field) => (
              <FieldInput key={field.path} field={field} wide={wide} />
            ))}
          </div>
        </section>
      ) : null}
      <button
        type="submit"
        className="w-fit bg-forest px-4 py-2 text-xs tracking-[0.12em] text-cream"
      >
        저장
      </button>
    </form>
  );
}
