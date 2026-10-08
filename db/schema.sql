-- REMO 사이트가 쓰는 테이블입니다.
-- 앱이 첫 질의 때 자동으로 만들기 때문에(src/lib/schema.ts) 직접 실행할 필요는 없고,
-- 구조 확인용으로 둔 파일입니다.

-- 회원: 가입하면 status='pending'(승인 대기), 관리자가 승인해야 로그인됩니다.
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,                    -- salt:scrypt 해시
  role          TEXT NOT NULL DEFAULT 'member',   -- 'admin' | 'member'
  status        TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 로그인 세션: 쿠키에는 원본 토큰, DB에는 해시만 저장합니다.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 게시판 글
CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  author_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);
