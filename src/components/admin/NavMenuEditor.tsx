"use client";

import { saveContent } from "@/app/admin/actions";
import type { EditorField } from "@/lib/content";
import { headerNavLabelPaths, navMenuGroups } from "@/lib/nav-menu";

function FieldInput({ field }: { field: EditorField }) {
  const name = encodeURIComponent(field.path);
  const inputClass =
    "w-full border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest";

  return (
    <label className="grid gap-1 text-[11px] text-ink/70">
      <span className="text-ink/85">{field.label}</span>
      <input name={`ko:${name}`} defaultValue={field.ko} className={inputClass} />
    </label>
  );
}

export function NavMenuEditor({ fields }: { fields: EditorField[] }) {
  const byPath = new Map(fields.map((field) => [field.path, field]));
  const headerPaths = new Set(headerNavLabelPaths());

  const utilityFields = fields.filter(
    (f) => f.path.startsWith("nav.") && !headerPaths.has(f.path),
  );

  return (
    <form action={saveContent} className="grid gap-4">
      <input type="hidden" name="section" value="nav" />
      <p className="text-[11px] leading-5 text-ink/55">
        한글만 입력하면 저장 시 영어·중국어는 자동으로 맞춰집니다. 공개 홈에서는 KO / EN / 中文
        로 바꿔 볼 수 있습니다.
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
              {parent ? <FieldInput field={parent} /> : null}
              {group.children.length > 0 ? (
                <div className="grid gap-3 border-l-2 border-forest/25 pl-3 md:grid-cols-2">
                  {group.children.map((child) => {
                    const field = byPath.get(`nav.${child.key}`);
                    if (!field) return null;
                    return (
                      <div key={child.key}>
                        <p className="mb-1 text-[10px] text-ink/45">{child.href}</p>
                        <FieldInput field={field} />
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
              <FieldInput key={field.path} field={field} />
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
