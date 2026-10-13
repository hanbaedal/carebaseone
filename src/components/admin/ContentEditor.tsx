"use client";

import { useEffect, useState } from "react";
import { saveContent } from "@/app/admin/actions";
import type { EditorField } from "@/lib/content";

export function ContentEditor({
  section,
  fields,
}: {
  section: string;
  fields: EditorField[];
}) {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setWide(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <form action={saveContent} className="grid gap-3">
      <input type="hidden" name="section" value={section} />
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => {
          const name = encodeURIComponent(field.path);
          const inputClass =
            "w-full border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest";
          return (
            <label key={field.path} className="grid gap-1 text-[11px] text-ink/70">
              {field.label}
              {field.multiline ? (
                <textarea
                  name={`ko:${name}`}
                  defaultValue={field.ko}
                  rows={3}
                  className={inputClass}
                />
              ) : (
                <input name={`ko:${name}`} defaultValue={field.ko} className={inputClass} />
              )}
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
                  <summary className="cursor-pointer text-[11px] text-ink/45">
                    EN · 中文
                  </summary>
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
        })}
      </div>
      <button
        type="submit"
        className="sticky bottom-3 w-fit bg-forest px-4 py-2 text-xs tracking-[0.14em] text-cream"
      >
        저장
      </button>
    </form>
  );
}
