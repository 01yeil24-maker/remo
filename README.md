# REMO

한계 없는 버전의 팀, REMO의 팀 홈페이지입니다. Next.js(App Router) + Tailwind CSS로 만들었고,
GitHub → Vercel → Neon(Postgres) 구조로 배포합니다.

## 페이지

| 경로 | 내용 | 권한 |
| --- | --- | --- |
| `/` | REMO 네 글자를 눌러 각 페이지로 이동 | 누구나 |
| `/roots` `/experts` `/making` `/our-way` `/gallery` | 팀·팀원·프로젝트·철학·사진 소개 | 누구나 |
| `/board` | 게시판 목록·상세 | 읽기는 누구나 |
| `/board/new`, `/board/[id]/edit` | 글쓰기·수정 | 승인된 회원 |
| `/signup` `/login` | 가입 신청·로그인 | 누구나 |
| `/sauna-chimaek` | 사우나 치맥 세션 랜딩 페이지 (사전 수요 조사) | 누구나 |
| `/admin/members` | 회원 승인 관리 | 관리자 |
| `/admin/leads` | 사우나 치맥 응답 집계·쿠폰 관리·CSV | 관리자 |

소개 페이지 내용은 `src/lib/data.ts`의 정적 데이터를 쓰고, **회원 정보와 게시판 글만**
Neon 데이터베이스에 저장됩니다.

## 회원 승인 방식

1. 누구나 `/signup`에서 가입을 신청할 수 있습니다. 신청하면 **승인 대기** 상태가 되고,
   이 상태로는 로그인할 수 없습니다.
2. 관리자가 `/admin/members`에서 **승인**하면 그때부터 로그인할 수 있습니다.
   승인된 회원을 다시 **승인 취소**하면 로그인 중이던 세션도 바로 끊깁니다.
3. 첫 관리자는 환경변수 `ADMIN_EMAILS`로 정합니다. 여기 적힌 이메일로 가입하면
   승인 절차 없이 바로 관리자가 됩니다. (쉼표로 여러 명 지정 가능)

글은 쓴 사람 본인과 관리자만 수정·삭제할 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

데이터베이스를 연결하지 않아도 소개 페이지는 전부 동작하고, 게시판·로그인에만
"DB 연결 필요" 안내가 보입니다.

## Vercel 설정 (두 가지)

1. **Neon 연결** — 프로젝트 → Storage 탭 → Create Database → Neon(Postgres)을 만들어
   프로젝트에 연결하면 `DATABASE_URL`이 자동으로 들어갑니다.
2. **관리자 지정** — 프로젝트 → Settings → Environment Variables 에서
   `ADMIN_EMAILS`에 관리자로 쓸 이메일을 넣어주세요.

두 가지를 설정한 뒤 **Redeploy** 하면 적용됩니다. 테이블은 첫 접속 때 자동으로 만들어지므로
SQL을 직접 실행할 필요는 없습니다. (구조는 `db/schema.sql` 참고)

로컬에서도 같은 DB를 쓰려면 `npx vercel env pull .env.local` 후 `npm run dev`.

## 사우나 치맥 랜딩 페이지

`/sauna-chimaek`은 세션을 열기 전 수요를 확인하는 페이지입니다. 방문자는 세 가지를 남깁니다.

1. **참여 의향** — 바로 신청 / 관심 있음 / 구경만 (필수)
2. **개선 요청** — 바꿨으면 하는 점을 자유롭게 (선택)
3. **설문** — 나이대·성별·지역·선호 시간대·희망 가격 (선택)

설문에 하나라도 답하면 `REMO-XXXX-XXXX` 형태의 **커피 쿠폰 코드가 즉시 발급**되어 화면에
표시되고, DB에도 저장됩니다. 이때 이메일을 받도록 해두었습니다.

관리자는 `/admin/leads`에서 응답 집계(참여 의향·나이대·희망 가격·시간대 분포)를 보고,
쿠폰을 보낸 뒤 **발송 완료**로 표시하거나 CSV로 내려받을 수 있습니다.

> 쿠폰 자동 발송(메일 전송)은 아직 붙어 있지 않습니다. 코드는 화면에 바로 보여주고,
> 실제 발송은 관리자가 처리한 뒤 체크하는 방식입니다. 메일 자동화가 필요하면
> `src/lib/leads.ts`의 발급 지점에 메일 API를 연결하면 됩니다.

세션 기획 수치(가격·정원·소요 시간)와 설문 선택지는 `src/lib/sauna-config.ts` 한 곳에서
고칠 수 있습니다.

## 코드 구조

- `src/lib/db.ts` — Neon 연결 (`@neondatabase/serverless`, HTTP 질의라 커넥션 풀 설정 불필요)
- `src/lib/schema.ts` — 테이블 정의와 자동 생성
- `src/lib/auth.ts` — 가입·로그인·세션·승인 처리
- `src/lib/posts.ts` — 게시판 글 CRUD와 수정 권한 판정
- `src/lib/leads.ts` — 사우나 치맥 응답 저장·집계·쿠폰 발급·CSV
- `src/lib/sauna-config.ts` — 세션 기획 수치와 설문 선택지
- `src/app/auth-actions.ts`, `src/app/board/actions.ts` — 서버 액션

비밀번호는 salt를 섞은 scrypt 해시로 저장하고, 세션 토큰도 해시 형태로만 DB에 둡니다.
세션 쿠키는 httpOnly입니다.

## 사진 업로드(선택)

`src/lib/blob.ts`에 Vercel Blob 업로드 헬퍼가 있습니다. Storage 탭에서 Blob 스토어를
연결하면 `BLOB_READ_WRITE_TOKEN`이 설정되고, 갤러리 사진을 올려 쓸 수 있습니다.

## 배포

GitHub 저장소 `remo`의 `main` 브랜치에 올리면 Vercel이 자동으로 빌드·배포합니다.
