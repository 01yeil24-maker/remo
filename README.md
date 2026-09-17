# REMO

한계 없는 버전의 팀, REMO의 팀 홈페이지입니다. Next.js(App Router) + Tailwind CSS로 만들었고,
GitHub → Vercel → Neon(Postgres) → Vercel Blob 구조로 배포하도록 준비되어 있습니다.
(자세한 절차는 함께 정리한 "REMO 팀 홈페이지 개발 안내서" 문서를 참고하세요.)

## 지금 상태

- Home, Roots, Experts, Making, Our Way, Gallery 6개 페이지가 모두 동작합니다.
- 팀원·프로젝트·철학 콘텐츠는 `src/lib/data.ts`의 정적 데이터를 사용합니다. (DB 없이도 바로 실행됩니다)
- `prisma/schema.prisma`에 Neon용 스키마(TeamMember, Project, GalleryImage)를 미리 정의해 뒀습니다.
- `src/lib/blob.ts`에 Vercel Blob 업로드/조회 헬퍼가 준비되어 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Neon DB 연동하기

1. Vercel 프로젝트의 Storage 탭에서 Postgres(Neon)를 생성해 연결하면 `DATABASE_URL`이 자동으로 설정됩니다.
2. 로컬에서는 `vercel env pull`로 `.env.local`에 받아오세요. (`.env.example` 참고)
3. 아래 명령으로 스키마를 반영하고 초기 데이터를 넣습니다.

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. `tsconfig.json`의 `exclude` 배열에서 `"src/lib/db.ts"`를 지우면 `src/lib/db.ts`의 Prisma client를
   바로 사용할 수 있습니다. 이후 각 페이지가 `lib/data.ts` 대신 `lib/db.ts`로 Neon을 조회하도록 바꿔주세요.

## Vercel Blob 연동하기

1. Vercel 프로젝트의 Storage 탭에서 Blob 스토어를 생성해 연결하면 `BLOB_READ_WRITE_TOKEN`이 자동으로 설정됩니다.
2. `src/lib/blob.ts`의 `uploadImage` / `listImages` / `deleteImage`로 갤러리·팀원 사진을 업로드하고,
   반환된 URL을 Neon DB의 `photoUrl` / `coverImageUrl` / `imageUrl` 컬럼에 저장하면 됩니다.

## 배포

`main` 브랜치를 GitHub 저장소 `remo`에 push하면 Vercel이 자동으로 빌드·배포합니다.
자세한 브랜치 전략과 배포 절차는 "REMO 팀 홈페이지 개발 안내서" 문서의 해당 section을 참고하세요.
