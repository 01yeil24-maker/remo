import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@/lib/auth";
import { canModify, getPost } from "@/lib/posts";
import { formatDateTime } from "@/lib/format";
import DeleteForm from "./DeleteForm";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: PageProps<"/board/[id]">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  const post = await getPost(postId);
  if (!post) notFound();

  const user = await currentUser();
  const editable = canModify(post, user);

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
            {post.authorName} · {formatDateTime(post.createdAt)}
            {post.updatedAt && ` · ${formatDateTime(post.updatedAt)} 수정됨`}
          </p>
          <div className="mt-8 border-t border-brand-line pt-8">
            <p className="whitespace-pre-wrap text-[16px] leading-[1.8] text-brand-ink/80">
              {post.content}
            </p>
          </div>
        </article>

        {editable && (
          <div className="mt-12 flex max-w-3xl flex-wrap items-start gap-3 border-t border-brand-line pt-8">
            <Link
              href={`/board/${post.id}/edit`}
              className="rounded-full border border-brand-line px-5 py-2.5 text-[14px] font-medium text-brand-ink/60 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              수정
            </Link>
            <DeleteForm id={post.id} />
          </div>
        )}
      </main>
    </div>
  );
}
