"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPostSchema, type CreatePostFormValues } from "@/schemas/post";
import { createPost } from "@/lib/api/posts";
import { getGames } from "@/lib/api/games";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CreatePostFormProps = {
  initialGameId?: number;
};

export function CreatePostForm({ initialGameId }: CreatePostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const gameLocked = Boolean(initialGameId);

  const gamesQuery = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "BUG",
      gameId: initialGameId ?? 0,
      platformIds: [],
    },
  });

  const selectedGameId = watch("gameId");
  const selectedGame = (gamesQuery.data ?? []).find(
    (game) => game.id === Number(selectedGameId),
  );

  useEffect(() => {
    if (initialGameId) {
      setValue("gameId", initialGameId);
    }
  }, [initialGameId, setValue]);

  useEffect(() => {
    setValue("platformIds", []);
  }, [selectedGameId, setValue]);

  const mutation = useMutation({
    mutationFn: (values: CreatePostFormValues) => {
      if (!token) throw new Error("You must be logged in");
      return createPost(token, {
        ...values,
        gameId: Number(values.gameId),
      });
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/posts/${post.id}`);
    },
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Could not create post"
        : null;

  const cancelHref = selectedGameId
    ? `/games/${selectedGameId}`
    : "/";

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="surface space-y-5 rounded-lg p-6"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Short, clear summary" {...register("title")} />
        {errors.title && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" {...register("type")}>
            <option value="BUG">Bug</option>
            <option value="FIX">Fix</option>
            <option value="IDEA">Idea</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="gameId">Game</Label>
          <Select
            id="gameId"
            {...register("gameId", { valueAsNumber: true })}
            disabled={gamesQuery.isLoading || gameLocked}
          >
            <option value={0}>Select a game</option>
            {(gamesQuery.data ?? []).map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </Select>
          {errors.gameId && (
            <p className="mt-1 text-xs text-[var(--color-bug)]">
              {errors.gameId.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label>Platforms</Label>
        {!selectedGame ? (
          <p className="text-sm text-[var(--color-mist)]">
            Choose a game to see supported platforms.
          </p>
        ) : (
          <Controller
            control={control}
            name="platformIds"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {selectedGame.platforms.map((platform) => {
                  const checked = field.value.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => {
                        field.onChange(
                          checked
                            ? field.value.filter((id) => id !== platform.id)
                            : [...field.value, platform.id],
                        );
                      }}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-sm transition",
                        checked
                          ? "border-[var(--color-signal)]/50 bg-[color-mix(in_srgb,var(--color-signal)_14%,transparent)] text-[var(--color-signal)]"
                          : "border-[var(--color-ink-border)] text-[var(--color-mist)] hover:text-[var(--color-snow)]",
                      )}
                    >
                      {platform.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
        )}
        {errors.platformIds && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">
            {errors.platformIds.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Details</Label>
        <Textarea
          id="content"
          placeholder="Steps to reproduce, expected vs actual, or your idea..."
          {...register("content")}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">
            {errors.content.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="rounded-md border border-[color-mix(in_srgb,var(--color-bug)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-bug)_12%,transparent)] px-3 py-2 text-sm text-[var(--color-bug)]">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(cancelHref)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Publishing..." : "Publish post"}
        </Button>
      </div>
    </form>
  );
}
