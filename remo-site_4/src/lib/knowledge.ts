// 지식베이스 문서 저장·검색과 상담 기록입니다.

import { getSql } from "./db";
import { ensureSchema } from "./schema";
import { embedBatch, embedText } from "./gemini";
import { chunkText, rankChunks, type ScoredChunk, TOP_K } from "./rag";

export type KbDocument = {
  id: number;
  title: string;
  source: string | null;
  chunkCount: number;
  charCount: number;
  createdAt: string;
};

export type SupportLog = {
  id: number;
  question: string;
  answer: string;
  grounded: boolean;
  sources: string | null;
  topScore: number | null;
  createdAt: string;
};

export const SELECT_DOCUMENTS = `
SELECT d.id, d.title, d.source, d.created_at,
       COUNT(c.id)::int AS chunk_count,
       LENGTH(d.content)  AS char_count
FROM kb_documents d
LEFT JOIN kb_chunks c ON c.document_id = d.id
GROUP BY d.id
ORDER BY d.id DESC`;

export const SELECT_ALL_CHUNKS = `
SELECT c.id, c.document_id, c.content, c.embedding, d.title
FROM kb_chunks c
JOIN kb_documents d ON d.id = c.document_id`;

export const INSERT_DOCUMENT = `
INSERT INTO kb_documents (title, source, content) VALUES ($1, $2, $3) RETURNING id`;

export const INSERT_CHUNK = `
INSERT INTO kb_chunks (document_id, chunk_index, content, embedding)
VALUES ($1, $2, $3, $4)`;

export const DELETE_DOCUMENT = `DELETE FROM kb_documents WHERE id = $1`;

export const INSERT_SUPPORT_MESSAGE = `
INSERT INTO support_messages (question, answer, grounded, sources, top_score)
VALUES ($1, $2, $3, $4, $5)`;

export const SELECT_SUPPORT_MESSAGES = `
SELECT id, question, answer, grounded, sources, top_score, created_at
FROM support_messages ORDER BY id DESC LIMIT $1`;

/** 문서를 잘라 임베딩하고 저장합니다. */
export async function addDocument(input: {
  title: string;
  source: string | null;
  content: string;
}): Promise<{ documentId: number; chunkCount: number }> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);

  const chunks = chunkText(input.content);
  if (chunks.length === 0) throw new Error("저장할 내용이 비어 있습니다.");

  // 임베딩을 먼저 받아서, 실패하면 문서를 만들지 않습니다.
  const vectors = await embedBatch(chunks, "RETRIEVAL_DOCUMENT");

  const rows = await sql.query(INSERT_DOCUMENT, [input.title, input.source, input.content]);
  const documentId = Number(rows[0].id);

  for (let i = 0; i < chunks.length; i++) {
    await sql.query(INSERT_CHUNK, [documentId, i, chunks[i], JSON.stringify(vectors[i])]);
  }

  return { documentId, chunkCount: chunks.length };
}

export async function listDocuments(): Promise<KbDocument[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql.query(SELECT_DOCUMENTS);
  return rows.map((row) => ({
    id: Number(row.id),
    title: String(row.title),
    source: (row.source as string) ?? null,
    chunkCount: Number(row.chunk_count ?? 0),
    charCount: Number(row.char_count ?? 0),
    createdAt: new Date(row.created_at as string | Date).toISOString(),
  }));
}

export async function deleteDocument(id: number): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);
  await sql.query(DELETE_DOCUMENT, [id]);
}

function parseEmbedding(value: unknown): number[] {
  if (Array.isArray(value)) return value as number[];
  if (typeof value === "string") return JSON.parse(value) as number[];
  return [];
}

/** 질문과 가장 가까운 조각들을 찾습니다. */
export async function searchChunks(question: string, topK = TOP_K): Promise<ScoredChunk[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema(sql);

  const rows = await sql.query(SELECT_ALL_CHUNKS);
  if (rows.length === 0) return [];

  const queryVector = await embedText(question, "RETRIEVAL_QUERY");

  return rankChunks(
    queryVector,
    rows.map((row) => ({
      chunkId: Number(row.id),
      documentId: Number(row.document_id),
      documentTitle: String(row.title),
      content: String(row.content),
      embedding: parseEmbedding(row.embedding),
    })),
    topK,
  );
}

export async function logSupportMessage(input: {
  question: string;
  answer: string;
  grounded: boolean;
  sources: string | null;
  topScore: number | null;
}): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  await ensureSchema(sql);
  await sql.query(INSERT_SUPPORT_MESSAGE, [
    input.question,
    input.answer,
    input.grounded,
    input.sources,
    input.topScore,
  ]);
}

export async function listSupportMessages(limit = 50): Promise<SupportLog[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql.query(SELECT_SUPPORT_MESSAGES, [limit]);
  return rows.map((row) => ({
    id: Number(row.id),
    question: String(row.question),
    answer: String(row.answer),
    grounded: Boolean(row.grounded),
    sources: (row.sources as string) ?? null,
    topScore: row.top_score === null || row.top_score === undefined ? null : Number(row.top_score),
    createdAt: new Date(row.created_at as string | Date).toISOString(),
  }));
}
