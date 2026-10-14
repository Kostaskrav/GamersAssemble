import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { displayName, formatRelative } from "@/lib/utils";
import { PostTypeBadge } from "@/components/posts/post-type-badge";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="surface surface-hover group rounded-lg p-5 transition duration-200">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <PostTypeBadge type={post.type} />
        <span className="text-xs text-[var(--color-mist)]">{post.game.name}</span>
        {post.platforms.slice(0, 3).map((platform) => (
          <span
            key={platform.id}
            className="rounded border border-[var(--color-ink-border)] px-1.5 py-0.5 text-[11px] text-[var(--color-mist)]"
          >
            {platform.name}
          </span>
        ))}
      </div>

      <Link href={`/posts/${post.id}`} className="block">
        <h2 className="font-display text-xl font-bold tracking-tight text-[var(--color-snow)] transition group-hover:text-[var(--color-signal)]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-mist)]">
          {post.content}
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--color-ink-border)]/70 pt-3 text-xs text-[var(--color-mist)]">
        <span>
          by{" "}
          <span className="text-[var(--color-snow)]">
            {displayName(post.author)}
          </span>{" "}
          · {formatRelative(post.createdAt)}
        </span>
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center gap-1 text-[var(--color-signal)] opacity-0 transition group-hover:opacity-100"
        >
          Open <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
