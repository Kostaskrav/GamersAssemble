import { PostDetail } from "@/components/posts/post-detail";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return (
      <div className="surface rounded-lg p-8 text-center text-sm text-[var(--color-bug)]">
        Invalid post id.
      </div>
    );
  }

  return <PostDetail postId={postId} />;
}
