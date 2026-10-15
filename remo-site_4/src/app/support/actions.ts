"use server";

import { generateAnswer, isGeminiConfigured, type ChatTurn } from "@/lib/gemini";
import { logSupportMessage, searchChunks } from "@/lib/knowledge";
import { buildQuestionPrompt, MIN_SCORE, SYSTEM_INSTRUCTION } from "@/lib/rag";
import { isDbConfigured } from "@/lib/db";

export type AskResult = {
  answer?: string;
  sources?: string[];
  grounded?: boolean;
  error?: string;
};

const QUESTION_MAX = 500;
const HISTORY_MAX = 6; // 최근 3턴(질문+답변)만 모델에 넘깁니다.

const NO_ANSWER =
  "그 부분은 제가 가진 자료로는 확인이 어렵습니다. 게시판에 질문을 남겨주시면 담당자가 직접 답변드릴게요.";

export async function askSupportAction(input: {
  question: string;
  history: ChatTurn[];
}): Promise<AskResult> {
  const question = (input.question ?? "").trim();

  if (!question) return { error: "질문을 입력해 주세요." };
  if (question.length > QUESTION_MAX) {
    return { error: `질문은 ${QUESTION_MAX}자까지 입력할 수 있어요.` };
  }
  if (!isDbConfigured()) return { error: "데이터베이스가 연결되어 있지 않습니다." };
  if (!isGeminiConfigured()) {
    return { error: "챗봇이 아직 설정되지 않았어요. 잠시 후 다시 시도해 주세요." };
  }

  try {
    const chunks = await searchChunks(question);
    const topScore = chunks.length > 0 ? chunks[0].score : null;
    const relevant = chunks.filter((chunk) => chunk.score >= MIN_SCORE);

    // 근거를 못 찾으면 모델을 부르지 않고 바로 안내합니다. (비용과 환각 모두 줄입니다)
    if (relevant.length === 0) {
      await logSupportMessage({
        question,
        answer: NO_ANSWER,
        grounded: false,
        sources: null,
        topScore,
      });
      return { answer: NO_ANSWER, sources: [], grounded: false };
    }

    const history = (input.history ?? [])
      .filter((turn) => turn && typeof turn.text === "string" && turn.text.trim())
      .slice(-HISTORY_MAX)
      .map((turn) => ({
        role: turn.role === "model" ? ("model" as const) : ("user" as const),
        text: turn.text.slice(0, 2000),
      }));

    const answer = await generateAnswer({
      systemInstruction: SYSTEM_INSTRUCTION,
      history,
      question: buildQuestionPrompt(question, relevant),
    });

    const sources = [...new Set(relevant.map((chunk) => chunk.documentTitle))];

    await logSupportMessage({
      question,
      answer,
      grounded: true,
      sources: sources.join(", "),
      topScore,
    });

    return { answer, sources, grounded: true };
  } catch (error) {
    console.error("askSupport failed:", error);
    return { error: "답변을 만드는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." };
  }
}
