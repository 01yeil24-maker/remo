import { notFound, redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@/lib/auth";
import { canModify, getPost } from "@/lib/posts";
import PostEditor from "../../PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: PageProps<"/board/[id]/edit">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  const user = await currentUser();
  if (!user) redirect("/login");

  const post = await getPost(postId);
  if (!post) notFound();
  if (!canModify(post, user)) redirect(`/board/${postId}`);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Board" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">BOARD</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">글 수정</h1>
        <PostEditor
          mode="edit"
          id={post.id}
          initialTitle={post.title}
          initialContent={post.content}
        />
      </main>
    </div>
  );
}
