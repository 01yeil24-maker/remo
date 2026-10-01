# REMO

한계 없는 버전의 팀, REMO의 팀 홈페이지입니다. Next.js(App Router) + Tailwind CSS로 만들었고,
GitHub → Vercel → Neon(Postgres) 구조로 배포합니다.

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | REMO 네 글자를 눌러 각 페이지로 이동 |
| `/roots` | 팀 소개 |
| `/experts` | 팀원 소개 |
| `/making` | 프로젝트 소개 |
| `/our-way` | 철학 |
| `/gallery` | 사진 |
| `/board` | 게시판 (글 목록 · 글쓰기 · 상세 · 삭제) |

팀원·프로젝트·철학 내용은 `src/lib/data.ts`의 정적 데이터를 쓰고,
**게시판 글만 Neon 데이터베이스에 저장**됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

데이터베이스를 연결하지 않아도 사이트는 전부 동작하고, 게시판만 "DB 연결 필요" 안내가 보입니다.

## Neon 데이터베이스 연결

1. Vercel 프로젝트 → **Storage** 탭 → **Create Database** → **Neon(Postgres)** 선택 후 프로젝트에 연결하세요.
   연결하면 `DATABASE_URL` 환경변수가 자동으로 들어갑니다.
2. 환경변수가 반영되도록 Vercel에서 **Redeploy** 한 번 눌러주세요.
3. 끝입니다. 게시판에 첫 글을 쓰면 `posts` 테이블이 자동으로 만들어지고 글이 저장됩니다.
   (테이블 구조는 `db/schema.sql` 참고)

로컬에서도 같은 DB를 쓰려면:

```bash
npx vercel env pull .env.local
npm run dev
```

## 게시판 동작 방식

- 글 저장·조회: `src/lib/posts.ts` (SQL은 상수로 분리해 두었습니다)
- DB 연결: `src/lib/db.ts` — `@neondatabase/serverless` 드라이버를 씁니다.
  HTTP로 질의하기 때문에 Vercel 서버리스 환경에서 커넥션 풀 설정이 필요 없습니다.
- 글쓰기·삭제 처리: `src/app/board/actions.ts` (Next.js 서버 액션)
- 글 삭제는 작성할 때 정한 비밀번호로만 가능하고, 비밀번호는 salt를 섞은 해시로 저장됩니다.

## 사진 업로드(선택)

`src/lib/blob.ts`에 Vercel Blob 업로드 헬퍼가 준비되어 있습니다. Storage 탭에서 Blob 스토어를
연결하면 `BLOB_READ_WRITE_TOKEN`이 설정되고, 갤러리 사진을 올려 쓸 수 있습니다.

## 배포

GitHub 저장소 `remo`의 `main` 브랜치에 올리면 Vercel이 자동으로 빌드·배포합니다.
