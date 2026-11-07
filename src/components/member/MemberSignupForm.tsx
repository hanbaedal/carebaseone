"use client";

import { useActionState, useState, useCallback } from "react";
import { signupMember } from "@/app/[locale]/member/actions";

function EyeToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 w-10 text-xs text-brand-ink/50"
    >
      {visible ? "숨김" : "보기"}
    </button>
  );
}

export function MemberSignupForm() {
  const [state, action, pending] = useActionState(signupMember, {});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [usernameHint, setUsernameHint] = useState<string | null>(null);

  const checkUsername = useCallback(async (value: string) => {
    const username = value.trim();
    if (username.length < 4) {
      setUsernameHint(null);
      return;
    }
    const res = await fetch(
      `/api/member/check-username?username=${encodeURIComponent(username)}`,
    );
    const data = (await res.json()) as { taken?: boolean };
    setUsernameHint(data.taken ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.");
  }, []);

  return (
    <form action={action} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        이름
        <input name="name" required className="border border-line px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        아이디
        <input
          name="username"
          required
          className="border border-line px-3 py-2"
          autoComplete="username"
          onBlur={(e) => checkUsername(e.target.value)}
        />
        {usernameHint ? (
          <span className={usernameHint.includes("사용 가능") ? "text-brand" : "text-red-700"}>
            {usernameHint}
          </span>
        ) : null}
      </label>
      <div className="grid gap-1 text-sm">
        <label htmlFor="password">비밀번호</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            className="w-full border border-line px-3 py-2 pr-12"
          />
          <EyeToggle visible={showPw} onToggle={() => setShowPw((v) => !v)} />
        </div>
      </div>
      <div className="grid gap-1 text-sm">
        <label htmlFor="password2">비밀번호 확인</label>
        <div className="relative">
          <input
            id="password2"
            name="password2"
            type={showPw2 ? "text" : "password"}
            required
            minLength={8}
            className="w-full border border-line px-3 py-2 pr-12"
          />
          <EyeToggle visible={showPw2} onToggle={() => setShowPw2((v) => !v)} />
        </div>
      </div>
      <label className="grid gap-1 text-sm">
        이메일
        <input name="email" type="email" required className="border border-line px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        전화번호
        <input name="phone" required className="border border-line px-3 py-2" placeholder="01000000000" />
      </label>
      <label className="grid gap-1 text-sm">
        우편번호
        <input name="zipcode" id="member-zipcode" required className="border border-line px-3 py-2" readOnly />
      </label>
      <label className="grid gap-1 text-sm">
        주소
        <input name="address" id="member-address" required className="border border-line px-3 py-2" readOnly />
      </label>
      <label className="grid gap-1 text-sm">
        상세주소
        <input name="addressDetail" className="border border-line px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        참고사항
        <textarea name="note" rows={3} className="border border-line px-3 py-2" />
      </label>
      <button
        type="button"
        className="w-fit rounded border border-line px-3 py-1 text-xs"
        onClick={() => {
          const w = window as Window & {
            daum?: { Postcode: new (opts: { oncomplete: (d: { zonecode: string; address: string }) => void }) => { open: () => void } };
          };
          if (!w.daum) {
            const script = document.createElement("script");
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.onload = () => {
              new w.daum!.Postcode({
                oncomplete(data) {
                  const zip = document.getElementById("member-zipcode") as HTMLInputElement;
                  const addr = document.getElementById("member-address") as HTMLInputElement;
                  zip.value = data.zonecode;
                  addr.value = data.address;
                },
              }).open();
            };
            document.body.appendChild(script);
            return;
          }
          new w.daum.Postcode({
            oncomplete(data) {
              const zip = document.getElementById("member-zipcode") as HTMLInputElement;
              const addr = document.getElementById("member-address") as HTMLInputElement;
              zip.value = data.zonecode;
              addr.value = data.address;
            },
          }).open();
        }}
      >
        우편번호 찾기
      </button>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? (
        <p className="text-sm text-brand">가입 신청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "신청 중…" : "회원가입 신청"}
      </button>
    </form>
  );
}
