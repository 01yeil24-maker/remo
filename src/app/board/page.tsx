import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { isDbConfigured } from "@/lib/db";
import { listPosts, type Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";

// 글이 올라오면 바로 반영되어야 하므로 요청마다 새로 그립니다.
export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const configured = isDbConfigured();

  let posts: Post[] = [];
  let loadError = false;
  if (configured) {
    try {
      posts = await listPosts();
    } catch (error) {
      console.error("listPosts failed:", error);
      loadError = true;
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Board" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">BOARD</p>
            <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">게시판</h1>
          </div>
          <Link
            href="/board/new"
            className="rounded-full bg-brand-orange px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-orange-dark"
          >
            글쓰기
          </Link>
        </div>

        {!configured && (
          <p className="mt-10 rounded-2xl border border-brand-line bg-white/70 px-6 py-5 text-[14px] leading-[1.7] text-brand-ink/65">
            아직 데이터베이스가 연결되지 않았어요. Vercel 프로젝트의 Storage 탭에서 Neon을
            연결하면 DATABASE_URL이 자동으로 설정되고, 이 게시판이 바로 동작합니다.
          </p>
        )}

        {configured && loadError && (
          <p className="mt-10 rounded-2xl border border-brand-line bg-white/70 px-6 py-5 text-[14px] leading-[1.7] text-brand-ink/65">
            글을 불러오지 못했어요. 데이터베이스 연결 설정을 확인해 주세요.
          </p>
        )}

        {configured && !loadError && posts.length === 0 && (
          <p className="mt-10 rounded-2xl border border-brand-line bg-white/70 px-6 py-5 text-[14px] leading-[1.7] text-brand-ink/65">
            아직 글이 없어요. 첫 글을 남겨보세요.
          </p>
        )}

        {posts.length > 0 && (
          <ul className="mt-10 overflow-hidden rounded-2xl border border-brand-line bg-white/70">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-brand-line last:border-b-0">
                <Link
                  href={`/board/${post.id}`}
                  className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="text-[16px] font-semibold tracking-[-0.02em]">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-[13px] text-brand-ink/50">
                    {post.author} · {formatDate(post.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
