"use client";

import { useActionState, useState } from "react";
import { submitLeadAction, type LeadFormState } from "./actions";
import {
  INTENT_OPTIONS,
  LEAD_LIMITS,
  SURVEY_FIELDS,
  SESSION,
} from "@/lib/sauna-config";

const initialState: LeadFormState = {};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-amber-50 outline-none transition-colors placeholder:text-amber-50/30 focus:border-[var(--ember)]";

export default function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLeadAction, initialState);
  // 오류로 돌아온 경우 적었던 내용을 그대로 되살립니다.
  const kept = state.values;
  const surveyAnswered = Boolean(
    kept?.ageBand || kept?.gender || kept?.region || kept?.preferredTime || kept?.priceBand,
  );
  const [surveyOpen, setSurveyOpen] = useState(surveyAnswered);

  if (state.done) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10">
        <p className="text-[13px] font-semibold tracking-[0.1em] text-[var(--ember)]">THANK YOU</p>
        <h3 className="mt-3 text-[26px] font-bold tracking-[-0.02em] text-amber-50 sm:text-[32px]">
          {state.intent === "curious" ? "의견 고맙습니다." : "1호 세션 열리면 가장 먼저 알려드릴게요."}
        </h3>

        {state.couponCode ? (
          <div className="mt-8 rounded-2xl border border-[var(--ember)]/40 bg-[var(--ember)]/10 p-6">
            <p className="text-[14px] text-amber-50/80">
              설문에 답해주셔서 커피 쿠폰을 드립니다. 아래 코드를 적어두세요. 입력하신 이메일로도
              보내드립니다.
            </p>
            <p className="mt-4 font-mono text-[24px] font-bold tracking-[0.08em] text-[var(--ember)] sm:text-[30px]">
              {state.couponCode}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-[15px] leading-[1.75] text-amber-50/60">
            설문까지 답해주시면 커피 쿠폰을 보내드려요. 30초면 끝납니다.
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {/* 1. 구매 의사 */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-[17px] font-bold tracking-[-0.02em] text-amber-50">
          1. 이 세션, 열리면 오실 건가요?
        </legend>
        <div className="flex flex-col gap-3">
          {INTENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-white/12 bg-white/5 px-5 py-4 transition-colors hover:border-[var(--ember)]/60 has-checked:border-[var(--ember)] has-checked:bg-[var(--ember)]/10"
            >
              <input
                type="radio"
                name="intent"
                value={option.value}
                defaultChecked={kept?.intent === option.value}
                required
                className="mt-1 h-4 w-4 accent-[var(--ember)]"
              />
              <span>
                <span className="block text-[15px] font-semibold text-amber-50">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[13px] text-amber-50/50">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2. 개선 요청 */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-[17px] font-bold tracking-[-0.02em] text-amber-50">
          2. 바꿨으면 하는 점이 있나요?
        </legend>
        <p className="text-[14px] leading-[1.7] text-amber-50/55">
          가격, 시간대, 장소, 진행 방식 — 걸리는 게 있으면 그대로 적어주세요. 여는 방식을 여기에
          맞춰 고칩니다.
        </p>
        <textarea
          name="improvement"
          rows={5}
          maxLength={LEAD_LIMITS.improvement}
          defaultValue={kept?.improvement ?? ""}
          placeholder="예) 평일 저녁은 시간이 빠듯해요. 주말 낮이면 갈 것 같아요."
          className={`${inputClass} resize-y leading-[1.7]`}
        />
      </fieldset>

      {/* 3. 선택 설문 */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-[17px] font-bold tracking-[-0.02em] text-amber-50">
          3. 설문에 답하고 커피 쿠폰 받기
          <span className="ml-2 align-middle text-[12px] font-semibold text-[var(--ember)]">
            선택
          </span>
        </legend>
        <p className="text-[14px] leading-[1.7] text-amber-50/55">
          누구에게 맞춰 열어야 할지 정하는 데 씁니다. 다섯 문항, 30초면 끝나고 바로 커피 쿠폰을
          드려요.
        </p>

        {!surveyOpen ? (
          <button
            type="button"
            onClick={() => setSurveyOpen(true)}
            className="w-fit rounded-full border border-[var(--ember)]/50 px-5 py-2.5 text-[14px] font-semibold text-[var(--ember)] transition-colors hover:bg-[var(--ember)]/10"
          >
            설문 열기 · 커피 쿠폰 받기
          </button>
        ) : (
          <div className="flex flex-col gap-7 rounded-2xl border border-white/12 bg-white/5 p-6">
            {SURVEY_FIELDS.map((field) => (
              <div key={field.name} className="flex flex-col gap-3">
                <span className="text-[14px] font-semibold text-amber-50/85">{field.label}</span>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((option) => (
                    <label
                      key={option.value}
                      className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-[13px] text-amber-50/70 transition-colors hover:border-[var(--ember)]/60 has-checked:border-[var(--ember)] has-checked:bg-[var(--ember)]/15 has-checked:text-amber-50"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        defaultChecked={kept?.[field.name] === option.value}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* 연락처 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contact" className="text-[14px] font-semibold text-amber-50/85">
          이메일
          <span className="ml-2 text-[13px] font-normal text-amber-50/45">
            세션 소식과 쿠폰을 보낼 곳이에요
          </span>
        </label>
        <input
          id="contact"
          name="contact"
          type="email"
          maxLength={LEAD_LIMITS.contact}
          defaultValue={kept?.contact ?? ""}
          placeholder="you@example.com"
          className={`${inputClass} sm:max-w-md`}
        />
      </div>

      {state.error && (
        <p className="rounded-xl bg-[var(--ember)]/15 px-4 py-3 text-[14px] font-medium text-[var(--ember)]">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[var(--ember)] px-8 py-4 text-[16px] font-bold text-[#1a1208] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-fit"
        >
          {pending ? "보내는 중..." : "보내기"}
        </button>
        <p className="text-[13px] text-amber-50/40">
          지금은 {SESSION.name} 1호 세션을 열기 전 수요 조사 단계입니다. 결제는 없습니다.
        </p>
      </div>
    </form>
  );
}
