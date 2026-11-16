"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { unifiedLogin } from "@/app/[locale]/login/actions";

export function UnifiedLoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(unifiedLogin, {});

  useEffect(() => {
    if (!state.ok) return;
    router.replace("/sitemap");
    router.refresh();
  }, [state.ok, state.kind, router]);

  return (
    <form action={action} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        아이디
        <input
          name="username"
          autoComplete="username"
          required
          className="border border-line px-3 py-2 outline-none focus:border-brand"
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor="unified-password">
        비밀번호
        <input
          id="unified-password"
          name="password"
          type="text"
          autoComplete="off"
          spellCheck={false}
          required
          className="border border-line px-3 py-2 outline-none focus:border-brand"
        />
      </label>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}