"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { askSupportAction } from "./actions";
import { fieldClass, primaryButtonClass } from "@/components/formStyles";

type Message = {
  role: "user" | "model";
  text: string;
  sources?: string[];
  grounded?: boolean;
};

const SUGGESTIONS = [
  "사우나 치맥은 얼마인가요?",
  "혼자 가도 괜찮나요?",
  "세션은 몇 시에 시작해서 언제 끝나요?",
  "게시판에 글을 쓰려면 어떻게 하나요?",
];

export default function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || pending) return;

    setError(null);
    setInput("");
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setPending(true);

    try {
      const result = await askSupportAction({ question: text, history });
      if (result.error) {
        setError(result.error);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: result.answer ?? "",
            sources: result.sources,
            grounded: result.grounded,
          },
        ]);
      }
    } catch {
      setError("답변을 받지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-10 flex max-w-3xl flex-col gap-5">
      <div
        aria-live="polite"
        className="flex min-h-[320px] flex-col gap-5 rounded-2xl border border-brand-line bg-white/70 p-6"
      >
        {messages.length === 0 && !pending && (
          <div className="text-[14px] leading-[1.8] text-brand-ink/55">
            <p>REMO와 사우나 치맥 세션에 대해 물어보세요. 자료에 있는 내용으로 답해드립니다.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-brand-line px-4 py-2 text-[13px] text-brand-ink/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-[1.75] " +
                (message.role === "user"
                  ? "bg-brand-orange text-white"
                  : "bg-brand-ink/5 text-brand-ink/85")
              }
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              {message.role === "model" && message.sources && message.sources.length > 0 && (
                <p className="mt-2.5 border-t border-brand-ink/10 pt-2 text-[12px] text-brand-ink/45">
                  참고: {message.sources.join(" · ")}
                </p>
              )}
              {message.role === "model" && message.grounded === false && (
                <Link
                  href="/board/new"
                  className="mt-2.5 inline-block text-[13px] font-semibold text-brand-orange"
                >
                  게시판에 질문 남기기 →
                </Link>
              )}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-brand-ink/5 px-4 py-3 text-[14px] text-brand-ink/45">
              답변을 찾고 있어요...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p className="rounded-xl bg-brand-orange/10 px-4 py-3 text-[14px] font-medium text-brand-orange">
          {error}
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="question" className="sr-only">
          질문
        </label>
        <input
          id="question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={500}
          placeholder="궁금한 점을 입력하세요"
          autoComplete="off"
          className={fieldClass}
        />
        <button type="submit" disabled={pending || !input.trim()} className={primaryButtonClass}>
          {pending ? "답변 중" : "보내기"}
        </button>
      </form>

      <p className="text-[13px] leading-[1.7] text-brand-ink/40">
        AI가 등록된 자료를 바탕으로 답합니다. 자료에 없는 내용은 답하지 않으며, 정확한 확인이
        필요한 건은 게시판에 남겨주세요.
      </p>
    </div>
  );
}
