// 게시판 글을 Neon(Postgres)에 저장하고 읽어오는 부분입니다.
// SQL 문자열을 상수로 빼두어서 테스트(scripts/test-posts-sql.mjs)에서
// 똑같은 문장을 실제 Postgres로 실행해 검증합니다.

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getSql, type SqlExecutor } from "./db";

export { LIMITS } from "./board-config";

export type Post = {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string; // ISO 문자열
};

export const CREATE_POSTS_TABLE = `
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

export const SELECT_POSTS = `
SELECT id, title, author, content, created_at
FROM posts
ORDER BY id DESC
LIMIT $1`;

export const SELECT_POST = `
SELECT id, title, author, content, created_at
FROM posts
WHERE id = $1`;

export const INSERT_POST = `
INSERT INTO posts (title, author, content, password_hash)
VALUES ($1, $2, $3, $4)
RETURNING id`;

export const SELECT_PASSWORD_HASH = `SELECT password_hash FROM posts WHERE id = $1`;

export const DELETE_POST = `DELETE FROM posts WHERE id = $1`;

// ── 비밀번호 (글 삭제용) ───────────────────────────────────────────────
// 평문으로 저장하지 않고 salt를 섞어 해시로 보관합니다.

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ── 테이블 준비 ────────────────────────────────────────────────────────
// 첫 질의 때 테이블이 없으면 만들어 둡니다. 별도의 마이그레이션 명령 없이
// Neon만 연결하면 게시판이 바로 동작합니다.

let tableReady = false;

export async function ensureTable(sql: SqlExecutor): Promise<void> {
  if (tableReady) return;
  await sql.query(CREATE_POSTS_TABLE);
  tableReady = true;
}

// ── 조회 / 작성 / 삭제 ─────────────────────────────────────────────────

function toPost(row: Record<string, unknown>): Post {
  return {
    id: Number(row.id),
    title: String(row.title),
    author: String(row.author),
    content: String(row.content),
    createdAt: new Date(row.created_at as string | Date).toISOString(),
  };
}

export async function listPosts(limit = 50): Promise<Post[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureTable(sql);
  const rows = await sql.query(SELECT_POSTS, [limit]);
  return rows.map(toPost);
}

export async function getPost(id: number): Promise<Post | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureTable(sql);
  const rows = await sql.query(SELECT_POST, [id]);
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function createPost(input: {
  title: string;
  author: string;
  content: string;
  password: string;
}): Promise<number> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL이 설정되어 있지 않습니다.");
  await ensureTable(sql);
  const rows = await sql.query(INSERT_POST, [
    input.title,
    input.author,
    input.content,
    hashPassword(input.password),
  ]);
  return Number(rows[0].id);
}

export type DeleteResult = "ok" | "not-found" | "wrong-password";

export async function deletePost(id: number, password: string): Promise<DeleteResult> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL이 설정되어 있지 않습니다.");
  await ensureTable(sql);

  const rows = await sql.query(SELECT_PASSWORD_HASH, [id]);
  if (rows.length === 0) return "not-found";
  if (!verifyPassword(password, String(rows[0].password_hash))) return "wrong-password";

  await sql.query(DELETE_POST, [id]);
  return "ok";
}
