"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";
import { deletePost, getPost } from "@/lib/api/posts";
import { useAuthStore } from "@/stores/auth-store";
import { displayName, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PostTypeBadge } from "@/components/posts/post-type-badge";
import { CommentList } from "@/components/comments/comment-list";
import { CommentForm } from "@/components/comments/comment-form";

export function PostDetail({ postId }: { postId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const postQuery = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
  });

  const removeMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error("Not authenticated");
      return deletePost(token, postId);
    },
    onSuccess: (deleted) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/games/${deleted.gameId}`);
    },
  });

  if (postQuery.isLoading) {
    return <div className="h-80 animate-pulse rounded-lg bg-white/5" />;
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <div className="surface rounded-lg p-8 text-center">
        <p className="font-display text-xl font-bold">Post not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="secondary">Back to games</Button>
        </Link>
      </div>
    );
  }

  const post = postQuery.data;
  const isOwner = user?.id === post.authorId;

  return (
    <div className="space-y-8">
      <Link
        href={`/games/${post.gameId}`}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-mist)] transition hover:text-[var(--color-snow)]"
      >
        <ArrowLeft size={14} />
        Back to {post.game.name}
      </Link>

      <article className="surface rounded-lg p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <PostTypeBadge type={post.type} />
          <span className="text-xs text-[var(--color-mist)]">{post.game.name}</span>
          {post.platforms.map((platform) => (
            <span
              key={platform.id}
              className="rounded border border-[var(--color-ink-border)] px-1.5 py-0.5 text-[11px] text-[var(--color-mist)]"
            >
              {platform.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--color-snow)] sm:text-4xl">
            {post.title}
          </h1>
          {isOwner && (
            <Button
              variant="danger"
              size="sm"
              disabled={removeMutation.isPending}
              onClick={() => {
                if (confirm("Delete this post?")) {
                  removeMutation.mutate();
                }
              }}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          )}
        </div>

        <p className="mt-3 text-sm text-[var(--color-mist)]">
          by{" "}
          <span className="text-[var(--color-snow)]">
            {displayName(post.author)}
          </span>{" "}
          · {formatDate(post.createdAt)}
        </p>

        <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-[var(--color-mist)]">
          {post.content}
        </div>
      </article>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Comments
        </h2>
        <CommentForm postId={postId} />
        <CommentList postId={postId} />
      </section>
    </div>
  );
}
