"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";

const initial: InquiryState = { ok: false };

export function ContactForm({ preset }: { preset?: "consumer" | "partner" }) {
  const t = useTranslations("contact");
  const [audience, setAudience] = useState(preset ?? "consumer");
  const [state, action, pending] = useActionState(submitInquiry, initial);

  if (state.ok) {
    return (
      <p className="border border-sage/40 bg-mist/40 px-6 py-8 text-base leading-8">
        {t("success")}
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <fieldset className="grid gap-3">
        <legend className="text-[11px] tracking-[0.18em] text-ink/55">
          {t("audience")}
        </legend>
        <div className="flex flex-wrap gap-3">
          {(["consumer", "partner"] as const).map((value) => (
            <label
              key={value}
              className={`cursor-pointer border px-4 py-2 text-sm ${
                audience === value
                  ? "border-forest bg-forest text-cream"
                  : "border-ink/15"
              }`}
            >
              <input
                type="radio"
                name="audience"
                value={value}
                checked={audience === value}
                onChange={() => setAudience(value)}
                className="sr-only"
              />
              {t(value)}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2 text-sm">
        {t("name")}
        <input
          name="name"
          required
          className="border border-ink/15 bg-white px-3 py-2 outline-none focus:border-forest"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {t("email")}
        <input
          name="email"
          type="email"
          required
          className="border border-ink/15 bg-white px-3 py-2 outline-none focus:border-forest"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {t("organization")}
        <input
          name="organization"
          className="border border-ink/15 bg-white px-3 py-2 outline-none focus:border-forest"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {t("country")}
        <input
          name="country"
          className="border border-ink/15 bg-white px-3 py-2 outline-none focus:border-forest"
        />
      </label>
      {audience === "partner" ? (
        <label className="grid gap-2 text-sm">
          {t("partnerType")}
          <select
            name="partnerType"
            className="border border-ink/15 bg-white px-3 py-2 outline-none focus:border-forest"
          >
            <option value="oem">{t("types.oem")}</option>
            <option value="distribution">{t("types.distribution")}</option>
            <option value="education">{t("types.education")}</option>
            <option value="center">{t("types.center")}</option>
            <option value="other">{t("types.other")}</option>
          </select>
        </label>
      ) : null}
      <label className="grid gap-2 text-sm">
        {t("message")}
        <textarea
          name="message"
          required
          rows={6}
          className="border border-ink/15 bg-white px-3 py-2 outline-none focus:border-forest"
        />
      </label>
      {state.message === "required" ? (
        <p className="text-sm text-red-800">{t("required")}</p>
      ) : null}
      {state.message === "error" ? (
        <p className="text-sm text-red-800">{t("error")}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-fit bg-forest px-6 py-3 text-[12px] tracking-[0.18em] text-cream disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
