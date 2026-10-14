import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import type { Game } from "@/lib/types";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="surface surface-hover group flex flex-col overflow-hidden rounded-lg transition duration-200"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ink)]">
        {game.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.coverImageUrl}
            alt={game.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(62,224,162,0.18),transparent_55%)]">
            <Gamepad2
              size={40}
              className="text-[var(--color-signal)] opacity-70"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--color-snow)] transition group-hover:text-[var(--color-signal)]">
            {game.name}
          </h2>
          <ArrowUpRight
            size={16}
            className="mt-1 shrink-0 text-[var(--color-signal)] opacity-0 transition group-hover:opacity-100"
          />
        </div>

        {game.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-mist)]">
            {game.description}
          </p>
        )}

        {game.platforms.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
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
      </div>
    </Link>
  );
}
