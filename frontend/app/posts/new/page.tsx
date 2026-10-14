import { RequireAuth } from "@/components/auth/require-auth";
import { CreatePostForm } from "@/components/posts/create-post-form";

type NewPostPageProps = {
  searchParams: Promise<{ gameId?: string }>;
};

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const params = await searchParams;
  const parsed = params.gameId ? Number(params.gameId) : undefined;
  const initialGameId =
    parsed !== undefined && !Number.isNaN(parsed) ? parsed : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          New post
        </h1>
        <p className="mt-2 text-sm text-[var(--color-mist)]">
          Report a bug, share a fix, or pitch an idea.
        </p>
      </div>
      <RequireAuth>
        <CreatePostForm initialGameId={initialGameId} />
      </RequireAuth>
    </div>
  );
}
