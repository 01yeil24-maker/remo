-- 게시판 테이블입니다.
-- 앱이 첫 질의 때 자동으로 만들기 때문에(src/lib/posts.ts의 ensureTable)
-- 따로 실행할 필요는 없고, 구조 확인용으로 둔 파일입니다.

CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  content       TEXT NOT NULL,
  password_hash TEXT NOT NULL,              -- 글 삭제용 비밀번호 (salt:hash)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
