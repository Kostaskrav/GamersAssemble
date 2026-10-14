"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentSchema, type CommentFormValues } from "@/schemas/comment";
import { createComment } from "@/lib/api/comments";
import { ApiError } from "@/lib/api/client";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CommentForm({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const { isAuthenticated, hydrated } = useIsAuthenticated();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: CommentFormValues) => {
      if (!token) throw new Error("Not authenticated");
      return createComment(token, postId, values.content);
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  if (!hydrated) {
    return <div className="h-32 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="surface rounded-lg p-5 text-sm text-[var(--color-mist)]">
        <Link href="/login" className="text-[var(--color-signal)] underline-offset-2 hover:underline">
          Log in
        </Link>{" "}
        or{" "}
        <Link href="/register" className="text-[var(--color-signal)] underline-offset-2 hover:underline">
          create an account
        </Link>{" "}
        to leave a comment.
      </div>
    );
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Could not post comment"
        : null;

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="surface space-y-3 rounded-lg p-5"
    >
      <Label htmlFor="comment">Your reply</Label>
      <Textarea
        id="comment"
        placeholder="Share context, ask a question, or suggest a fix..."
        {...register("content")}
      />
      {errors.content && (
        <p className="text-xs text-[var(--color-bug)]">{errors.content.message}</p>
      )}
      {errorMessage && (
        <p className="text-xs text-[var(--color-bug)]">{errorMessage}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </form>
  );
}
