import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-[var(--color-ink-border)] bg-[var(--color-ink)] px-3 py-2.5 text-sm text-[var(--color-snow)] outline-none transition focus:border-[var(--color-signal)]/60 focus:ring-2 focus:ring-[var(--color-signal)]/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
