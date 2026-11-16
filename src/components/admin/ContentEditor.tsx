"use client";

import { saveContent } from "@/app/admin/actions";
import type { EditorField } from "@/lib/content";

export function ContentEditor({
  section,
  fields,
}: {
  section: string;
  fields: EditorField[];
}) {
  const inputClass =
    "w-full border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest";

  return (
    <form action={saveContent} className="grid gap-3">
      <input type="hidden" name="section" value={section} />
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => {
          const name = encodeURIComponent(field.path);
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
