// Gemini API 호출부입니다.
//
// API 키는 서버 환경변수 GEMINI_API_KEY 에서만 읽습니다.
// NEXT_PUBLIC_ 접두사를 쓰지 않기 때문에 브라우저로 내려가지 않습니다.
// 키는 URL 쿼리스트링이 아니라 x-goog-api-key 헤더로 보냅니다(로그에 남지 않도록).

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/** 답변 생성 모델 — 환경변수로 바꿀 수 있습니다. */
export const CHAT_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";

/** 임베딩 모델 */
export const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";

/** 임베딩 차원 — 작게 잘라 저장 비용과 검색 비용을 줄입니다. */
export const EMBED_DIM = 768;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY가 설정되어 있지 않습니다.");
  return key;
}

async function callGemini(path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    // 키 값이 섞여 나가지 않도록 상태코드와 본문 앞부분만 남깁니다.
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

// ── 임베딩 ─────────────────────────────────────────────────────────────

function normalize(values: number[]): number[] {
  let sum = 0;
  for (const v of values) sum += v * v;
  const length = Math.sqrt(sum);
  if (!length) return values;
  return values.map((v) => v / length);
}

type EmbedTask = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

/** 문장 하나를 벡터로 바꿉니다. 길이 1로 정규화해서 돌려줍니다. */
export async function embedText(text: string, taskType: EmbedTask): Promise<number[]> {
  const json = (await callGemini(`models/${EMBED_MODEL}:embedContent`, {
    model: `models/${EMBED_MODEL}`,
    content: { parts: [{ text }] },
    embedContentConfig: { taskType, outputDimensionality: EMBED_DIM },
  })) as { embedding?: { values?: number[] } };

  const values = json.embedding?.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("임베딩 응답에 값이 없습니다.");
  }
  return normalize(values);
}

/** 여러 문장을 한 번에 임베딩합니다. */
export async function embedBatch(texts: string[], taskType: EmbedTask): Promise<number[][]> {
  if (texts.length === 0) return [];

  const json = (await callGemini(`models/${EMBED_MODEL}:batchEmbedContents`, {
    requests: texts.map((text) => ({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
      embedContentConfig: { taskType, outputDimensionality: EMBED_DIM },
    })),
  })) as { embeddings?: { values?: number[] }[] };

  const list = json.embeddings;
  if (!Array.isArray(list) || list.length !== texts.length) {
    throw new Error("임베딩 응답 개수가 요청과 다릅니다.");
  }
  return list.map((item, index) => {
    const values = item.values;
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error(`${index}번째 임베딩이 비어 있습니다.`);
    }
    return normalize(values);
  });
}

// ── 답변 생성 ──────────────────────────────────────────────────────────

export type ChatTurn = { role: "user" | "model"; text: string };

export async function generateAnswer(input: {
  systemInstruction: string;
  history: ChatTurn[];
  question: string;
}): Promise<string> {
  const json = (await callGemini(`models/${CHAT_MODEL}:generateContent`, {
    systemInstruction: { parts: [{ text: input.systemInstruction }] },
    contents: [
      ...input.history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      { role: "user", parts: [{ text: input.question }] },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  })) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  };

  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("모델이 빈 답변을 돌려줬습니다.");
  return text;
}

/** 관리자 화면의 "연결 테스트"용 — 키와 모델 이름이 맞는지 확인합니다. */
export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isGeminiConfigured()) {
    return { ok: false, message: "GEMINI_API_KEY가 설정되어 있지 않습니다." };
  }
  try {
    const answer = await generateAnswer({
      systemInstruction: "You are a connection test. Reply with the single word: OK",
      history: [],
      question: "ping",
    });
    return { ok: true, message: `연결 성공 (${CHAT_MODEL}) · 응답: ${answer.slice(0, 40)}` };
  } catch (error) {
    return { ok: false, message: String(error).slice(0, 300) };
  }
}
