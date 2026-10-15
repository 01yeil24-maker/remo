"use client";

import { useActionState } from "react";
import {
  addDocumentAction,
  addSeedDocumentAction,
  testGeminiAction,
  type KbFormState,
} from "./actions";
import {
  errorClass,
  fieldClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/formStyles";

const initialState: KbFormState = {};

const okClass =
  "rounded-xl bg-brand-ink/5 px-4 py-3 text-[14px] font-medium text-brand-ink/70";

export function QuickActions({ hasSeed }: { hasSeed: boolean }) {
  const [seedState, seedAction, seedPending] = useActionState(
    () => addSeedDocumentAction(),
    initialState,
  );
  const [testState, testAction, testPending] = useActionState(
    () => testGeminiAction(),
    initialState,
  );

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <form action={seedAction}>
          <button type="submit" disabled={seedPending || hasSeed} className={secondaryButtonClass}>
            {seedPending ? "넣는 중..." : hasSeed ? "기본 문서 넣음" : "기본 안내 문서 넣기"}
          </button>
        </form>
        <form action={testAction}>
          <button type="submit" disabled={testPending} className={secondaryButtonClass}>
            {testPending ? "확인 중..." : "Gemini 연결 테스트"}
          </button>
        </form>
      </div>

      {seedState.error && <p className={errorClass}>{seedState.error}</p>}
      {seedState.message && <p className={okClass}>{seedState.message}</p>}
      {testState.error && <p className={errorClass}>{testState.error}</p>}
      {testState.message && <p className={okClass}>{testState.message}</p>}
    </div>
  );
}

export function AddDocumentForm() {
  const [state, formAction, pending] = useActionState(addDocumentAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="title">
          문서 제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="예) 환불 및 예약 변경 규정"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="source">
          출처 <span className="font-normal text-brand-ink/45">(선택)</span>
        </label>
        <input
          id="source"
          name="source"
          type="text"
          maxLength={120}
          placeholder="예) NotebookLM, 운영 매뉴얼 v2"
          className={`${fieldClass} sm:max-w-sm`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="content">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={14}
          placeholder="상담에 참고할 내용을 붙여넣으세요. 문단 단위로 자동으로 잘라 저장합니다."
          className={`${fieldClass} resize-y leading-[1.7] font-mono text-[13px]`}
        />
        <p className="text-[13px] text-brand-ink/50">
          저장할 때 Gemini 임베딩을 호출합니다. 긴 문서는 조금 걸릴 수 있어요.
        </p>
      </div>

      {state.error && <p className={errorClass}>{state.error}</p>}
      {state.message && <p className={okClass}>{state.message}</p>}

      <button type="submit" disabled={pending} className={`${primaryButtonClass} w-fit`}>
        {pending ? "저장 중..." : "문서 추가"}
      </button>
    </form>
  );
}
