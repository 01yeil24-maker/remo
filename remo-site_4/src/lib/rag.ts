// 문서를 잘라 저장하고, 질문과 가까운 조각을 찾아 답변 근거로 묶는 부분입니다.
// 벡터 검색은 조각 수가 많지 않아 JS에서 코사인 유사도로 계산합니다.
// (수천 개 이상으로 커지면 Neon의 pgvector로 옮기는 게 좋습니다.)

export const CHUNK_SIZE = 600; // 글자 수 기준
export const CHUNK_OVERLAP = 120;
export const TOP_K = 5;
/**
 * 이 점수보다 낮으면 "모르는 질문"으로 처리합니다.
 * 적정값은 임베딩 모델마다 다릅니다. gemini-embedding-001 기준으로 0.55 정도가
 * 무난하지만, 답을 할 수 있는 질문인데 자꾸 "모르겠다"고 하면 RAG_MIN_SCORE를
 * 낮추고(예: 0.45), 엉뚱한 답을 하면 올리세요. 관리자 화면의 질문 로그에
 * 실제 점수가 찍히니 그걸 보고 맞추면 됩니다.
 */
export const MIN_SCORE = Number(process.env.RAG_MIN_SCORE ?? "0.55");

/**
 * 문단 경계를 지키면서 자릅니다.
 * 한 문단이 너무 길면 문장 단위로 쪼갠 뒤 다시 묶습니다.
 */
export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const paragraphs = normalized
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pieces: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.length <= CHUNK_SIZE) {
      pieces.push(paragraph);
      continue;
    }
    // 긴 문단은 문장 단위로 나눕니다 (한국어 종결부호 포함).
    const sentences = paragraph.split(/(?<=[.!?。?!])\s+|(?<=다\.)\s+/).filter(Boolean);
    let buffer = "";
    for (const sentence of sentences) {
      if (buffer && buffer.length + sentence.length > CHUNK_SIZE) {
        pieces.push(buffer.trim());
        buffer = buffer.slice(Math.max(0, buffer.length - CHUNK_OVERLAP));
      }
      buffer += (buffer ? " " : "") + sentence;
    }
    if (buffer.trim()) pieces.push(buffer.trim());
  }

  // 너무 짧은 조각은 앞 조각에 붙입니다.
  const merged: string[] = [];
  for (const piece of pieces) {
    const last = merged[merged.length - 1];
    if (last && last.length + piece.length + 1 <= CHUNK_SIZE) {
      merged[merged.length - 1] = `${last}\n${piece}`;
    } else {
      merged.push(piece);
    }
  }
  return merged;
}

/** 두 벡터 모두 길이 1로 정규화돼 있다고 보고 내적을 씁니다. */
export function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < length; i++) sum += a[i] * b[i];
  return sum;
}

export type ScoredChunk = {
  chunkId: number;
  documentId: number;
  documentTitle: string;
  content: string;
  score: number;
};

export function rankChunks(
  queryVector: number[],
  chunks: { chunkId: number; documentId: number; documentTitle: string; content: string; embedding: number[] }[],
  topK = TOP_K,
): ScoredChunk[] {
  return chunks
    .map((chunk) => ({
      chunkId: chunk.chunkId,
      documentId: chunk.documentId,
      documentTitle: chunk.documentTitle,
      content: chunk.content,
      score: cosineSimilarity(queryVector, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export const SYSTEM_INSTRUCTION = `당신은 REMO 팀의 고객상담 담당자입니다. 한국어로, 짧고 친절하게 답합니다.

지켜야 할 것:
1. 아래 "참고 자료"에 있는 내용만 근거로 답하세요. 자료에 없는 사실은 지어내지 마세요.
2. 자료로 답할 수 없는 질문이면 솔직하게 모른다고 말하고, 게시판에 남겨주시면 사람이 답변드린다고 안내하세요.
3. 가격, 날짜, 인원 같은 숫자는 자료에 적힌 그대로만 쓰세요.
4. 답변은 3~5문장 정도로 짧게. 목록이 더 읽기 좋으면 짧은 목록을 쓰세요.
5. "참고 자료에 따르면" 같은 표현은 쓰지 말고, 바로 답하세요.`;

export function buildContext(chunks: ScoredChunk[]): string {
  if (chunks.length === 0) return "참고 자료: (없음)";
  return [
    "참고 자료:",
    ...chunks.map((chunk, index) => `[${index + 1}] (${chunk.documentTitle})\n${chunk.content}`),
  ].join("\n\n");
}

export function buildQuestionPrompt(question: string, chunks: ScoredChunk[]): string {
  return `${buildContext(chunks)}\n\n고객 질문: ${question}`;
}
