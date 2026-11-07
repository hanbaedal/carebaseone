"use client";

import { saveStaffSelfEdit } from "@/app/admin/actions";
import type { CompanyProfileInput } from "@/lib/company-profile";

const labelClass = "grid gap-1 text-[11px] text-ink/70";
const inputClass =
  "w-full border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest";

export function StaffSelfEditForm({
  profile,
  username,
  roleLabel,
  error,
  saved,
}: {
  profile: CompanyProfileInput;
  username: string;
  roleLabel: string;
  error?: string;
  saved?: boolean;
}) {
  const fields: { name: keyof CompanyProfileInput; label: string; type?: string }[] = [
    { name: "companyName", label: "회사명" },
    { name: "representativeName", label: "대표자명" },
    { name: "companyPhone", label: "회사전화" },
    { name: "companyFax", label: "회사팩스" },
    { name: "companyEmail", label: "회사 이메일", type: "email" },
    { name: "representativePhone", label: "대표연락처" },
    { name: "website", label: "홈페이지 (https://…)" },
    { name: "businessRegistrationNumber", label: "사업자등록번호" },
    { name: "businessType", label: "업종" },
    { name: "businessItem", label: "업태" },
  ];

  const sns: { name: keyof CompanyProfileInput; label: string }[] = [
    { name: "snsFacebook", label: "페이스북" },
    { name: "snsInstagram", label: "인스타그램" },
    { name: "snsNaverCafe", label: "네이버 블로그 (또는 카페 URL)" },
    { name: "snsYoutube", label: "유튜브" },
    { name: "snsKakao", label: "카카오" },
  ];

  return (
    <form action={saveStaffSelfEdit} className="grid gap-6">
      {error ? <p className="text-xs text-red-800">{error}</p> : null}
      {saved ? <p className="text-xs text-forest">저장했습니다.</p> : null}

      <section className="grid gap-3 rounded border border-ink/10 bg-white p-4">
        <h2 className="text-xs font-semibold text-forest">로그인 계정</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelClass}>
            아이디
            <input name="usernameDisplay" defaultValue={username} readOnly className={inputClass} />
          </label>
          <label className={labelClass}>
            권한
            <input defaultValue={roleLabel} readOnly className={inputClass} />
          </label>
          <label className={`${labelClass} md:col-span-2`} htmlFor="newPassword">
            비밀번호 (비워 두면 유지)
            <input
              id="newPassword"
              name="password"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="변경할 때만 입력"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="grid gap-3 rounded border border-ink/10 bg-white p-4">
        <h2 className="text-xs font-semibold text-forest">회사 정보</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className={labelClass}>
              {field.label}
              <input
                name={field.name}
                type={field.type ?? "text"}
                defaultValue={profile[field.name]}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-3 rounded border border-ink/10 bg-white p-4">
        <h2 className="text-xs font-semibold text-forest">푸터 SNS</h2>
        <p className="text-[10px] text-ink/45">전체 URL을 입력하세요 (https://…)</p>
        <div className="grid gap-3 md:grid-cols-2">
          {sns.map((field) => (
            <label key={field.name} className={labelClass}>
              {field.label}
              <input name={field.name} defaultValue={profile[field.name]} className={inputClass} />
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        className="w-fit bg-forest px-4 py-2 text-xs tracking-[0.12em] text-cream"
      >
        저장
      </button>
    </form>
  );
}
