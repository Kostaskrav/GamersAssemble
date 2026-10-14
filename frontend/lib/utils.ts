import type { PostType } from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelative(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
}

export function displayName(
  user: { username: string; displayName: string | null },
) {
  return user.displayName?.trim() || user.username;
}

export const postTypeLabel: Record<PostType, string> = {
  BUG: "Bug",
  FIX: "Fix",
  IDEA: "Idea",
};

export const postTypeClass: Record<PostType, string> = {
  BUG: "bg-[color-mix(in_srgb,var(--color-bug)_18%,transparent)] text-[var(--color-bug)] border-[color-mix(in_srgb,var(--color-bug)_35%,transparent)]",
  FIX: "bg-[color-mix(in_srgb,var(--color-fix)_18%,transparent)] text-[var(--color-fix)] border-[color-mix(in_srgb,var(--color-fix)_35%,transparent)]",
  IDEA: "bg-[color-mix(in_srgb,var(--color-idea)_18%,transparent)] text-[var(--color-idea)] border-[color-mix(in_srgb,var(--color-idea)_35%,transparent)]",
};
