"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createPostAction, updatePostAction, type FormState } from "./actions";
import { LIMITS } from "@/lib/board-config";
import {
  errorClass,
  fieldClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/formStyles";

const initialState: FormState = {};

type Props =
  | { mode: "create" }
  | { mode: "edit"; id: number; initialTitle: string; initialContent: string };

export default function PostEditor(props: Props) {
  const isEdit = props.mode === "edit";
  const [state, formAction, pending] = useActionState(
    isEdit ? updatePostAction : createPostAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 flex max-w-2xl flex-col gap-6">
      {isEdit && <input type="hidden" name="id" value={props.id} />}

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="title">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={LIMITS.title}
          defaultValue={isEdit ? props.initialTitle : ""}
          placeholder="제목을 입력하세요"
          className={fieldClass}
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
          rows={12}
          maxLength={LIMITS.content}
          defaultValue={isEdit ? props.initialContent : ""}
          placeholder="내용을 입력하세요"
          className={`${fieldClass} resize-y leading-[1.7]`}
        />
      </div>

      {state.error && <p className={errorClass}>{state.error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "저장 중..." : isEdit ? "수정하기" : "올리기"}
        </button>
        <Link href={isEdit ? `/board/${props.id}` : "/board"} className={secondaryButtonClass}>
          취소
        </Link>
      </div>
    </form>
  );
}
