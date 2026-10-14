import type { PostType } from "@/lib/types";
import { cn, postTypeClass, postTypeLabel } from "@/lib/utils";

export function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        postTypeClass[type],
      )}
    >
      {postTypeLabel[type]}
    </span>
  );
}
