import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getPost } from "@/lib/posts";
import { formatDateTime } from "@/lib/format";
import DeleteForm from "./DeleteForm";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: PageProps<"/board/[id]">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  const post = await getPost(postId);
  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Board" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <Link
          href="/board"
          className="text-[14px] font-medium text-brand-ink/50 transition-colors hover:text-brand-orange"
        >
          ← 목록으로
        </Link>

        <article className="mt-6 max-w-3xl">
          <h1 className="text-[26px] font-bold sm:text-[34px]">{post.title}</h1>
          <p className="mt-3 text-[14px] text-brand-ink/50">
            {post.author} · {formatDateTime(post.createdAt)}
          </p>
          <div className="mt-8 border-t border-brand-line pt-8">
            <p className="whitespace-pre-wrap text-[16px] leading-[1.8] text-brand-ink/80">
              {post.content}
            </p>
          </div>
        </article>

        <div className="mt-12 max-w-3xl border-t border-brand-line pt-8">
          <DeleteForm id={post.id} />
        </div>
      </main>
    </div>
  );
}
