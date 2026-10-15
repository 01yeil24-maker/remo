// 게시판 글을 Neon(Postgres)에 저장하고 읽어옵니다.
// 글쓴이는 로그인한 회원이며, 수정·삭제는 본인과 관리자만 할 수 있습니다.

import { getSql } from "./db";
import { ensureSchema } from "./schema";
import type { User } from "./auth";

export { LIMITS } from "./board-config";

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number | null;
  authorName: string;
  createdAt: string;
  updatedAt: string | null;
};

export const SELECT_POSTS = `
SELECT p.id, p.title, p.content, p.author_id, p.created_at, p.updated_at,
       COALESCE(u.name, '(탈퇴한 회원)') AS author_name
FROM posts p
LEFT JOIN users u ON u.id = p.author_id
ORDER BY p.id DESC
LIMIT $1`;

export const SELECT_POST = `
SELECT p.id, p.title, p.content, p.author_id, p.created_at, p.updated_at,
       COALESCE(u.name, '(탈퇴한 회원)') AS author_name
FROM posts p
LEFT JOIN users u ON u.id = p.author_id
WHERE p.id = $1`;

export const INSERT_POST = `
INSERT INTO posts (title, content, author_id)
VALUES ($1, $2, $3)
RETURNING id`;

export const UPDATE_POST = `
UPDATE posts
SET title = $1, content = $2, updated_at = now()
WHERE id = $3`;

export const DELETE_POST = `DELETE FROM posts WHERE id = $1`;

function toPost(row: Record<string, unknown>): Post {
  return {
    id: Number(row.id),
    title: String(row.title),
    content: String(row.content),
    authorId: row.author_id === null ? null : Number(row.author_id),
    authorName: String(row.author_name),
    createdAt: new Date(row.created_at as string | Date).toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at as string | Date).toISOString() : null,
  };
}

/** 본인 글이거나 관리자면 수정·삭제할 수 있습니다. */
export function canModify(post: Post, user: User | null): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return post.authorId !== null && post.authorId === user.id;
}

export async function listPosts(limit = 50): Promise<Post[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql.query(SELECT_POSTS, [limit]);
  return rows.map(toPost);
}

export async function getPost(id: number): Promise<Post | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema(sql);
  const rows = await sql.query(SELECT_POST, [id]);
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function createPost(input: {
  title: string;
  content: string;
  authorId: number;
}): Promise<number> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);
  const rows = await sql.query(INSERT_POST, [input.title, input.content, input.authorId]);
  return Number(rows[0].id);
}

export type ModifyResult = "ok" | "not-found" | "forbidden";

export async function updatePost(
  id: number,
  input: { title: string; content: string },
  user: User,
): Promise<ModifyResult> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);

  const post = await getPost(id);
  if (!post) return "not-found";
  if (!canModify(post, user)) return "forbidden";

  await sql.query(UPDATE_POST, [input.title, input.content, id]);
  return "ok";
}

export async function deletePost(id: number, user: User): Promise<ModifyResult> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);

  const post = await getPost(id);
  if (!post) return "not-found";
  if (!canModify(post, user)) return "forbidden";

  await sql.query(DELETE_POST, [id]);
  return "ok";
}
