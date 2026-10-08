// 데이터베이스 스키마입니다. 첫 질의 때 한 번만 실행되어,
// Neon만 연결하면 별도 마이그레이션 없이 테이블이 준비됩니다.

import type { SqlExecutor } from "./db";

export const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'member',   -- 'admin' | 'member'
    status        TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS posts (
    id         SERIAL PRIMARY KEY,
    title      TEXT NOT NULL,
    content    TEXT NOT NULL,
    author_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
  )`,

  // 이전 버전(비밀번호로 글을 지우던 게시판)에서 넘어오는 경우를 위한 보정입니다.
  // 이미 맞는 모양이면 아무 일도 하지 않습니다.
  `ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ`,
  `ALTER TABLE posts ALTER COLUMN author DROP NOT NULL`,
  `ALTER TABLE posts ALTER COLUMN password_hash DROP NOT NULL`,

  // 사우나 치맥 랜딩 페이지의 사전 수요 조사 응답
  `CREATE TABLE IF NOT EXISTS leads (
    id             SERIAL PRIMARY KEY,
    intent         TEXT NOT NULL,                  -- 'buy_now' | 'interested' | 'curious'
    contact        TEXT,                           -- 쿠폰 받을 이메일 (선택)
    improvement    TEXT,                           -- 개선 요청
    age_band       TEXT,
    gender         TEXT,
    region         TEXT,
    preferred_time TEXT,
    price_band     TEXT,
    survey_done    BOOLEAN NOT NULL DEFAULT false,
    coupon_code    TEXT,
    coupon_sent    BOOLEAN NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (id DESC)`,
  `CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS leads_coupon_code_idx ON leads (coupon_code) WHERE coupon_code IS NOT NULL`,
];

let schemaReady = false;

export async function ensureSchema(sql: SqlExecutor): Promise<void> {
  if (schemaReady) return;
  for (const statement of SCHEMA_STATEMENTS) {
    try {
      await sql.query(statement);
    } catch (error) {
      // 위 ALTER 문들은 해당 컬럼이 처음부터 없는 새 설치에서는 실패할 수 있습니다.
      // 새 설치에서는 보정이 필요 없으므로 조용히 넘어갑니다.
      if (!statement.startsWith("ALTER TABLE")) throw error;
    }
  }
  schemaReady = true;
}
