"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteComment, getComments } from "@/lib/api/comments";
import { useAuthStore } from "@/stores/auth-store";
import { displayName, formatRelative } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CommentList({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const commentsQuery = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });

  const removeMutation = useMutation({
    mutationFn: (commentId: number) => {
      if (!token) throw new Error("Not authenticated");
      return deleteComment(token, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  if (commentsQuery.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (commentsQuery.isError) {
    return (
      <p className="text-sm text-[var(--color-bug)]">
        Could not load comments.
      </p>
    );
  }

  const comments = commentsQuery.data?.data ?? [];

  if (comments.length === 0) {
    return (
      <p className="text-sm text-[var(--color-mist)]">
        No comments yet. Be the first to reply.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="surface rounded-lg p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--color-snow)]">
                {displayName(comment.author)}
              </p>
              <p className="text-xs text-[var(--color-mist)]">
                @{comment.author.username} · {formatRelative(comment.createdAt)}
              </p>
            </div>
            {user?.id === comment.authorId && (
              <Button
                variant="ghost"
                size="sm"
                aria-label="Delete comment"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(comment.id)}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-mist)]">
            {comment.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
