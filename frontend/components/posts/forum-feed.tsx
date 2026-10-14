"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
} from "lucide-react";
import { getPosts } from "@/lib/api/posts";
import { getGame } from "@/lib/api/games";
import type { PostType } from "@/lib/types";
import { useIsAuthenticated } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import { PostFilters } from "@/components/posts/post-filters";

type ForumFeedProps = {
  gameId: number;
};

export function ForumFeed({ gameId }: ForumFeedProps) {
  const { isAuthenticated } = useIsAuthenticated();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    type?: PostType;
    platformId?: number;
  }>({});

  const gameQuery = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGame(gameId),
  });

  const queryKey = useMemo(
    () => ["posts", { gameId, ...filters, page }],
    [gameId, filters, page],
  );

  const postsQuery = useQuery({
    queryKey,
    queryFn: () =>
      getPosts({
        gameId,
        type: filters.type,
        platformId: filters.platformId,
        page,
        limit: 10,
      }),
  });

  const pagination = postsQuery.data?.pagination;
  const game = gameQuery.data;

  if (gameQuery.isError) {
    return (
      <div className="surface rounded-lg p-8 text-center">
        <p className="font-display text-xl font-bold">Game not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="secondary">Back to games</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-mist)] transition hover:text-[var(--color-snow)]"
      >
        <ArrowLeft size={14} />
        All games
      </Link>

      <section className="relative overflow-hidden rounded-xl border border-[var(--color-ink-border)] bg-[var(--color-ink-elevated)] px-6 py-8 sm:px-10">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {gameQuery.isLoading ? (
              <div className="h-10 w-56 animate-pulse rounded bg-white/5" />
            ) : (
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-signal)]">
                  Game forum
                </p>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-snow)] sm:text-4xl">
                  {game?.name}
                </h1>
                {game?.description && (
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-mist)]">
                    {game.description}
                  </p>
                )}
                {game && game.platforms.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform.id}
                        className="rounded border border-[var(--color-ink-border)] px-1.5 py-0.5 text-[11px] text-[var(--color-mist)]"
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {isAuthenticated ? (
            <Link href={`/posts/new?gameId=${gameId}`}>
              <Button>
                <MessageSquarePlus size={16} />
                New post
              </Button>
            </Link>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(`/posts/new?gameId=${gameId}`)}`}>
              <Button variant="secondary">Log in to post</Button>
            </Link>
          )}
        </div>
      </section>

      <PostFilters
        type={filters.type}
        platformId={filters.platformId}
        platforms={game?.platforms}
        onChange={(next) => {
          setPage(1);
          setFilters({
            type: next.type,
            platformId: next.platformId,
          });
        }}
      />

      {postsQuery.isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      )}

      {postsQuery.isError && (
        <div className="surface rounded-lg p-6 text-sm text-[var(--color-bug)]">
          Could not load posts for this game.
        </div>
      )}

      {postsQuery.data && postsQuery.data.data.length === 0 && (
        <div className="surface rounded-lg p-10 text-center">
          <p className="font-display text-xl font-bold text-[var(--color-snow)]">
            No posts yet
          </p>
          <p className="mt-2 text-sm text-[var(--color-mist)]">
            Be the first to share a bug, fix, or idea for this game.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {postsQuery.data?.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <p className="text-sm text-[var(--color-mist)]">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
