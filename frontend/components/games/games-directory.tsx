"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/lib/api/games";
import { useIsAuthenticated } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/games/game-card";

export function GamesDirectory() {
  const { isAuthenticated } = useIsAuthenticated();
  const gamesQuery = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-xl border border-[var(--color-ink-border)] bg-[var(--color-ink-elevated)] px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
        <div className="relative max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-signal)]">
            Player feedback hub
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-snow)] sm:text-5xl">
            Gamers<span className="text-[var(--color-signal)]">Assemble</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--color-mist)]">
            Pick a game to browse bugs, fixes, and ideas from the community.
          </p>
          {!isAuthenticated && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register">
                <Button>Join to post</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Games
            </h2>
            <p className="mt-1 text-sm text-[var(--color-mist)]">
              Choose a title to open its forum.
            </p>
          </div>
        </div>

        {gamesQuery.isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-lg bg-white/5"
              />
            ))}
          </div>
        )}

        {gamesQuery.isError && (
          <div className="surface rounded-lg p-6 text-sm text-[var(--color-bug)]">
            Could not load games. Is the API running at{" "}
            <code className="text-[var(--color-snow)]">
              {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"}
            </code>
            ?
          </div>
        )}

        {gamesQuery.data && gamesQuery.data.length === 0 && (
          <div className="surface rounded-lg p-10 text-center">
            <p className="font-display text-xl font-bold text-[var(--color-snow)]">
              No games yet
            </p>
            <p className="mt-2 text-sm text-[var(--color-mist)]">
              Add games through the API, then they will show up here.
            </p>
          </div>
        )}

        {gamesQuery.data && gamesQuery.data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gamesQuery.data.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
