// Vercel Blob 헬퍼입니다. 갤러리/팀원/프로젝트 이미지를 Blob에 올리고
// 그 결과 URL을 Neon DB의 *_url 컬럼에 저장하는 흐름을 위한 유틸리티예요.
// 사용 전 Vercel 프로젝트에 Blob 스토어를 연결하고 BLOB_READ_WRITE_TOKEN을
// 환경변수로 설정하세요. (개발 안내서의 "개발 환경 구축 절차" 참고)

import { put, list, del } from "@vercel/blob";

export async function uploadImage(pathname: string, file: File | Blob) {
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function listImages(prefix?: string) {
  const { blobs } = await list({ prefix });
  return blobs;
}

export async function deleteImage(url: string) {
  await del(url);
}
